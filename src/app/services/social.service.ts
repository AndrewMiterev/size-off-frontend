import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationResponse} from '../model/authentication-response';
import {AccountService} from './account.service';
import {tap} from 'rxjs/operators';
import {PushPopService} from './push-pop.service';

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  private authorizeEndpoint = '/oauth2/authorization';
  private tokenEndpoint = '/login/oauth2/code/';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private accountService: AccountService, private pushPopService: PushPopService) {
  }

  private callAuthorization(provider: string): void {
    setTimeout(() => {
      window.open(this.baseUrl + this.authorizeEndpoint + '/' + provider, '_self');
    }, 100);
  }

  login(provider: string): void {
    this.pushPopService.push('provider', provider);
    this.callAuthorization(provider);
  }

  register(provider?: string): void {
    const oldProvider = this.pushPopService.pop('provider');
    this.pushPopService.push('create', 'true');
    this.callAuthorization(provider ? provider : oldProvider);
  }

  logout(): void {
    // todo for social
  }

  fetchToken(code: string, state: string): Observable<AuthenticationResponse> {
    const create = this.pushPopService.pop('create');
    return this.http.get<AuthenticationResponse>(this.baseUrl + this.tokenEndpoint + 'sizeOff',
      {params: {code, state, create}})
      .pipe(tap(r => this.accountService.setTokenAndUser(r)));
  }
}
