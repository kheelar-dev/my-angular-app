import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import Swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class CommonDataService {
  isLoading = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  // API call example
  getData(url: string) {
    return this.http.get(url);
  }

  // SweetAlert error handlers
  showErrorMsg(error: HttpErrorResponse, title: string) {
    Swal.fire(title, error.toString(), 'error');
  }

  showError(error: HttpErrorResponse, title: string) {
    Swal.fire(title, error.toString(), 'error');
  }

  showCustomError(message: string, title: string) {
    Swal.fire(title, message, 'error');
  }

  showCustomErrorMsg(error: HttpErrorResponse, title: string) {
    Swal.fire(title, error.message, 'error');
  }
}
