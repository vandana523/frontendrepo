import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidatorService {
  public markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
  
      if (control['controls']) {
          control['controls'].forEach(c => this.markFormGroupTouched(c));
      }
    });
  }
  constructor() { }
}
