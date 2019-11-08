import { NgModule } from '@angular/core';
import { Routes, RouterModule , CanActivate } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataTableComponent } from './data-table/data-table.component';
import { InterfaceComponent } from './dashboard/interface/interface.component';
import { ViewDelBatchComponent } from './view-del-batch/view-del-batch.component';
import { AuthGuardService} from './../shared/auth-guard.service';
import { MergecompaniesComponent } from './mergecompanies/mergecompanies.component';
import { UnmergeCompaniesComponent } from './unmerge-companies/unmerge-companies.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { CompanyManageComponent } from './company-manage/company-manage.component';
import { DesignationManagementComponent } from './designation-management/designation-management.component';
import { DepartmentManageComponent } from './department-manage/department-manage.component';



const routes: Routes = [{path : '',
component : DashboardComponent,
canActivate: [AuthGuardService] ,
children: [

{
  path: '',
  redirectTo: 'interface'

}
,
  {
  path: 'uploader',
  component : DataTableComponent

},
  {
  path: 'interface',
  component : InterfaceComponent

}
,
  {
  path: 'delete-view-batch',
  component : ViewDelBatchComponent

}
,
  {
  path: 'merge-companies',
  component : MergecompaniesComponent

}
,
  {
  path: 'unmerge-companies',
  component : UnmergeCompaniesComponent

}
,
  {
  path: 'employee-management',
  component : UserManagementComponent

}
,
  {
  path: 'company-management',
  component : CompanyManageComponent

},
  {
  path: 'designation-management',
  component : DesignationManagementComponent

}
,
  {
  path: 'department-management',
  component : DepartmentManageComponent

}


]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
