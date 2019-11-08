import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationParentPageComponent } from './authentication-parent-page/authentication-parent-page.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [{
  path : '',
  component : AuthenticationParentPageComponent,
  children:[{
    path: '',
    component : LoginComponent

  }]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticateRoutingModule { }
