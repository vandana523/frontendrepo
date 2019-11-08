import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FormValidatorService } from 'src/app/shared/form-validator.service';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { CookieService } from 'ngx-cookie-service';
import { UtilsService } from 'src/app/shared/shared/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public get cookie(): CookieService {
    return this._cookie;
  }
  public set cookie(value: CookieService) {
    this._cookie = value;
  }

  LoginDetails: FormGroup;
  constructor(
      private Formvalidator: FormValidatorService
    , private formBuilder: FormBuilder
    , private router: Router
    // tslint:disable-next-line: variable-name
    , private _cookie: CookieService
    , private _utils: UtilsService
    // tslint:disable-next-line: variable-name
    , private _api: ApiServiceService ) {
    this.LoginDetails = this.formBuilder.group({
      user_email: new FormControl('', [Validators.required, Validators.email]),
      user_password: new FormControl('', [Validators.required]),
    });
  }

  login() {
    this._cookie.deleteAll('/');
    const data = {
      email: this.LoginDetails.get('user_email').value,
      password: this.LoginDetails.get('user_password').value
    };
    this._api.functionPOST('api/login' , data).subscribe((response) => {
      this._cookie.set('token', response.data.token, 0, '/');
      this._utils.SendUserType(response.data.designation);
      if (response.data.designation === 'admin') {
        this.router.navigate(['/dashboard/uploader']);
        return false;
      } else {
        this.router.navigate(['/dashboard/interface']);
        return false;
      }


      sessionStorage.setItem('UserType', response.data.designation);
    });

  }
  ngOnInit() {
    if (this.cookie.get('token')) {
      this.findUser();
    }

  }
  findUser() {
    this._api.functionGET('api/user').subscribe((response) => {
      if (response.data.designation !== 'admin' ) {
        this.router.navigate(['/dashboard/interface']);
        return false;
      } else {
        this.router.navigate(['/dashboard/uploader']);
      }
    });
  }
}
