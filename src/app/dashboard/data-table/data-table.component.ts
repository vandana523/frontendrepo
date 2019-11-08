import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TableparserComponent } from '../tableparser/tableparser.component';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  tableCols: string[] = ['OPF No' , 'OPF Date' , 'Region Head','Effective Acc Mngr','Program Manager', 'ACCNT Manager' , 'Raised ACCNT Manager' ,
   'EMP Status' , 'Company' , 'Product Size' , 'Services' , 'Vertical' , 'Business Type' , 'Region(Current AM)'
  , 'Region(Raised AM)' , 'Order Type' , 'OTC' , 'OTC Multiplier' , 'MRC', 'Currency' , 'Deactivation Raised Date' ,
  'Deactivation Date' , 'Approval Status' , 'Order Status' ,  
  'Effective Region' , 'Effective Trans Date' , 'Effective Week' , 'Effective Qrtr' , 'Currency Multiplier'
 , 'New Sales OTC' , 'New Sales MRC' , 'New Sales ARC' , 'Upgrade OTC' , 'Upgrade MRC' , 'Upgrade ARC'
, 'Degarde MRC' , 'Degarde ARC' , 'Deactivation MRC', 'Deactivation ARC', 'Gross ARC Added'
, 'NET OTC' , 'NET MRC' , 'NET ARC' , 'Company Verticals' , 'Presales Name' , 'Remarks' , 'Month'
, 'Ver 1' , 'Billing Status'  , 'National head' ,
'BU' , 'PM' , 'OPF Version' , 'Collection Status' , 'Company ID' , 'Error'];

tableData = [];
batchID = '';
page = {
  pageSizeOptions: [50, 100, 150, 200]
  , limit: 25
  , pageSize: 25
};
dispTotal = '';
dispSuccess = '';
dispFailure = '';



PageChange($event) {
  console.log($event);
  this.getFailed({ perPage: $event.pageSize, page: $event.pageIndex + 1 });
}

  constructor(private dialog: MatDialog ,
              // tslint:disable-next-line: variable-name
              private _api: ApiServiceService,
              private spinner : NgxSpinnerService,
              private router  : Router) { }

  ngOnInit() {
     
  }
  findUser() {
    this._api.functionGET('api/user').subscribe((response) => {
      if (response.data['designation'] !== 'admin' ) {
        this.router.navigate(['/dashboard/interface']);
        return false;
      } else {
   this.isDatacached();
      }
    });
  }

  
isDatacached() {
    const data = sessionStorage.getItem('tableData');
    this.batchID = sessionStorage.getItem('batchID');
    if (data) {
this.getFailed({ perPage: 25, page:1 });
    }
  }
openParser(): void {
    const dialogRef = this.dialog.open(TableparserComponent, {
      minWidth : '500px'
    });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        console.log(result);
        sessionStorage.removeItem('tableData');
        this.batchID = result.batchId;
        sessionStorage.setItem('batchID', JSON.stringify(this.batchID));
        this.getFailed({ page: 1, perPage: 100 });

        //
      }
    });
  }

  getFailed(apiData) {
    const data = new FormData();
    data.append('page', apiData.page );
    data.append('perPage', apiData.perPage);
    data.append('batchId', this.batchID);
    this.spinner.show();
    this._api.functionPOST('api/fetchFailedInterface' , data).subscribe((response) => {
   this.tableData = response.data.data;
   sessionStorage.setItem('tableData', JSON.stringify(this.tableData));
   this.page.limit = response.data.total;
   this.dispTotal = response.data.successCount +  response.data.total;
   this.dispSuccess = response.data.successCount;
   this.dispFailure = response.data.total;
   this.spinner.hide();
    });

  }

}
