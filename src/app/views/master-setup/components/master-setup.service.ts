import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class MasterSetupService {
  
  constructor(private http: HttpClient) { }

  getOperatorList() {
    console.log(`${environment.baseUrl}/Operator`);
    return this.http.get<any>(`${environment.baseUrl}/Operator`);
  }

  createOperator(data: any) {
    return this.http.post<any>(`${environment.baseUrl}/Operator`, data, httpOptions);
  }

  updateOperator(data: any) {
    return this.http.put<any>(`${environment.baseUrl}/Operator`, data, httpOptions);
  }

  deleteOperator(id: any) {
    return this.http.delete<any>(`${environment.baseUrl}/Operator/${id}`, httpOptions);
  }
}
