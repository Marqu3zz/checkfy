import {Abstract} from './abstract.model';
import {FormGroup} from '@angular/forms';

export interface ICustomer {

}

export class CustomerFilter extends Abstract implements ICustomer {
  id: number;

  buildForm() {
    return new FormGroup({

    })
  }
}
