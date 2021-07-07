import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {tap} from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import {AuthenticationResponse} from '../model/authentication-response';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  user: User;

  constructor(private auth: AuthService, private http: HttpClient) {
    this.user = this.getJWTUser();
  }

  login(email: string, password: string): Observable<any> {
    const url = `${environment.apiUrl}/api/auth/login`;
    return this.http.post<AuthenticationResponse>(url, {email, password})
      .pipe(tap(r => this.setTokenAndUser(r)));
  }

  logout(): void {
    this.auth.logout();
    this.user = new User();
  }

  isLogged(): boolean {
    return this.auth.getToken() !== null;
  }

  setTokenAndUser(response: AuthenticationResponse): AuthenticationResponse {
    this.auth.setToken(response.token);
    this.user =  this.getJWTUser();
    return response;
  }

  private getDecodedJwtToken(): any {
    try {
      return jwt_decode(this.auth.getToken());
    } catch (Error) {
      return null;
    }
  }

  private getJWTUser(): User {
    const decoded = this.getDecodedJwtToken();
    return new User(decoded ? {email: decoded.sub, roles: decoded.authorities} : null);
  }

  register(email: string, name: string, password: string): Observable<any> {
    // console.log('account userService. register.', {username, password});
    const url = `${environment.apiUrl}/api/auth/registration`;
    return this.http.post(url, {email, name, password});
  }
}
