import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-filterpopup',
  templateUrl: './filterpopup.component.html',
  styleUrls: ['./filterpopup.component.css']
})
export class FilterpopupComponent implements OnInit {
  filterOptions = [] as any;
  companies = [];
  programManagers = [];
  accountManagers = [];
  regionalManagers = [];
  regions = [];
  bu = [];
  nationalHeads = [];
  verticals = [];

  search_companies = new FormControl();
  search_programManagers = new FormControl();
  search_accountManagers = new FormControl();
  search_regionalManagers = new FormControl();
  search_regions = new FormControl();
  search_bu = new FormControl();
  search_natHead = new FormControl();
  search_vertical = new FormControl();


  filteredCompany: Observable<string[]>;
  filteredPgmgr: Observable<string[]>;
  filteredAcmgr: Observable<string[]>;
  filteredRgmgr: Observable<string[]>;
  filteredRegion: Observable<string[]>;
  filteredbu: Observable<string[]>;
  filteredNatHead: Observable<string[]>;
  filteredVerticals: Observable<string[]>;

  constructor(  public dialogRef: MatDialogRef<any>,
                @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.filterOptions = this.data;
    console.log(this.filterOptions);
    this.companies = this.filterOptions.businessName;
    this.programManagers = this.filterOptions.programManagers;
    this.accountManagers = this.filterOptions.accountManagers;
    this.regionalManagers = this.filterOptions.regionalManagers;
    this.regions = this.filterOptions.regions;
    this.bu = this.filterOptions.bu;
    this.nationalHeads =  this.filterOptions.nationalHeads;
    this.verticals = this.filterOptions.verticals;

    this.filteredCompany = this.search_companies.valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value ? value.toString() : '' , 'companies' , 'companyname'))
    );

    this.filteredPgmgr = this.search_programManagers.valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value ? value.toString() : '' , 'programManagers' , 'programManager'))
  );

    this.filteredAcmgr = this.search_accountManagers.valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value ? value.toString() : '' , 'accountManagers' , 'accountManagers'))
  );


    this.filteredRgmgr = this.search_regionalManagers.valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value ? value.toString() : '' , 'regionalManagers' , 'regionalManagers'))
  );

    this.filteredRegion = this.search_regions.valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value ? value.toString() : '' , 'regions' , 'region'))
  );
    this.filteredbu = this.search_bu.valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value ? value.toString() : '' , 'bu' , 'bu'))
  );
    this.filteredNatHead = this.search_natHead.valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value ? value.toString() : '' , 'nationalHeads' , 'name'))
  );
    this.filteredVerticals = this.search_natHead.valueChanges.pipe(
    startWith(''),
    map(value => this._filter(value ? value.toString() : '' , 'verticals' , 'vertical'))
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
  applyFilters() {
    console.log(this.search_companies.value);
    const data = {
      search_companies  : this.search_companies.value,
      search_programManagers  : this.search_programManagers.value,
      search_accountManagers : this.search_accountManagers.value ,
      search_regionalManagers : this.search_regionalManagers.value ,
      search_regions : this.search_regions.value ,
      search_bu: this.search_bu.value,
      search_national_head : this.search_natHead.value ,
      search_vertical  : this.search_vertical.value ,
      filterEnabled : true
    };
    this.dialogRef.close(data);
  }
}
