import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { MatDialog } from '@angular/material';
import { ConfirmpopComponent } from '../confirmpop/confirmpop.component';
import { UtilsService } from 'src/app/shared/shared/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-del-batch',
  templateUrl: './view-del-batch.component.html',
  styleUrls: ['./view-del-batch.component.css']
})
export class ViewDelBatchComponent implements OnInit {
  search = '';
  batchData = [];
  tableData = [];
  batchTablecol = ['Batch ID', 'Time', 'Action'];
  viewbatchID = '';
  selectedIndex_inner = 0;
  tableCols: string[] = ['OPF No', 'OPF Date', 'Region Head', 'Effective Acc Mngr', 'ACCNT Manager', 'Raised ACCNT Manager', 'PM',
    'EMP Status', 'Company', 'Product Size', 'Services', 'Vertical', 'Business Type', 'Region(Current AM)'
    , 'Region(Raised AM)', 'Order Type', 'OTC', 'OTC Multiplier', 'MRC', 'Currency', 'Deactivation Raised Date',
    'Deactivation Date', 'Approval Status', 'Order Status',
    'Effective Region', 'Effective Trans Date', 'Effective Week', 'Effective Qrtr', 'Currency Multiplier'
    , 'New Sales OTC', 'New Sales MRC', 'New Sales ARC', 'Upgrade OTC', 'Upgrade MRC', 'Upgrade ARC'
    , 'Degarde MRC', 'Degarde ARC', 'Deactivation MRC', 'Deactivation ARC', 'Gross ARC Added'
    , 'NET OTC', 'NET MRC', 'NET ARC', 'Company Verticals', 'Presales Name', 'Remarks', 'Month'
    , 'Ver 1', 'Billing Status', 'National head',
    'BU', 'OPF Version', 'Collection Status', 'Company ID'];
  constructor(private spinner: NgxSpinnerService,
              private _api: ApiServiceService,
              private dialog: MatDialog,
              private utils : UtilsService,
              private router: Router) { }

  page = {

    pageSizeOptions: [10, 25, 50, 100]
    , limit: 25
    , pageSize: 25
  };
  viewPage = {

    pageSizeOptions: [10, 25, 50, 100]
    , limit: 25
    , pageSize: 25
  };

  ngOnInit() {
  this.findUser();
  }
  findUser() {
    this._api.functionGET('api/user').subscribe((response) => {
      if (response.data['designation'] !== 'admin' ) {
        this.router.navigate(['/dashboard/interface']);
        return false;
      } else {
    this.getBatchData({ page: 1, perPage: 25 });
      }
    });
  }

  getBatchData(apiData) {
    const data = new FormData();
    data.append('page', apiData.page);
    data.append('perPage', apiData.perPage);
    data.append('search', this.search);
    this.spinner.show();
    this._api.functionPOST('api/fetchBatch', data).subscribe((response) => {
      this.batchData = response.data.data;
      this.page.limit = response.data.total;
      this.spinner.hide();
    });

  }


  view(apiData){
    this.viewbatchID =  apiData.batchid;
    this.viewAPI({page : 1 , perPage : 25});
  }
  viewAPI(apiData) {

const data = new FormData();
data.append('page', apiData.page ? apiData.page : 1);
data.append('perPage', apiData.perPage ? apiData.perPage : 25);
data.append('batch_id', this.viewbatchID );
this.spinner.show();
this._api.functionPOST('api/viewBatch', data).subscribe((response) => {
      this.tableData = this.utils.tableformater(response.data.data);
      this.viewPage.limit = response.data.total;
      this.spinner.hide();
      this.selectedIndex_inner = 1;
    });

  }
  confirmDelete(data) {
    const dialogRef = this.dialog.open(ConfirmpopComponent, {
      maxWidth: '350px'
      , data: {
        msg: 'Are you sure you want to delete this batch?'
      }

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.delBatch(data);
      }
    }
    );
  }
  PageChange($event) {
    console.log($event);
    this.getBatchData({ perPage: $event.pageSize, page: $event.pageIndex + 1 });
  }
  viewPageChange($event) {
    console.log($event);
    this.viewAPI({ perPage: $event.pageSize, page: $event.pageIndex + 1 });
  }

  delBatch(apiData) {
    console.log(apiData);
    const data = new FormData();
    data.append('batch_id', apiData.batchid);
    this._api.functionPOST('api/deleteBatch', data).subscribe((response) => {
      this._api.openSnackBar(response.data.msg, 'Success');
      this.getBatchData({ page: 1, perPage: 25 });
    });
  }
  searchBatch(){
    if(!this.search){
      this._api.openSnackBar('Enter Batch ID to search' , 'Error');
      return;
    }
    this.getBatchData({ page: 1, perPage: 25 });
  }
  refresh(){
    this.search = '';
    this.getBatchData({ page: 1, perPage: 25 });

  }

}
