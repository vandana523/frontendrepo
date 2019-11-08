import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { UtilsService } from 'src/app/shared/shared/utils.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FormValidatorService } from 'src/app/shared/form-validator.service';
import { designations, ActiveStatus } from 'src/app/shared/shared/keyValues';
@Component({
  selector: 'app-company-manage',
  templateUrl: './company-manage.component.html',
  styleUrls: ['./company-manage.component.css']
})
export class CompanyManageComponent implements OnInit {
  Summarycompanies  =  [];
  ActiveStatuses =  ActiveStatus;

  CompanyTable: string[] = ['Companyname' ,'Company ID', 'Company Region' , 'Company Vertical' , 'Registration Date' , 'Status' , 'Action'];
  search = '';
  sortBy = '';
  sortOrder = '';
  addCompany: FormGroup;
  isAdmin = true;
  page = {
    pageSizeOptions: [10, 25, 50, 100]
    , limit: 25
    , pageSize: 25
  };
  selectedIndex_inner = 0;

  companies = [];
  programManagers = [];
  regionalManagers = [];
  accountManagers = [];
  regions = [];
  nationalHeads = [];
  verticals = [];
  parentCompanies = [];
  businessHead = [];


  search_companies = new FormControl('' , [Validators.required]);
  search_parentcompanies = new FormControl('');
  search_programManagers = new FormControl('');
  search_accountManagers = new FormControl('',[Validators.required]);
  search_regionalManagers = new FormControl('',[Validators.required]);
  search_regions = new FormControl();
  search_natHead = new FormControl('',[Validators.required]);
  search_vertical = new FormControl();
  search_businessHead = new FormControl();



  filteredCompany: Observable<string[]>;
  filteredPgmgr: Observable<string[]>;
  filteredAcmgr: Observable<string[]>;
  filteredRgmgr: Observable<string[]>;
  filteredRegion: Observable<string[]>;
  filteredNatHead: Observable<string[]>;
  filteredVerticals: Observable<string[]>;
  filteredParentcompany: Observable<string[]>;
  filteredBusinessHead: Observable<string[]>;






  label = 'Add Company';

  constructor(private _api: ApiServiceService ,
              private router: Router ,
              private spinner: NgxSpinnerService,
              private utils: UtilsService,
              private CustValidators: FormValidatorService )  {
 this.addCompany = new FormGroup({
  companyname : new FormControl('' , [Validators.required]),
  companyid : new FormControl('' , [Validators.required]),
  parentcompanyid : new FormControl(''),
  id : new FormControl('' ),
  registrationdate : new FormControl('' ),
  companyregion : new FormControl('' ),
  companyaddress : new FormControl('' ),
  companycity : new FormControl('' ),
  companystate : new FormControl(''),
  companycountry : new FormControl(''),
  zipcode : new FormControl(''),
  companyvertical : new FormControl(''),
  technical_name : new FormControl('' ),
  technical_email : new FormControl('' , [Validators.email] ),
  technical_mobile : new FormControl('' ),
  technical_landline : new FormControl('' ),
  technical_ext : new FormControl('' ),
  accounts_name : new FormControl('' ),
  accounts_email : new FormControl('', [Validators.email] ),
  accounts_mobile : new FormControl('' ),
  accounts_landline : new FormControl('' ),
  accounts_ext : new FormControl('' ),
  management_name : new FormControl('' ),
  management_email : new FormControl('' , [Validators.email]),
  management_mobile : new FormControl('' ),
  management_landline : new FormControl('' ),
  management_ext : new FormControl('' ),
  pannumber : new FormControl('' ),
  gst : new FormControl('' ),
  accountmanagerid : new FormControl('' ),
  regionalmangerid : new FormControl('' ),
  nationalheadid : new FormControl('' ),
  businessheadid : new FormControl('' ),
  programmanagerid : new FormControl('' ),
  status : new FormControl('' , [Validators.required]),

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
  PageChange($event) {
    console.log($event);
    this.getCompanies({ perPage: $event.pageSize, page: $event.pageIndex + 1 });
  }
  findUser() {
    this._api.functionGET('api/user').subscribe((response) => {
      if (response.data.designation !== 'admin' ) {
        // this.router.navigate(['/dashboard/interface']);
        // return false;
        this.isAdmin =  false;
        this.disabelEnableForms('disable')
      } else {
        // this.getCompanies({ page: 1, perPage: 25 });
        // this.getFilterOptions('companies' , 'filteredCompany' , 'companyname' , 'search_companies');
        // this.getFilterOptions('programManagers' , 'filteredPgmgr', 'programManager', 'search_programManagers');
        // this.getFilterOptions('regions'  , 'filteredRegion' , 'region', 'search_regions');
        // this.getFilterOptions('accountManagers' , 'filteredAcmgr' , 'accountManagers', 'search_accountManagers');
        // this.getFilterOptions('regionalManagers' , 'filteredRgmgr', 'regionalManagers' , 'search_regionalManagers' );
        // this.getFilterOptions('nationalHeads' , 'filteredNatHead', 'nationalHead' , 'search_natHead' );
        // this.getFilterOptions('verticals' , 'filteredVerticals', 'vertical' , 'search_vertical' );
        // this.getFilterOptions('parentCompanies' , 'filteredParentcompany', 'companyname' , 'search_parentcompanies' );
        // this.getFilterOptions('businessHead' , 'filteredBusinessHead', 'businessHead' , 'search_businessHead' );
      }

      this.getCompanies({ page: 1, perPage: 25 });
      this.getFilterOptions('programManagers' , 'filteredPgmgr', 'programManager', 'search_programManagers');
      this.getFilterOptions('regions'  , 'filteredRegion' , 'region', 'search_regions');
      this.getFilterOptions('accountManagers' , 'filteredAcmgr' , 'accountManagers', 'search_accountManagers');
      this.getFilterOptions('regionalManagers' , 'filteredRgmgr', 'regionalManagers' , 'search_regionalManagers' );
      this.getFilterOptions('nationalHeads' , 'filteredNatHead', 'nationalHead' , 'search_natHead' );
      this.getFilterOptions('verticals' , 'filteredVerticals', 'vertical' , 'search_vertical' );
      this.getFilterOptions('parentCompanies' , 'filteredParentcompany', 'companyname' , 'search_parentcompanies' );
      this.getFilterOptions('businessHead' , 'filteredBusinessHead', 'businessHead' , 'search_businessHead' );
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
  getCompanies(apiData) {
    const data = new FormData();
    data.append('page', apiData.page);
    data.append('perPage', apiData.perPage);
    data.append('search', this.search);
    data.append('sortOrder', this.sortOrder);
    data.append('sortBy', this.sortBy);
    this.spinner.show();
    this._api.functionPOST('api/fetchCompanies', data).subscribe((response) => {
      this.Summarycompanies = this.utils.tableformater(response.data.data);
      this.page.limit = response.data.total;
      this.spinner.hide();
    });
  }

  sortData($event) {
    console.log($event);
    this.sortBy = $event.active.toLowerCase();
    this.sortOrder = $event.direction;
    this.getCompanies({ page: 1, perPage: 25 });
  }
  updateCompany() {
 if (this.addCompany.invalid ||
  this.search_accountManagers.invalid ||
  this.search_vertical.invalid ||
  this.search_programManagers.invalid ||
  this.search_regions.invalid ||
  this.search_regionalManagers.invalid ||
  this.search_natHead.invalid ||
  this.search_businessHead.invalid ||
  this.search_parentcompanies.invalid

  ) {
   this.CustValidators.markFormGroupTouched(this.addCompany);
   this.search_parentcompanies.markAsTouched();
   this.search_businessHead.markAsTouched();
   this.search_natHead.markAsTouched();
   this.search_regionalManagers.markAsTouched();
   this.search_regions.markAsTouched();
   this.search_programManagers.markAsTouched();
   this.search_vertical.markAsTouched();
   this.search_accountManagers.markAsTouched();
   this._api.openSnackBar('please fill all the mandatory fields' , 'Error')
   return;
 }
 let subdate =  ' ';
 let url = '';

 this.label === 'Update Data' ? url = 'editCompany' : url = 'addCompany';


 if (this.addCompany.get('registrationdate').value) {
  subdate =  Date.parse(new Date(this.addCompany.get('registrationdate').value).toDateString()).toString();
  console.log(subdate);
 }
 this.spinner.show();

 const data =  new FormData();
 data.append('companyname', this.utils.removeNull(this.addCompany.get('companyname').value));
 data.append('companyid', this.utils.removeNull(this.addCompany.get('companyid').value));
 data.append('parentcompanyid' , this.utils.removeNull(this.utils.getValue(this.parentCompanies , 'companyname', this.search_parentcompanies.value , 'id')));
 data.append('registrationdate' , subdate ? subdate : '');
 data.append('companyregion' , this.utils.removeNull(this.search_regions.value));
 data.append('companyaddress', this.utils.removeNull(this.addCompany.get('companyaddress').value));
 data.append('companycity', this.utils.removeNull(this.addCompany.get('companycity').value));
 data.append('companystate', this.utils.removeNull(this.addCompany.get('companystate').value));
 data.append('companycountry', this.utils.removeNull(this.addCompany.get('companycountry').value));
 data.append('zipcode', this.utils.removeNull(this.addCompany.get('zipcode').value));
 data.append('companyvertical', this.utils.removeNull(this.search_vertical.value));
 data.append('technical_name', this.utils.removeNull(this.addCompany.get('technical_name').value));
 data.append('technical_email', this.utils.removeNull(this.addCompany.get('technical_email').value));
 data.append('technical_mobile', this.utils.removeNull(this.addCompany.get('technical_mobile').value));
 data.append('technical_landline', this.utils.removeNull(this.addCompany.get('technical_landline').value));
 data.append('technical_ext', this.utils.removeNull(this.addCompany.get('technical_ext').value));
 data.append('accounts_name', this.utils.removeNull(this.addCompany.get('accounts_name').value));
 data.append('accounts_email', this.utils.removeNull(this.addCompany.get('accounts_email').value));
 data.append('accounts_mobile', this.utils.removeNull(this.addCompany.get('accounts_mobile').value));
 data.append('accounts_landline', this.utils.removeNull(this.addCompany.get('accounts_landline').value));
 data.append('accounts_ext', this.utils.removeNull(this.addCompany.get('accounts_ext').value));
 data.append('management_name', this.utils.removeNull(this.addCompany.get('management_name').value));
 data.append('management_email', this.utils.removeNull(this.addCompany.get('management_email').value));
 data.append('management_mobile', this.utils.removeNull(this.addCompany.get('management_mobile').value));
 data.append('management_landline', this.utils.removeNull(this.addCompany.get('management_landline').value));
 data.append('management_ext', this.utils.removeNull(this.addCompany.get('management_ext').value));
 data.append('pannumber', this.utils.removeNull(this.addCompany.get('pannumber').value));
 data.append('gst', this.utils.removeNull(this.addCompany.get('gst').value));
 data.append('accountmanagerid', this.utils.removeNull(this.utils.getValue(this.accountManagers , 'accountManagers', this.search_accountManagers.value , 'id')));
 data.append('regionalmangerid', this.utils.removeNull(this.utils.getValue(this.regionalManagers , 'regionalManagers', this.search_regionalManagers.value , 'id')));
 data.append('nationalheadid' , this.utils.removeNull(this.utils.getValue(this.nationalHeads , 'nationalHead', this.search_natHead.value , 'id')));
 data.append('businessheadid', this.utils.removeNull(this.utils.getValue(this.businessHead , 'businessHead', this.search_businessHead.value , 'id')));
 data.append('programmanagerid', this.utils.removeNull(this.utils.getValue(this.programManagers , 'programManager', this.search_programManagers.value , 'id')));
 data.append('status', this.utils.removeNull(this.addCompany.get('status').value));
 if (this.label === 'Update Data') {
   data.append('id' , this.utils.removeNull(this.addCompany.get('id').value));
  }
 console.log(this.utils.getValue
  (this.businessHead , 'businessHead', this.search_businessHead.value , 'id')
   , this.search_businessHead.value  , this.businessHead);


 this._api.functionPOST('api/' + url , data).subscribe((response) => {
   this.spinner.hide();
   this._api.openSnackBar(response.data , 'success');
   this.clearPresets();
   this.refresh();

 });

}

edit(data) {
  this.label = 'Update Data';
  // this.search_parentcompanies.setValidators([Validators.required]);
  // this.search_parentcompanies.updateValueAndValidity();
  this.selectedIndex_inner = 1;
  console.log(data);
  const apiData = new FormData();
  apiData.append('id' , data.id);
  this.spinner.show();
  this._api.functionPOST('api/fetchACompany', apiData).subscribe((response) => {
this.addCompany.patchValue({
  id : response.data.id,
  companyname : response.data.companyname ? response.data.companyname : '',
  companyid : response.data.companyid ? response.data.companyid : '',
  parentcompanyid : response.data.parentcompanyid ? response.data.parentcompanyid : '',
  registrationdate : response.data.registrationdate ? response.data.registrationdate : '',
  companyregion : response.data.companyregion ? response.data.companyregion : '',
  companyaddress : response.data.companyaddress ? response.data.companyaddress : '',
  companycity : response.data.companycity ? response.data.companycity : '',
  companystate : response.data.companystate ?  response.data.companystate : '',
  companycountry : response.data.companycountry ? response.data.companycountry : '' ,
  zipcode : response.data.zipcode ? response.data.zipcode: '',
  companyvertical : response.data.companyvertical ? response.data.companyvertical : '',
  technical_name : response.data.technical_name ? response.data.technical_name: '',
  technical_email : response.data.technical_email ? response.data.technical_email :'',
  technical_mobile : response.data.technical_mobile  ? response.data.technical_mobile : '',
  technical_landline : response.data.technical_landline ? response.data.technical_landline : '',
  technical_ext : response.data.technical_ext ? response.data.technical_ext : '',
  accounts_name : response.data.accounts_name ? response.data.accounts_name : '',
  accounts_email : response.data.accounts_email ? response.data.accounts_email : '',
  accounts_mobile : response.data.accounts_mobile ? response.data.accounts_mobile : '',
  accounts_landline : response.data.accounts_landline ? response.data.accounts_landline : '',
  accounts_ext : response.data.accounts_ext ? response.data.accounts_ext : '',
  management_name : response.data.management_name  ? response.data.management_name : '',
  management_email : response.data.management_email? response.data.management_email : '',
  management_mobile : response.data.management_mobile ? response.data.management_mobile : '',
  management_landline : response.data.management_landline ? response.data.management_landline:'' ,
  management_ext : response.data.management_ext ? response.data.management_ext : '',
  pannumber : response.data.pannumber ? response.data.pannumber : '',
  gst : response.data.gst ? response.data.gst : '',
  status : response.data.status ? response.data.status : '',

});


response.data.accountmanagerid ?
this.search_accountManagers.setValue(this.utils.getValue(this.accountManagers , 
  'id', Number(response.data.accountmanagerid) , 'accountManagers')) : '';


this.search_vertical.patchValue = response.data['vertical'] ;
response.data.programmanagerid ?
this.search_programManagers.setValue(this.utils.getValue(this.programManagers ,
   'id', Number(response.data.programmanagerid) , 'programManager')) : '';


this.search_regions.patchValue = response.data['region'];



response.data.companyregion ?
this.search_regions.setValue(response.data.companyregion)  : '';

console.log(this.utils.getValue(this.regions ,
  'id', Number(response.data.companyregion) , 'region'))

response.data.companyvertical ?
this.search_vertical.setValue(response.data.companyvertical) : '';


   response.data.regionalmangerid ?
this.search_regionalManagers.setValue(this.utils.getValue(this.regionalManagers ,
   'id', Number(response.data.regionalmangerid) , 'regionalManagers')) : '';

response.data.nationalheadid ?
this.search_natHead.setValue(this.utils.getValue(this.nationalHeads ,
   'id', Number(response.data.nationalheadid) , 'nationalHead')) : '';


response.data.businessheadid ?
this.search_businessHead.setValue(this.utils.getValue(this.businessHead ,
   'id', Number(response.data.businessheadid) , 'businessHead')) : '';


response.data.parentcompanyid ?
this.search_parentcompanies.setValue(this.utils.getValue(this.parentCompanies ,
   'id', Number(response.data.parentcompanyid) , 'companyname')) : '';




this.spinner.hide();

  });



}


  clearPresets() {
    this.search_regionalManagers.reset();
    this.search_programManagers.reset();
    this.addCompany.reset();
    this.search_regions.reset();
    this.search_vertical.reset();
    this.search_businessHead.reset();
    this.search_natHead.reset();
    this.search_accountManagers.reset();
    this.selectedIndex_inner = 0;
    this.label = 'Add Company';
    // this.search_parentcompanies.clearValidators();
    // this.search_parentcompanies.updateValueAndValidity();
    this.search_parentcompanies.reset();
  }


  refresh() {
    this.search = '';
    this.getCompanies({ page: 1, perPage: 25 });
  }
  disabelEnableForms(action){

    this.addCompany[action]();
    this.search_parentcompanies[action]();
    this.search_businessHead[action]();
    this.search_natHead[action]();
    this.search_regionalManagers[action]();
    this.search_regions[action]();
    this.search_programManagers[action]();
    this.search_vertical[action]();
    this.search_accountManagers[action]();
  }
}
