import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private isAdmin = new BehaviorSubject('');
  userChange = this.isAdmin.asObservable();

  constructor() {}

    tableformater(tableData) {
        const temp = JSON.stringify(tableData);
        return JSON.parse(temp);

    }
    SendUserType(event) {
      this.isAdmin.next(event);
        }

        getValue(array , key: string , value: any , findVal: string) {
          let retval = null;
          array.map((x) => {
            if (x[key] === value) {
               retval =  x[findVal];
              }
             });
             console.log(retval)
          return retval;
        }

        removeNull(value){
          return value === null ? '' : value;
        }


}
