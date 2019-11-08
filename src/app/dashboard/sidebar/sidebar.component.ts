import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/shared/shared/utils.service';
import { ApiServiceService } from 'src/app/shared/api-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  UserType = '';

  constructor(private utils: UtilsService , private _api: ApiServiceService) { }

  ngOnInit() {
  this.findUser();
  }
  findUser() {
    this._api.functionGET('api/user').subscribe((response) => {
      this.UserType = response.data.designation

    });
  }

}
