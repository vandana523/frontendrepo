import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from 'src/app/shared/shared/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mergecompanies',
  templateUrl: './mergecompanies.component.html',
  styleUrls: ['./mergecompanies.component.css']
})
export class MergecompaniesComponent implements OnInit {
  dropDownCompanies = [];
  comapniesFormerge = [];
  companiesToMerge = [];
  comapnyColoumn = ['company'];
  search_companies = new FormControl();
  filteredCompany: Observable<string[]>;
  constructor(private apiService: ApiServiceService ,
              private utils: UtilsService ,
              private spinner: NgxSpinnerService,
              private router: Router) { }

  ngOnInit() {
  this.findUser();
  }

  findUser() {
    this.apiService.functionGET('api/user').subscribe((response) => {
      if (response.data.designation !== 'admin' ) {
        this.router.navigate(['/dashboard/interface']);
        return false;
      } else {
        this.getCompanies();
      }
    });
  }
  getCompanies() {
    this.spinner.show();
    this.apiService.functionPOST('api/companiesForMerging', '').subscribe((response) => {
      this.dropDownCompanies = response.data;

      console.log(this.dropDownCompanies);
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
  setValue() {
    this.spinner.show();
    this.getChildList();
    // this.companiesToMerge = this.utils.tableformater([]);
    // const filtered = this.dropDownCompanies.filter((x) => x.companyname !== this.search_companies.value);
    // this.comapniesFormerge = this.utils.tableformater(filtered);
    // this.spinner.hide();
  }
  selectTomerge($event , data) {

    if ($event.checked) {
      this.companiesToMerge.push(data);
    } else {
     this.companiesToMerge.map((x , i) => {
       console.log(x === data , x, data);
       if (x.companyid === data.companyid) {
        this.companiesToMerge.splice(i, 1);
       }
     });
     this.companiesToMerge = this.utils.tableformater(this.companiesToMerge);
    }
    this.companiesToMerge = this.utils.tableformater(this.companiesToMerge);
    console.log(this.companiesToMerge , $event);
  }
  removeCompany(data , index) {
    this.comapniesFormerge.map((x) => {
      if (x.companyname == data.companyname) {
        x.checked = false;
      }
      const filtered = this.companiesToMerge.filter((x) => x !== data);
      this.companiesToMerge = this.utils.tableformater(filtered);

    });
  }
  merge() {
    const data = new FormData();
    let parentId = '';
    this.dropDownCompanies.map((x) => {
      if (x.companyname === this.search_companies.value) {
        parentId =  x.companyid;
      }
    });
    this.spinner.show();
    const childcompanies =  this.companiesToMerge.filter((x) => x.companyid);
    console.log(parentId);
    data.append('parentCompany', parentId );
    data.append('childCompanyIds', JSON.stringify(childcompanies) );
    this.apiService.functionPOST('api/mergeCompanies', data).subscribe((response) => {
      this.apiService.openSnackBar(response.data.msg, 'Success');
      this.dropDownCompanies.forEach((x) => x.checked = false);
      this.comapniesFormerge.forEach((x) => x.checked = false);
      this.comapniesFormerge = this.utils.tableformater(this.comapniesFormerge);
      this.companiesToMerge = this.utils.tableformater([]);
      this.spinner.hide();
    });
  }
  getChildList() {
    this.companiesToMerge = [];
    this.spinner.show();
    let comapnyId = '';
    this.dropDownCompanies.map((x) => {
      if (x.companyname === this.search_companies.value) {
        comapnyId  = x.companyid;
      }
    });
    const data  = new FormData();
    data.append('companyid' , comapnyId);

    this.apiService.functionPOST('api/childCompaniesToMerge', data).subscribe((response) => {
this.spinner.hide();
response.data.forEach((x) => x.checked = false);
this.comapniesFormerge = this.utils.tableformater(response.data);
    });
  }

}
