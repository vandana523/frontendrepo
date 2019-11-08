import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DataTableComponent } from './data-table/data-table.component';
import { TableparserComponent } from './tableparser/tableparser.component';
import { MdComponentsModule } from '../shared/md-coponents/md-coponents.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { InterfaceComponent } from './dashboard/interface/interface.component';
import { FilterpopupComponent } from './filterpopup/filterpopup.component';
import { MergepopupComponent } from './mergepopup/mergepopup.component';
import { ViewDelBatchComponent } from './view-del-batch/view-del-batch.component';
import { ConfirmpopComponent } from './confirmpop/confirmpop.component';
import { TopbarComponent } from './topbar/topbar.component';
import { MergecompaniesComponent } from './mergecompanies/mergecompanies.component';
import { UnmergeCompaniesComponent } from './unmerge-companies/unmerge-companies.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { CompanyManageComponent } from './company-manage/company-manage.component';
import { DesignationManagementComponent } from './designation-management/designation-management.component';
import { ViewChildCompanyComponent } from './view-child-company/view-child-company.component';
import { DepartmentManageComponent } from './department-manage/department-manage.component';

@NgModule({
  declarations: [DashboardComponent
    , DataTableComponent
    , TableparserComponent
    , SidebarComponent
    , InterfaceComponent
    , FilterpopupComponent
    , MergepopupComponent, ViewDelBatchComponent, ConfirmpopComponent, TopbarComponent, MergecompaniesComponent, UnmergeCompaniesComponent, UserManagementComponent, CompanyManageComponent, DesignationManagementComponent, ViewChildCompanyComponent, DepartmentManageComponent]
    , 
  imports: [
    CommonModule,
    MdComponentsModule,
    DashboardRoutingModule
    ,HttpClientModule
  
  ]
  , entryComponents: [
    TableparserComponent
    , FilterpopupComponent
    , MergepopupComponent
    , ConfirmpopComponent
    , ViewChildCompanyComponent
  ]
})
export class DashboardModule { }
