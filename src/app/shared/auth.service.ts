import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public cookie : CookieService , public router : Router) { }


  public isAuthenticated(): boolean {
    const token = this.cookie.get('token');
    return token ? true : false ;
    // return !this.jwtHelper.isTokenExpired(token);
  }


  logout() {
    this.cookie.deleteAll('/');
    this.router.navigate(['/']);
  }

}
