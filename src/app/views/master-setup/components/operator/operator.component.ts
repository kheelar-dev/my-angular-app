import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ColumnChooserService, DialogEditEventArgs, EditService, EditSettingsModel, ExcelExportService, ExcelQueryCellInfoEventArgs, GridComponent, GridModule, PageService, PageSettingsModel, ResizeService, SaveEventArgs, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { DatePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ClickEventArgs } from "@syncfusion/ej2-navigations";
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { NumericTextBoxModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Dialog, DialogModule } from '@syncfusion/ej2-angular-popups';
import { Browser } from '@syncfusion/ej2-base';
import Swal from 'sweetalert2';
import { MasterSetupService } from '../master-setup.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-operator',
  imports: [
    CommonModule,
    FormsModule,
    GridModule,
    DatePickerModule,
    DateTimePickerModule,
    ReactiveFormsModule,
    DropDownListAllModule,
    TextBoxModule,
    NumericTextBoxModule,
    DialogModule,
    NgxSpinnerModule,
    ToastrModule
    
  ],
  providers: [PageService, SortService, EditService, ToolbarService, ExcelExportService, ResizeService, ColumnChooserService],
  templateUrl: './operator.component.html',
  styleUrl: './operator.component.scss',
})
export class OperatorComponent {
  operatorForm: any;
  public pageSettings?: object;
  editSettings: EditSettingsModel = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: ToolbarItems[] = ['Add', 'Edit', 'Delete', 'Search'];
  submitClicked: boolean = false;
  public enableAdaptiveUIFlag = false;
  data: any[] = [];   
  @Input() enableAdaptiveUI: boolean = false;
  @Input() rowRenderingMode: 'Vertical' | 'Horizontal' = 'Horizontal';
  public isMobile: boolean = false;
  @ViewChild('Grid') public grid!: GridComponent;

  constructor(
    private service: MasterSetupService,
    private spinner: NgxSpinnerService,

  ) {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const width = window.innerWidth;
    if (width <= 1024) {
      // Mobile / Tablet
      this.isMobile = true;
      this.enableAdaptiveUIFlag = true;
      this.rowRenderingMode = 'Vertical';
    } else {
      // Desktop
      this.isMobile = false;
      this.enableAdaptiveUIFlag = false;
      this.rowRenderingMode = 'Horizontal';
    }
  }

  ngOnInit(): void {
    this.pageSettings = { pageSize: 50, pageSizes: ['All', 10, 20, 50, 100] };
    this.loadTableData();
  }

  loadTableData() {
    this.spinner.show();
    this.service.getOperatorList()
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.grid.dataSource  = result;
        this.spinner.hide();
    });
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
        this.submitClicked = false;
        this.operatorForm = this.createFormGroup(args.rowData);
        return;
    }

    if (args.requestType === 'save') {
        this.submitClicked = true;
        if (this.operatorForm.valid) {
            let formData = this.operatorForm.value;
            if (args.action === 'add') {
              this.addOperator(formData);
            }
            else {
              this.updateOperator(formData);
            }
        } else {
            args.cancel = true;
        }
        return;
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].operatorID;
      this.deleteOperator(id);
      return;
    }
  }

  actionComplete(args: any): void {
    if (!this.isMobile && (args.requestType === 'beginEdit' || args.requestType === 'add')) {
      args.dialog.width = 800;
      args.dialog.header = args.requestType === 'beginEdit'
        ? 'Edit Operator'
        : 'Add New Operator';
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      operatorID: new FormControl(data.operatorID, Validators.required),
      operatorName: new FormControl(data.operatorName, Validators.required),
      email: new FormControl(data.email)
    });
  }

  addOperator(formData: any) {
    this.spinner.show();
    this.service
      .createOperator(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.loadTableData();
        if (result.status == true) {
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('Operator', result.messageContent, 'error');
        }
      });
  }

  updateOperator(formData: any) {
    this.spinner.show();
    this.service
      .updateOperator(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.loadTableData();
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('Operator', result.messageContent, 'error');
        }
      });
  }

  deleteOperator(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      cancelButtonText: 'No, cancel',
      confirmButtonText: 'Yes, delete it!',
    }).then((response: any) => {
      if (response.value) {
        this.spinner.show();
        this.service
          .deleteOperator(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('Operator', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  validateControl(controlName: string) {
    const control = this.operatorForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('Operator', msg, 'success');
    
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Operator', error.toString(), 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport();
    }
  }

  exportQueryCellInfo(args: ExcelQueryCellInfoEventArgs ): void {
    if (args.column.headerText === '') {
      args.hyperLink = {
          target:  (args as any).data,
          displayText: (args as any).data
      };
    }
  }
}
