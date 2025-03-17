import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CustomerFilter} from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) {
  }

  public get(filter?: CustomerFilter) {
    const params = {};

    return this.http.get("api/customers", {params, observe: "response"});
  }
}
