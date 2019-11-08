import { Injectable } from '@angular/core';
import { BACKEND , tokenType} from '../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, pipe, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient ,
              private snackBar: MatSnackBar ,
              private spinner: NgxSpinnerService,
              private cookie: CookieService,
              private authService: AuthService) { }




  functionPOST(url, data, token?): Observable<any> {

 const httpOptions = {
      headers: new HttpHeaders({
        Authorization:  this.cookie.get('token')
      })
    };

 const Link = BACKEND + url;
 return this.http.post(Link, data , httpOptions)
      .pipe(map(Response => this.checkResponse(Response)),
        catchError((error) => throwError(this.handleError(error))));
  }
  functionGET(url, token?): Observable<any> {

 const httpOptions = {
      headers: new HttpHeaders({
        Authorization:  this.cookie.get('token')
      })
    };

 const Link = BACKEND + url;
 return this.http.get(Link , httpOptions)
      .pipe(map(Response => this.checkResponse(Response)),
        catchError((error) => throwError(this.handleError(error))));
  }
  openSnackBar(message: string, type: string) {
    const config = new MatSnackBarConfig();
    config.duration = 5000;
    config.politeness = 'assertive';
    if (type === 'Error') {
      config.panelClass = ['RED_BACKGROUND'];
    } else {
      config.panelClass = ['GREEN'];
    }
    this.snackBar.open(message, '', config);
  }

  checkResponse(response: any) {

    const results = response;

    if (results.status === 'success') {
      return results;
    } else {
      return { error: results.error.msg };
    }
  }
  handleError(error) {
    this.spinner.hide();
    switch (error.status) {
      case 400:
      case 401:
        this.authService.logout();
        break;
        default :
    this.openSnackBar(error.error.error.msg, 'Error');
    return error.error;
  }
}


  logout() {
    this.functionGET('api/logout').subscribe((response) => {
      this.authService.logout();
    });
}
}
