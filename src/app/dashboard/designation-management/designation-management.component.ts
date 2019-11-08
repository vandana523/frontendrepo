import { Component, OnInit, ɵɵcontainerRefreshEnd } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from 'src/app/shared/shared/utils.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { designations, ActiveStatus } from 'src/app/shared/shared/keyValues';
import { FormValidatorService } from 'src/app/shared/form-validator.service';
@Component({
  selector: 'app-designation-management',
  templateUrl: './designation-management.component.html',
  styleUrls: ['./designation-management.component.css']
})
export class DesignationManagementComponent implements OnInit {
  SummaryDesigns = [];
  designations = [];
  label = 'Add Designation';
  ActiveStatuses = ActiveStatus;
  DesigColumns: string[] = ['designationname' , 'status' , 'Action'];
  search = '';
  sortBy = '';
  isAdmin = true;
  sortOrder = '';
  page = {
    pageSizeOptions: [10, 25, 50, 100]
    , limit: 25
    , pageSize: 25
  };
  selectedIndex_inner = 0;
  filteredDesignation: Observable<string[]>;
  createDesignation: FormGroup;
  search_designation = new FormControl('');

  constructor(private router: Router , private _api: ApiServiceService ,
              private spinner: NgxSpinnerService,
              private  _utils: UtilsService ,
              private CustValidators: FormValidatorService) {

                this.createDesignation = new FormGroup({
                  desigId : new FormControl(''),
                  status : new FormControl('' , [Validators.required]),
                  designationname : new FormControl('' , [Validators.required])
                });



              }

  ngOnInit() {
    this.findUser();
  }

  ValidateList(array , key , form: FormControl) {
    console.log(form.value);
    let listerror = true;
    if (form.value !== '') {
    this[array].map((x) => {
      if (x.key === form.value) {
        listerror = null;
      }
    });

    form.setErrors({incorrect: listerror});
  } else {

    form.clearValidators();

  }



  }
  findUser() {
    this._api.functionGET('api/user').subscribe((response) => {
      if (response.data.designation !== 'admin' ) {
        // this.router.navigate(['/dashboard/interface']);
        // return false;
        this.isAdmin = false;
        this.disableForms();
      } else {
        // this.getDesignatSUmmary({ page: 1, perPage: 25 });
        // this.getFilterOptions('designations' , 'filteredDesignation', 'designationname' , 'search_designation' );
      }
      this.getDesignatSUmmary({ page: 1, perPage: 25 });
      this.getFilterOptions('designations' , 'filteredDesignation', 'designationname' , 'search_designation' );
    });
  }

  getFilterOptions(filtertype , searchARray , key , formControl) {
    this.spinner.show();
    this._api.functionPOST('api/common/' + filtertype, '').subscribe((response) => {
     this[filtertype] = response.data;
     this[searchARray] = this[formControl].valueChanges.pipe(
       startWith(''),
       map(value => this._filter(value ? value.toString() : '' , filtertype , key))
       );
     this.spinner.hide();
   });
 }
 private _filter(value: string , searcharray: string , key: string): string[] {
   value = value.replace(/\\/g, '\\\\');
   if (typeof value !== 'string') {
     return null;
   } else {
     const filterValue = value.toLowerCase();
     return this[searcharray].filter((option) => {
       const str = option[key].toString().toLowerCase();
       if (str.search(filterValue) !== -1) {

         return true;

       } else {
         return false;
       }
     });
   }
 }
 PageChange($event) {
  console.log($event);
  this.getDesignatSUmmary({ perPage: $event.pageSize, page: $event.pageIndex + 1 });
}

  getDesignatSUmmary(apiData) {
    const data = new FormData();
    data.append('page', apiData.page);
    data.append('perPage', apiData.perPage);
    data.append('search', this.search);
    data.append('sortOrder', this.sortOrder);
    data.append('sortBy', this.sortBy);
    this.spinner.show();
    this._api.functionPOST('api/fetchDesignations', data).subscribe((response) => {
      this.SummaryDesigns = this._utils.tableformater(response.data.data);
      this.page.limit = response.data.total;
      this.spinner.hide();
    });
  }

  sortData($event) {
    console.log($event);
    this.sortBy = $event.active.toLowerCase();
    this.sortOrder = $event.direction;
    this.getDesignatSUmmary({ page: 1, perPage: 25 });
  }


  clearPresets() {


    this.label = 'Add Designation';
    this.createDesignation.reset();
    this.search_designation.reset();
    this.selectedIndex_inner = 0;
  }

  edit(data) {
    this.label = 'Update Designation';
    const apiData = new FormData();
    apiData.append('desigId' , data.desigId);
    this.spinner.show();

    this._api.functionPOST('api/fetchADesignation' , apiData).subscribe((response) => {
    

      this.createDesignation.patchValue({
        desigId :  this._utils.removeNull(data.desigId),
        status : response.data.status ? response.data.status : '',
        designationname : response.data.designationname ? response.data.designationname : '',
      });

      response.data.parentdesignationid  ?
      this.search_designation.setValue( this._utils.removeNull(this._utils.getValue(this.designations ,
         'desigId' , response.data.parentdesignationid , 'designationname'))) : '';
      this.spinner.hide();
      this.selectedIndex_inner = 1;
    });

  }

  updateDesig() {
    if (this.search_designation.invalid || this.createDesignation.invalid) {
      this.CustValidators.markFormGroupTouched(this.createDesignation);
      this.search_designation.markAsTouched();
      this._api.openSnackBar('please fill all the mandatory fields' , 'Error');
      return;
    }



    let url = '';
    this.label === 'Update Designation' ? url = 'editDesignation' : url = 'addDesignation';
    this.spinner.show();
    console.log(url , this.label , this.label === 'Update Designation' , this.label === 'Add Designation' );
    const data  = new FormData();

    data.append('designationname' , this._utils.removeNull(this.createDesignation.get('designationname').value))
 
    data.append('parentdesignationid' ,
    this._utils.removeNull(this._utils.getValue(this.designations , 'designationname' , this.search_designation.value , 'desigId')));
   
    data.append('status' , this._utils.removeNull(this.createDesignation.get('status').value))

    if(this.label === 'Update Designation'){

      data.append('desigId' , this._utils.removeNull(this.createDesignation.get('desigId').value))

    }
    this._api.functionPOST('api/' + url , data).subscribe((response) => {
      this._api.openSnackBar(response.data , 'success');
      this.clearPresets();
      this.refresh();
    });
  }
  refresh() {
    this.search = '';
    this.getDesignatSUmmary({ page: 1, perPage: 25 });



  }

  disableForms(){

    this.search_designation.disable();
    this.createDesignation.disable();



  }
  }


