import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { UtilsService } from 'src/app/shared/shared/utils.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { FilterpopupComponent } from '../../filterpopup/filterpopup.component';
import { MatDialog } from '@angular/material';
import { ThrowStmt } from '@angular/compiler';
import { SelectionModel } from '@angular/cdk/collections';
import { MergepopupComponent } from '../../mergepopup/mergepopup.component';
import { ViewChildCompanyComponent } from '../../view-child-company/view-child-company.component';

@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css']
})
export class InterfaceComponent implements OnInit {


  tableCols: string[] = [ 'Select', 'Action', 'OPF No', 'OPF Date', 'Region Head', 'Effective Acc Mngr' , 'ACCNT Manager', 'Raised ACCNT Manager', 'PM',
    'EMP Status', 'Company', 'Product Size', 'Services', 'Vertical', 'Business Type', 'Region(Current AM)'
    , 'Region(Raised AM)', 'Order Type', 'OTC', 'OTC Multiplier', 'MRC', 'Currency', 'Deactivation Raised Date',
    'Deactivation Date', 'Approval Status', 'Order Status',
    'Effective Region', 'Effective Trans Date', 'Effective Week', 'Effective Qrtr', 'Currency Multiplier'
    , 'New Sales OTC', 'New Sales MRC', 'New Sales ARC', 'Upgrade OTC', 'Upgrade MRC', 'Upgrade ARC'
    , 'Degarde MRC', 'Degarde ARC', 'Deactivation MRC', 'Deactivation ARC', 'Gross ARC Added'
    , 'NET OTC', 'NET MRC', 'NET ARC', 'Company Verticals', 'Presales Name', 'Remarks', 'Month'
    , 'Ver 1', 'Billing Status', 'National head',
    'BU',  'OPF Version', 'Collection Status', 'Company ID'];

    InterFaceTable: string[] = ['Company Name' , 'MRC' , 'OTC' , 'National Head' , 'Regional Head' , 'Account Manager' , 'Action'];



  tableData = [];
  isAdmin = true;
  edit = {};
  companies = [];
  programManagers = [];
  regionalManagers = [];
  accountManagers = [];
  bu = [];
  nationalHeads = [];
  verticals = [];
  regions = [];
  otc_mrc = [];
  programManager = '';
  company = '';
  reginalManager = '';
  selected_bu = '';
  accountManager = '';
  region = '';
  nationalHead = '';
  selected_vertical = '';
  searching_Comapny = '';
  selectedIndex_inner = 0;
  filterEnabled = false;

  editregion_head = {};
  editpm = {};
  editeffective_acc_mngr = {};
  companyIds = [];
  companiesTomerge = [];

  constructor(private spinner: NgxSpinnerService
    ,         private _api: ApiServiceService
    ,         private util: UtilsService
    ,         private dialog: MatDialog) { }
    @ViewChild('panel', { static: true }) public panel: ElementRef<any>;
  page = {

    pageSizeOptions: [10, 25, 50, 100]
    , limit: 25
    , pageSize: 25
  };
  CompanyPage = {

    pageSizeOptions: [10, 25, 50, 100]
    , limit: 25
    , pageSize: 25
  };
  selection = new SelectionModel<any>(true, []);

  PageChange($event) {
    console.log($event);
    this.getInterface({ perPage: $event.pageSize, page: $event.pageIndex + 1 });
  }
  CompanyPageChange($event) {
    console.log($event);
    this.getCompanyData({ perPage: $event.pageSize, page: $event.pageIndex + 1 });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableData.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tableData.forEach(row => this.selection.select(row));

    this.isAllSelected() ? this.tableData.forEach(row => row.checkbox = true) :
      this.tableData.forEach(row => row.checkbox = false);
  }

  ngOnInit() {
    this.findUser();


  }


  findUser() {
    this._api.functionGET('api/user').subscribe((response) => {
      if (response.data.designation !== 'admin' ) {

        this.isAdmin = false;
        let newArray: Array<any> =[] 
        this.tableCols.map((x) => {
          if(x !=='Action' && x !== 'Select' ){
           newArray.push(x);
          }
        
        });
        console.log(newArray)
        this.tableCols = newArray;



      }
      this.getCompanyData({ page: 1, perPage: 25 });
      // this.getInterface({page : 1 , perPage : 25});
      this.getFilterOptions('companies');
      this.getFilterOptions('programManagers');
      this.getFilterOptions('regions');
      this.getFilterOptions('accountManagers');
      this.getFilterOptions('regionalManagers');
      this.getFilterOptions('bu');
      this.getFilterOptions('nationalHeads');
      this.getFilterOptions('verticals');
      this.getCompanyIds();

    });
  }
  enableEdit(index , data) {


    // tslint:disable-next-line: no-string-literal
    this.editeffective_acc_mngr[index] = data['effective_acc_mngr'];
    // tslint:disable-next-line: no-string-literal
    this.editpm[index] = data['pm'];

    // tslint:disable-next-line: no-string-literal
    this.editregion_head[index] = data['region_head'];
    this.edit[index] = 1;
    console.log(data , this.editregion_head[index]);
  }
  destroyObj() {
  this.selectedIndex_inner = 0;
  this.editeffective_acc_mngr = {};
  this.editpm = {};
  this.editregion_head = {};
  this.edit = {};
}
scrollEve($event) {
  this.panel.nativeElement.scrollTo({ left: (this.panel.nativeElement.scrollLeft + 150), behavior: 'smooth', });
}


  getInterface(apiData) {
    const data = new FormData();
    data.append('page', apiData.page);
    data.append('perPage', apiData.perPage);
    data.append('company', this.searching_Comapny);
    data.append('programManager', this.programManager);
    data.append('region', this.region);
    data.append('accountManager', this.accountManager);
    data.append('reginalManager', this.reginalManager);
    data.append('bu', this.selected_bu);
    this.spinner.show();

    this._api.functionPOST('api/fetchInterface', data).subscribe(response => {
      this.spinner.hide();
      this.page.limit = response.data.total;
      this.tableData = this.util.tableformater(response.data.data);
      this.selectedIndex_inner = 1;


    });
  }
  getCompanyData(apiData) {
    const data = new FormData();
    data.append('page', apiData.page );
    data.append('perPage', apiData.perPage);
    data.append('programManager', this.programManager);
    data.append('region', this.region);
    data.append('accountManager', this.accountManager);
    data.append('reginalManager', this.reginalManager);
    data.append('company', this.company);
    data.append('bu', this.selected_bu);
    data.append('nationalHead', this.nationalHead);
    data.append('vertical', this.selected_vertical);

    this.spinner.show();

    this._api.functionPOST('api/companyList', data).subscribe(response => {
      this.spinner.hide();
      this.page.limit = response.data.total;
      this.otc_mrc = this.util.tableformater(response.data.data);


    });
  }
  getFilterOptions(filtertype) {
    this._api.functionPOST('api/' + filtertype, '').subscribe((response) => {
      this[filtertype] = response.data;
    });
  }
  // this.filteredOptions = this.searchparam.valueChanges.pipe(
  //   startWith(''),
  //   map(value => this._filter(value ? value.toString() : '' , 'businessName' , 'companyname'))
  // );

  fetchInterface(company) {
    this.searching_Comapny  = company;
    this.getInterface({ page: 1, perPage: this.page.pageSize });

  }
  refresh() {
    this.programManager = '';
    this.company = '';
    this.reginalManager = '';
    this.selected_bu = '';
    this.accountManager = '';
    this.region = '';
    this.searching_Comapny = '';
    this.selected_vertical = '';
    this.nationalHead = '';
    this.filterEnabled = false;

    this.getCompanyData({ page: 1, perPage: 25 });
  }

  getCompanyIds() {
    this._api.functionPOST('api/fetchAllCompanies' , '').subscribe((response) => {
      this.companyIds = response.data;
    });

  }
  openFilter(): void {
    const data = {
      businessName : this.companies,
      bu :  this.bu ,
      regions : this.regions ,
      accountManagers : this.accountManagers,
      regionalManagers : this.regionalManagers,
      programManagers: this.programManagers,
      nationalHeads : this.nationalHeads,
      verticals : this.verticals



    };
    const dialogRef = this.dialog.open(FilterpopupComponent, {
      data , minWidth : '550px' , maxWidth: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        console.log(result);
        this.company =  result.search_companies ? result.search_companies : '';
        this.programManager = result.search_programManagers ? result.search_programManagers : '';
        this.accountManager = result.search_accountManagers ?  result.search_accountManagers  : '' ;
        this.reginalManager = result.search_regionalManagers ? result.search_regionalManagers : '';
        this.region =  result.search_regions ?   result.search_regions : ''  ;
        this.selected_bu =     result.search_bu  ?      result.search_bu : '';
        this.nationalHead =     result.search_national_head  ?      result.search_national_head : '';
        this.selected_vertical = result.search_vertical ? result.search_vertical  : '' ;
        this.filterEnabled = result.filterEnabled;

        this.getCompanyData({ page: 1, perPage: 25 });

      }
    });
  }

  openChilds(apiData) {
    const data = {
    childs : apiData.childCompany,
    parent  : apiData.company
    };
    console.log(apiData);
    const dialogRef = this.dialog.open(ViewChildCompanyComponent, {
      data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchInterface(result);
      }
    });
  }


  openMerge(): void {



    const data = {
companyID : this.companyIds
    };

    const dialogRef = this.dialog.open(MergepopupComponent, {
      data ,
      minWidth : '400px'
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        console.log(result);
        this.mergeCompany(result);
      }
    });

}
mergeCompany(companyId) {
  const opfArray = [];
  this.spinner.show();
  const data = new FormData();
  this.tableData.map((x) => {
    if (x.checkbox) {
      opfArray.push(x.id);
    }
  });
  data.append('opfIds', JSON.stringify(opfArray) );
  data.append('companyId', companyId);
  this._api.functionPOST('api/mergeOpfCompany' , data).subscribe((response) => {
    this.spinner.hide();
    this._api.openSnackBar(response.data.msg , 'Success');
    this.selection.clear();
    this.getInterface({ page: 1, perPage: this.page.pageSize });
  });

}
delete() {
  const opfArray = [];
  this.spinner.show();
  const data = new FormData();
  this.tableData.map((x) => {
    if (x.checkbox) {
      opfArray.push(x.id);
    }
  });
  data.append('opfIds', JSON.stringify(opfArray) );
  this._api.functionPOST('api/deleteOpf' , data).subscribe((response) => {
    this.spinner.hide();
    this._api.openSnackBar(response.data.msg , 'Success');
    this.selection.clear();
    this.getInterface({ page: 1, perPage: this.page.pageSize });
  });
}

save(index) {
  console.log(this.tableData[index]);
  const data = new FormData();
  data.append('opfNo' , this.tableData[index].opf_no);
  data.append('regionHead' , this.editregion_head[index]);
  data.append('effectiveAccMngr' , this.editeffective_acc_mngr[index]);
  data.append('pm' , this.editpm[index]);
  this._api.functionPOST('api/updateOpf' , data).subscribe((response) => {
    this.spinner.hide();
    this._api.openSnackBar(response.data.msg , 'Success');
    this.selection.clear();
    this.getInterface({ page: 1, perPage: this.page.pageSize });
  });
}
}
