import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActiveStatus } from 'src/app/shared/shared/keyValues';
import { UtilsService } from 'src/app/shared/shared/utils.service';
import { FormValidatorService } from 'src/app/shared/form-validator.service';

@Component({
  selector: 'app-department-manage',
  templateUrl: './department-manage.component.html',
  styleUrls: ['./department-manage.component.css']
})
export class DepartmentManageComponent implements OnInit {

  search = '';
  sortBy = '';
  sortOrder = '';
  addDeparts: FormGroup;
  label = 'Add Department';
  isAdmin  = true;
  selectedIndex_inner = 0;
  DepartSummary = [];
  DepartColumn = ['Department Name' , 'Status' , 'Action'];
  page = {
    pageSizeOptions: [10, 25, 50, 100]
    , limit: 25
    , pageSize: 25
  };

  ActiveStatuses =  ActiveStatus;
  salesFnarea = [];
  salesFnType = [];


  constructor(private _api: ApiServiceService ,
              private router: Router,
              private formValids: FormValidatorService,
              private spinner: NgxSpinnerService ,
              private utils: UtilsService ) {

                 this.addDeparts = new FormGroup({
                  departmentname : new FormControl ('' , [Validators.required])
                  , status : new FormControl ('' , [Validators.required])
                  , salesfunctionarea : new FormControl ('')
                  , salesfunctiontype : new FormControl ('')
                  , depId : new FormControl ('')

                 });
                }
  ngOnInit() {
    this.findUser();
  }
  findUser() {
    this._api.functionGET('api/user').subscribe((response) => {
      if (response.data.designation !== 'admin' ) {
        // this.router.navigate(['/dashboard/interface']);
        // return false;
        this.resetForms();
        this.isAdmin = false;



      }
      this.getDeparts({ page: 1, perPage: 25 });
      this.getslsFnArea();
      this.getslsFnType();

    });
  }


  getslsFnArea() {

  this._api.functionPOST('api/common/salesFunctionArea' , '').subscribe((response) => {
    this.salesFnarea = response.data;
  });

  }
  getslsFnType() {

  this._api.functionPOST('api/common/salesFunctionType' , '').subscribe((response) => {
    this.salesFnType = response.data;
  });

  }


  getDeparts(apiData) {

    const data = new FormData();
    data.append('page', apiData.page);
    data.append('perPage', apiData.perPage);
    data.append('search', this.search);
    data.append('sortOrder', this.sortOrder);
    data.append('sortBy', this.sortBy);
    this.spinner.show();
    this._api.functionPOST('api/fetchDepartments' , data).subscribe((response) => {
      this.DepartSummary = response.data.data;
      this.page.limit = response.data.total;
      this.spinner.hide();
     });

  }

  PageChange($event) {
    console.log($event);
    this.getDeparts({ perPage: $event.pageSize, page: $event.pageIndex + 1 });
  }

  refresh() {
    this.search = '';
    this.getDeparts({ page: 1, perPage: 25 });


  }
  edit(data) {
    this.label = 'Update Data';
    console.log(data);
    this.selectedIndex_inner = 1;
    this._api.functionPOST('api/fetchADepartment' , {depId : data.depId}).subscribe((response) => {
    this.addDeparts.patchValue({
      depId: data.depId
      , departmentname : this.utils.removeNull(response.data.departmentname)
      , status : this.utils.removeNull(response.data.status)
      , salesfunctionarea : this.utils.removeNull(response.data.salesfunctionarea)
      , salesfunctiontype : this.utils.removeNull(response.data.salesfunctiontype)


    });
   });
  }
  clearPresets() {
    this.addDeparts.reset();
    this.selectedIndex_inner = 0;

  }
  updateDeparts() {

     if (this.addDeparts.invalid) {
this.formValids.markFormGroupTouched(this.addDeparts);
return;
     }

     let url = 'addDepartment';
     if (this.label === 'Update Data') {
      url = 'editDepartment';
    }

     const data  = new FormData();
     data.append('departmentname' , this.utils.removeNull(this.addDeparts.get('departmentname').value));
     data.append('status' , this.utils.removeNull(this.addDeparts.get('status').value));
     data.append('salesfunctiontype' , this.utils.removeNull(this.addDeparts.get('salesfunctiontype').value));
     data.append('salesfunctionarea' , this.utils.removeNull(this.addDeparts.get('salesfunctionarea').value));
     if (this.label === 'Update Data') {
      data.append('depId' , this.utils.removeNull(this.addDeparts.get('depId').value));
    }

     this._api.functionPOST('api/' + url , data).subscribe((response) => {
      this._api.openSnackBar(response.data , 'success');
      this.addDeparts.reset();
      this.getDeparts({ page: 1, perPage: 25 });
      this.selectedIndex_inner = 0;
      this.label = 'Add Department';

    });
  }


  resetForms() {
    this.addDeparts.disable();
  }
}
