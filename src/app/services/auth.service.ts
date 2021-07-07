import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {
  }

  setToken(token: string): void {
    // console.log('token set to', token);
    localStorage.setItem('accessToken', token);
  }

  getToken(): string {
    return localStorage.getItem('accessToken');
  }

  logout(): void {
    localStorage.removeItem('accessToken');
  }
}
