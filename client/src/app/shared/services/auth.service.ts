import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {IAuth} from "../models/auth.model";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user = null;

  constructor(private http: HttpClient) {
  }

  login(body: IAuth) {
    return this.http.post("api/auth", body);
  }

  async authenticate() {
    try {
      this.user = await firstValueFrom(this.http.get("api/auth"));
    } catch {
      this.user = null;
    }

    return !!this.user;
  }

  async logout() {
    return firstValueFrom(this.http.get("api/auth/logout"));
  }
}
