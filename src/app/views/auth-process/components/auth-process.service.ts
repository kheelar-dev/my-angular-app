import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class AuthProcessService {
  constructor(private http: HttpClient) { }
  
    getRoleList() {
      console.log(`${environment.baseUrl}/Account/roles`);
      return this.http.get<any>(`${environment.baseUrl}/Account/roles`);
    }

    getUserList() {
      return this.http.get<any>(`${environment.baseUrl}/Account/users`);
    }
  
    // createUser(data: any) {
    //   return this.http.post<any>(`${environment.baseUrl}/Account/register`, data, httpOptions);
    // }

    createUser(data: any) {
      return this.http.post<any>(
        `${environment.baseUrl}/Account/register`,
        data,
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
      );
    }
    

    deleteUser(id: any) {
      return this.http.delete<any>(`${environment.baseUrl}/Account/${id}`, httpOptions);
    }
}
