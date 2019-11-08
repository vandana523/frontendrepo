import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticateRoutingModule } from './authenticate-routing.module';
import { AuthenticationParentPageComponent } from './authentication-parent-page/authentication-parent-page.component';
import { MdComponentsModule } from '../shared/md-coponents/md-coponents.module';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './shared/footer/footer.component';


@NgModule({
  declarations: [AuthenticationParentPageComponent, LoginComponent, FooterComponent],
  imports: [
    CommonModule,
    AuthenticateRoutingModule,
    MdComponentsModule
  ]
})
export class AuthenticateModule { }
