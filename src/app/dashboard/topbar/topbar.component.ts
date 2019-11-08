import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from 'src/app/shared/api-service.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  name = '';
  constructor(private api: ApiServiceService) { }

  ngOnInit() {
    this.findUser();
  }
  findUser() {
    this.api.functionGET('api/user').subscribe((response) => {
      this.name = response['data']['name'];
    });
  }

  logout(){
    this.api.logout();
  }

}
