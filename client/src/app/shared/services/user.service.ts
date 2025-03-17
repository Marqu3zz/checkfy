import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IUser} from '../models/user.model';
import {BehaviorSubject} from 'rxjs';
import {PopupService} from '../libs/lib-angular/services/popup.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private usersSubject = new BehaviorSubject<IUser[]>([]);
    users$ = this.usersSubject.asObservable();

    constructor(private http: HttpClient,
                private popupService: PopupService) {
    }

    public get() {
        return this.http.get<IUser[]>("api/users").subscribe({
            next: (response) => {
              this.usersSubject.next(response);
            },
            error: (error)=> {
                this.popupService.openSnackBar(`Erro ao buscar dadso do banco de dados: ${error}`, {type: "error"});
            }
        });
    }

    public getById(id: string) {
      return this.http.get<IUser>(`api/users/${id}`);
    }
}
