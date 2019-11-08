import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { FormGroup, FormControl , Validators } from '@angular/forms';
import { designations, ActiveStatus } from 'src/app/shared/shared/keyValues';
import { FormValidatorService } from 'src/app/shared/form-validator.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  selectedIndex_inner = 0;
  isAdmin = true;
  Label = 'Add Employee';
  EmployeeTable: string[] = ['Name' , 'Designation' , 'Email' , 'Status' , 'Action'];
  employeeData: Array<any> = [];
  Designation = designations;
  ActiveStatuses = ActiveStatus;
  search = '';
  sortBy = '';
  sortOrder = '';
  addEmployee: FormGroup;
  page = {
    pageSizeOptions: [10, 25, 50, 100]
    , limit: 25
    , pageSize: 25
  };

  search_companies = new FormControl();
  filteredCompany: Observable<string[]>;
  dropDownCompanies = [];
  
  
  constructor(public _api: ApiServiceService
    ,         public spinner: NgxSpinnerService
    ,         public Formvalidator: FormValidatorService 
    ,         private router : Router) {
    this.addEmployee  = new FormGroup({
      name : new FormControl('' , [Validators.required]),
      firstname : new FormControl('' , [Validators.required]),
      lastname : new FormControl('' , [Validators.required]),
      emailid : new FormControl('' , [Validators.required , Validators.email]),
      phone : new FormControl('' , [Validators.required]),
      designation : new FormControl('' , [Validators.required]),
      reportingto : new FormControl(''),
      department : new FormControl(''),
      region : new FormControl(''),
      userId : new FormControl(''),
      status : new FormControl('' , [Validators.required]),
      password : new FormControl('' , [Validators.required]),

    });
   

   }

  ngOnInit() {

this.findUser();

  }
  getCompanies() {
    this.spinner.show();
    this._api.functionPOST('api/companiesForMerging', '').subscribe((response) => {
      this.dropDownCompanies = response.data;
      this.spinner.hide();
      this.filteredCompany = this.search_companies.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value ? value.toString() : '' , 'dropDownCompanies' , 'companyname'))
        );
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



  findUser() {
    this._api.functionGET('api/user').subscribe((response) => {
      if (response.data['designation'] !== 'admin' ) {
        this.router.navigate(['/dashboard/interface']);
        return false;
        // this.isAdmin = false;
        // this.disableForms();
        
      } else {
        this.getCompanies();
        this.getEmployeeList({ page: 1, perPage: 25 });
       
      }
    
    });
  }

  PageChange($event) {
    console.log($event);
    this.getEmployeeList({ perPage: $event.pageSize, page: $event.pageIndex + 1 });
  }
  getEmployeeList(apiData) {

    const data = new FormData();
    data.append('page', apiData.page);
    data.append('perPage', apiData.perPage);
    data.append('search', this.search);
    data.append('sortOrder', this.sortOrder);
    data.append('sortBy', this.sortBy);
    this.spinner.show();
    this._api.functionPOST('api/fetchAllemployees' , data).subscribe((response) => {
      this.employeeData = response.data.data;
      this.page.limit = response.data.total;
      this.spinner.hide();
     });

  }

  edit(data) {

     this.Label = 'Update Data';
     this.addEmployee.get('password').clearValidators();
     this.addEmployee.get('password').updateValueAndValidity();
     const form = new FormData();
     form.append('userId' , data.userId);
     this.spinner.show();
     this._api.functionPOST('api/fetchemployee' , form ).subscribe((response) => {

      this.addEmployee.patchValue({
        name : response.data.name ? response.data.name : '',
        firstname : response.data.firstname ? response.data.firstname : '',
        lastname : response.data.lastname ? response.data.lastname : '',
        emailid : response.data.emailid ? response.data.emailid : '',
        phone : response.data.phone ? response.data.phone : '',
        designation : response.data.designation ? response.data.designation : '',
        reportingto : response.data.reportingto ? response.data.reportingto : '',
        department : response.data.department ? response.data.department : '',
        region : response.data.region ? response.data.region : '',
        status : response.data.status ? response.data.status : '',
        password : response.data.password ? response.data.password : '',
        userId : response.data.id ? response.data.id : '',


      });
      this.search_companies.setValue(response.data.companyname ? response.data.companyname : '')
      this.selectedIndex_inner = 1;
      this.spinner.hide();
     });


  }
  AddEmployee() {
    let url = '';
    if (this.addEmployee.invalid) {
      this.Formvalidator.markFormGroupTouched(this.addEmployee);
      return ;
    }

    this.Label === 'Update Data'  ? url = 'editEmployee' : url = 'addEmployee';


    const form = new FormData();
    form.append('name' , this.addEmployee.get('name').value);
    form.append('firstname' , this.addEmployee.get('firstname').value);
    form.append('lastname' , this.addEmployee.get('lastname').value);
    form.append('companyname' , this.search_companies.value);
    form.append('emailid' , this.addEmployee.get('emailid').value);
    form.append('phone' , this.addEmployee.get('phone').value);
    form.append('designation' , this.addEmployee.get('designation').value);
    form.append('reportingto' , this.addEmployee.get('reportingto').value);
    form.append('department' , this.addEmployee.get('department').value);
    form.append('region' , this.addEmployee.get('region').value);
    form.append('status' , this.addEmployee.get('status').value);
    form.append('password' , this.addEmployee.get('password').value);
    if (url === 'editEmployee') {
      form.append('userId' , this.addEmployee.get('userId').value);
    }
    this.spinner.show();
    this._api.functionPOST('api/' + url , form).subscribe((response) => {
      this.spinner.hide();
      this._api.openSnackBar(response.data , 'success');
      this.clearPresets();
      this.getEmployeeList({ page: 1, perPage: 25 });
    });



  }
  clearPresets() {
    this.addEmployee.reset();
    this.selectedIndex_inner = 0;
    this.Label = 'Add Employee';
    this.addEmployee.get('password').setValidators([Validators.required]);
    this.addEmployee.get('password').updateValueAndValidity();
  }
  refresh() {
    this.search = '';
    this.getEmployeeList({ page: 1, perPage: 25 });
  }
  sortData($event) {
    console.log($event);
    this.sortBy = $event.active.toLowerCase();
    this.sortOrder = $event.direction;
    this.getEmployeeList({ page: 1, perPage: 25 });
  }
  disableForms(){
    // name : new FormControl('' , [Validators.required]),
    // firstname : new FormControl('' , [Validators.required]),
    // lastname : new FormControl('' , [Validators.required]),
    // emailid : new FormControl('' , [Validators.required , Validators.email]),
    // phone : new FormControl('' , [Validators.required]),
    // designation : new FormControl('' , [Validators.required]),
    // reportingto : new FormControl(''),
    // department : new FormControl(''),
    // region : new FormControl(''),
    // userId : new FormControl(''),
    // status : new FormControl('' , [Validators.required]),
    // password : new FormControl('' , [Validators.required]),
    this.addEmployee.get('name').disable();
    this.addEmployee.get('firstname').disable();
    this.addEmployee.get('lastname').disable();
    this.addEmployee.get('emailid').disable();
    this.addEmployee.get('emailid').disable();
    this.addEmployee.get('phone').disable();
    this.addEmployee.get('designation').disable();
    this.addEmployee.get('reportingto').disable();
    this.addEmployee.get('department').disable();
    this.addEmployee.get('region').disable();
    this.addEmployee.get('userId').disable();
    this.addEmployee.get('status').disable();
    this.search_companies.disable();
    console.log('here');
    this.addEmployee.get('password').disable();


  }

}
