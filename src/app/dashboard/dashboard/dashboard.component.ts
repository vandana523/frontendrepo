import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private _api: ApiServiceService , private router: Router) { }

  ngOnInit() {
    //this.findUser();
  }
  findUser() {
    this._api.functionGET('api/user').subscribe((response) => {
      if (response.data.designation !== 'admin' ) {
        this.router.navigate(['/dashboard/interface']);
        return false;
      } else {
        this.router.navigate(['/dashboard/uploader']);
      }
    });
  }
}
