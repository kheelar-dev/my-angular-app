import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckBoxModule, ClickEventArgs } from '@syncfusion/ej2-angular-buttons';
import { TimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CheckBoxSelectionService, DropDownListAllModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { DialogEditEventArgs, EditService, EditSettingsModel, ExcelExportService, ExcelQueryCellInfoEventArgs, GridComponent, GridLine, GridModule, PageService, PageSettingsModel, ResizeService, SaveEventArgs, SortService, ToolbarItems, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { NumericTextBoxAllModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { Dialog, DialogComponent, DialogModule } from '@syncfusion/ej2-angular-popups';
import { Browser } from '@syncfusion/ej2-base';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthProcessService } from '../auth-process.service';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    DropDownListAllModule,
    NumericTextBoxAllModule,
    TextBoxModule,
    DialogModule,
    MultiSelectModule,
    TimePickerModule,
    CheckBoxModule,
    NgxSpinnerModule],
  providers:[PageService,ResizeService, SortService, EditService, ToolbarService,ExcelExportService,CheckBoxSelectionService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowAdding: true, allowEditing: false, allowDeleting: true, mode: 'Dialog' };
  toolbar: ToolbarItems[]=['Add', 'Delete', 'Search'];
  submitClicked: boolean = false;
  yardList:any[]=[];
  ownerList:any[]=[];
  roleList:any[]=[]
  registerForm: any;
  yard:string = "";
  yardCodeList:any[]=[];
  currentRole:string = "";

  @ViewChild('Grid') public grid!: GridComponent;

  constructor(
    private service: AuthProcessService,
    private spinner: NgxSpinnerService,
    //private passConfValidator: PasswordConfirmationValidatorService,

  ) {}

  ngOnInit(): void {

    // if(localStorage.getItem('currentRole')=='Admin' || localStorage.getItem('currentRole')=='SysAdmin'){
    //   this.toolbar=['Add', 'Delete', 'Search'];
    // }
    this.loadTableData();
    this.getRoleList();
  }

  loadTableData() {
    this.spinner.show();
    this.service.getUserList()
      .pipe(catchError((err) => of(this.showError(err))))
        .subscribe((result) => {
          this.grid.dataSource  = result;
          this.spinner.hide();
      });
    
  }

  getRoleList() {
    this.service.getRoleList()
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.roleList  = result;
    });
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
        this.submitClicked = false;
        this.registerForm = new FormGroup ({
          email: new FormControl('', [Validators.required, Validators.email]),
          password: new FormControl('', Validators.required),
          confirmPassword: new FormControl('',Validators.required),
          role: new FormControl('', Validators.required),
        });

        //this.registerForm.get('confirmPassword').setValidators([Validators.required,
        //this.passConfValidator.validateConfirmPassword(this.registerForm.get('password'))]);
        return;
    }

    if (args.requestType === 'save') {
        this.submitClicked = true;
        if (this.registerForm.valid) {
            let formData = this.registerForm.value;
            const yardCode=JSON.stringify(formData.yardCode);
            formData.yardCode=yardCode;
            formData.createdUser=localStorage.getItem("currentUser");
            if (args.action === 'add') {
              formData.haulierID = 0;
              this.createUser(formData);
            }
        } else {
            args.cancel = true;
        }
        return;
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].id;
      this.deleteUser(id);
      return;
    }
  }


  actionComplete(args: any): void {
    if (args.requestType === 'beginEdit' || args.requestType === 'add') {
      args.dialog.width = 700;
      args.dialog.header = args.requestType === 'beginEdit'
        ? ''
        : 'Add New User Register';
    }
  }

  createUser(formData: any) {
    this.spinner.show();
    this.service.createUser(formData)
    .subscribe({
      next: (_) => {
        this.showSuccess("Successfully registered!");
        this.loadTableData();
      },
      error: (err: HttpErrorResponse) => {
        this.spinner.hide();
        Swal.fire('User Register', err.error.errors[0], 'error');
        this.loadTableData();
      }
    })
  }

  deleteUser(id: any) {
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
          .deleteUser(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('User Register', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  validateControl(controlName: string) {
    const control = this.registerForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  hasError (controlName: string, errorName: string) {
    return this.registerForm.get(controlName).hasError(errorName)
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    Swal.fire('User Register', msg, 'success');
    // this.toastr.success(msg, 'User Register', {
    //   timeOut: 2000,
    // });
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('User Register', error.toString(), 'error');
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
