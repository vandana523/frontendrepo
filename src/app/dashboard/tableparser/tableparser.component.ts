import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-tableparser',
  templateUrl: './tableparser.component.html',
  styleUrls: ['./tableparser.component.css']
})
export class TableparserComponent implements OnInit {
  file = new FormControl('');
  uploadFile: any;
   filename: '';
   

  constructor(private _api: ApiServiceService
    ,         private spinner: NgxSpinnerService
    ,         public dialogRef: MatDialogRef<any>) { }

  ngOnInit() {
  }
  upload($event) {

    this.uploadFile = $event.target.files[0];
    this.filename =  $event.target.files[0].name;
    console.log($event , this.uploadFile );

  }
  StartUpload() {

  //   if (this.uploadFile.type !== 'text/csv') {
  //     this._api.openSnackBar('Please upload a valid csv file' , 'Error');
  //     return;
  //  }
    const data = new FormData();
    data.append('uploads', this.uploadFile);
    this.spinner.show();

    this._api.functionPOST('api/upload' , data).subscribe(response => {
      this.file.reset();
      this.spinner.hide();
      console.log(response);
    //  this._api.openSnackBar(response.data.msg , 'success');
      this.dialogRef.close(response.data);

    });
  }

}
