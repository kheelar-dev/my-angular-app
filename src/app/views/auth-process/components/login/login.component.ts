import { Component } from '@angular/core';
import {  FormControl, FormGroup,  FormsModule,  ReactiveFormsModule,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../../../../shared/services/auth-service.service';
import { AuthResponseDto } from '../../../../shared/interfaces/auth-response-dto';
import { CommonModule } from '@angular/common';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropDownListAllModule,
    TextBoxModule,
    NgxSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  submitted = false;
  error = '';
  returnUrl: string="";
  errorMessage: string = "";
  showErrorMsg: boolean= false;
  loginForm:any;
  currentApplicationVersion = environment.appVersion;

  // tslint:disable-next-line: max-line-length
  constructor(private route: ActivatedRoute,
    private router: Router, private service: AuthService,
    private spinner: NgxSpinnerService,
   ) { }

    ngOnInit(): void {

      localStorage.clear();

      this.loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required)
      });
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    }

  onFormSubmit() {
    this.spinner.show();
    this.showErrorMsg = false;
    const formValues = this.loginForm.value;
    this.service.loginUser(formValues)
    .subscribe({
      next: (res:AuthResponseDto) => {
        localStorage.setItem("token", res.token);
        const email = this.service.getCurrentUser().email;
        const role = this.service.getCurrentUser().role;
        localStorage.setItem("currentUser", email);
        localStorage.setItem("currentRole", role);
        this.service.sendAuthStateChangeNotification(res.isAuthSuccessful);
        this.router.navigate([this.returnUrl]);
        this.spinner.hide();
    },
    error: (err: HttpErrorResponse) => {
      if(err.message.length>0)
        {
      this.errorMessage = "The user name or password are incorrect";
        }
        else
        {
          this.errorMessage = "API Error";
        }
      this.showErrorMsg = true;
      this.spinner.hide();
    }});
   }

 

   validateControl(controlName: string) {
    return this.loginForm.get(controlName).invalid && this.loginForm.get(controlName).touched;
  }

  hasError (controlName: string, errorName: string) {
    return this.loginForm.get(controlName).hasError(errorName)
  }
}
