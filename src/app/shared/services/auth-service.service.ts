import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthResponseDto } from '../interfaces/auth-response-dto';
import { UserForAuthenticationDto } from '../interfaces/user-for-authentication-dto';
import { ResetPasswordDto } from '../interfaces/reset-password-dto';
import { environment } from '../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authChangeSub = new Subject<boolean>()
  public authChanged = this.authChangeSub.asObservable();

  constructor(private http: HttpClient,private jwtHelper: JwtHelperService) { }

  sendAuthStateChangeNotification (isAuthenticated: boolean) {
    this.authChangeSub.next(isAuthenticated);
  }

  isUserAuthenticated (): boolean {
    const token = localStorage.getItem("token");
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getCurrentUser() {
    const token = localStorage.getItem("token") || '';
    const decodedToken = this.jwtHelper.decodeToken(token);
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    const name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    const email = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
    const user = {
      name: name,
      email: email,
      role: role
    };
    return user;
  }

  loginUser(data: UserForAuthenticationDto) {
    return this.http.post<AuthResponseDto>(
      `${environment.baseUrl}/Account/login`,
      data,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    );
  }

  resetPassword(data: ResetPasswordDto) {
    return this.http.post(
      `${environment.baseUrl}/Account/login`,
      data,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }
    );
  }

}
