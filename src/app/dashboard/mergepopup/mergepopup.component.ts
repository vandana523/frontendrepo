import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ApiServiceService } from 'src/app/shared/api-service.service';

@Component({
  selector: 'app-mergepopup',
  templateUrl: './mergepopup.component.html',
  styleUrls: ['./mergepopup.component.css']
})
export class MergepopupComponent implements OnInit {
  companyIds = [];
  search_companies = new FormControl();
  filteredCompany: Observable<string[]>;
  comapnyId = '';

  constructor(public dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data ,
              private api: ApiServiceService) { }

  ngOnInit() {
    this.companyIds = this.data.companyID;
    this.filteredCompany = this.search_companies.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value ? value.toString() : '' , 'companyIds' , 'companyname'))
      );
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
  mergeCompany() {
    if (!this.search_companies.valid) {
      this.api.openSnackBar('select a company' , 'Error');
      return ;
    }
    this.dialogRef.close(this.comapnyId);
  }
  setCompanyId(event) {

    this.search_companies.patchValue(event.option.value.companyname);
    this.comapnyId = event.option.value.companyid;
    console.log(this.search_companies);
  }

}
