import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { UtilsService } from 'src/app/shared/shared/utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { startWith, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unmerge-companies',
  templateUrl: './unmerge-companies.component.html',
  styleUrls: ['./unmerge-companies.component.css']
})
export class UnmergeCompaniesComponent implements OnInit {

  dropDownCompanies = [];
  ParentcompanyId = '';
  childCompanies = [];
  comapnyColoumn = ['company'];
  companiesToUnMerge = [];
  isEmpty = false;
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
        this.getParentCompanies();
      }
    });
  }
  getParentCompanies() {
    this.spinner.show();
    this.apiService.functionPOST('api/parentCompanies', '').subscribe((response) => {
      this.dropDownCompanies = response.data;
      this.dropDownCompanies.forEach((x) => x.checked = false);
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
    this.ParentcompanyId = '';
    this.spinner.show();
    this.dropDownCompanies.map((x) => {
      console.log(x.companyname , this.search_companies);
      if (x.companyname === this.search_companies.value) {
        this.ParentcompanyId  = x.companyid;

      }
    });

    const data = new FormData();
    data.append('parentcompanyid', this.ParentcompanyId );
    this.apiService.functionPOST('api/mergedChildCompanies', data).subscribe((response) => {
      this.childCompanies = response.data;
      if (response.data.length === 0) {
        this.isEmpty = true;
      }
      this.spinner.hide();
    });

  }
  selectToUnmerge($event , data) {

    if ($event.checked) {
      this.companiesToUnMerge.push(data);
    } else {
     this.companiesToUnMerge.map((x , i) => {
       console.log(x === data , x, data);
       if (x.companyid === data.companyid) {
        this.companiesToUnMerge.splice(i, 1);
       }
     });
     this.companiesToUnMerge = this.utils.tableformater(this.companiesToUnMerge);
    }
    this.companiesToUnMerge = this.utils.tableformater(this.companiesToUnMerge);
    console.log(this.companiesToUnMerge , $event);
  }
  removeCompany(data , index) {
    this.childCompanies.map((x) => {
      if (x.companyname == data.companyname) {
        x.checked = false;
      }


    });
    const filtered = this.companiesToUnMerge.filter((x) => x !== data);
    this.companiesToUnMerge = this.utils.tableformater(filtered);
  }
  merge() {
    const data = new FormData();
    this.spinner.show();
    const childcompanies =  this.companiesToUnMerge.filter((x) => x.companyid);
    data.append('companyid', JSON.stringify(childcompanies) );
    this.apiService.functionPOST('api/unmergeCompanies', data).subscribe((response) => {
      this.companiesToUnMerge = this.utils.tableformater([]);
      this.setValue();
      this.spinner.hide();
      this.apiService.openSnackBar(response.data.msg, 'Success');
    });
  }

}
