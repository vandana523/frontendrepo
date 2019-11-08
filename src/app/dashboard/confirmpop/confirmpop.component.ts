import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirmpop',
  templateUrl: './confirmpop.component.html',
  styleUrls: ['./confirmpop.component.css']
})
export class ConfirmpopComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }
  message: string;
  ngOnInit() {
    this.message = this.data['msg']
  }
}
