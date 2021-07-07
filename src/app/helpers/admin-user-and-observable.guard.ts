import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AccountService} from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AdminUserAndObservableGuard implements CanActivate {
  constructor(private service: AccountService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.service.user.isFBC()) {
      return true;
    }
    if (!this.service.user.isObserver()) {
      return false;
    }
    const serverName = route.params.servername;
    if (!serverName) {
      return true;
    }
    return this.service.user.observeTo()?.indexOf(serverName) >= 0;
  }
}
