import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-child-company',
  templateUrl: './view-child-company.component.html',
  styleUrls: ['./view-child-company.component.css']
})
export class ViewChildCompanyComponent implements OnInit {

  children = [];
  parent = '';
  InterFaceTable: string[] = ['Company Name' , 'MRC' , 'OTC' , 'National Head' , 'Regional Head' , 'Account Manager' ];

  constructor( public dialogRef: MatDialogRef<any>,
               @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
     this.children  = this.data.childs;
     this.parent  = this.data.parent;
    console.log(this.data);
  }
  viewData(companyName){
    this.dialogRef.close(companyName)
  }


  
}
