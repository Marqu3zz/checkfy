import {AfterViewInit, Component, EventEmitter} from '@angular/core';
import {TableComponent} from '../../../shared/libs/lib-angular/components/table/table.component';
import {IColumn} from '../../../shared/libs/lib-angular/interfaces/table.interface';
import {CustomerFilter, ICustomer} from '../../../shared/models/customer.model';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatSuffix} from '@angular/material/form-field';
import {Observable} from 'rxjs';
import {CustomerService} from '../../../shared/services/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    TableComponent,
    MatIconButton,
    MatIcon,
    MatSuffix
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements AfterViewInit {
  columns: IColumn[] = [
    {
      key: "id",
      title: "Id",
    },
    {
      key: "name",
      title: "Nome",
    },
    {
      key: "document",
      title: "Documento",
    },
    {
      key: "phone",
      title: "Telefone",
    }
  ];

  filter: CustomerFilter = new CustomerFilter();
  form = this.filter.buildForm();

  getDataEmitter: EventEmitter<Observable<any>> = new EventEmitter();

  constructor(protected customerService: CustomerService) {
  }

  ngAfterViewInit() {
    this.getDataEmitter.emit(this.customerService.get(this.form.getRawValue() as CustomerFilter));
  }
}
