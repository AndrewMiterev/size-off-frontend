import {Injectable} from '@angular/core';
import {User} from '../model/user';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subject, timer} from 'rxjs';
import {environment} from '../../environments/environment';
import {mergeAll, mergeMap} from 'rxjs/operators';
import {AccountService} from './account.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public users: User[] = [];
  public loading = false;
  public forSubscribe: BehaviorSubject<void> = new BehaviorSubject<void>(null);

  private requestNow: Subject<void> = new Subject<void>();
  private lastUpdate = '';

  constructor(private http: HttpClient, private accountService: AccountService) {
    // not need to unsubscribe because service must work everytime
    of(this.requestNow, timer(0, 10000))
      .pipe(mergeAll())
      .pipe(
        mergeMap(() => this.getNewData())
      ).subscribe(() => {
      this.forSubscribe.next();
    });
  }

  public getUser(email: string): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/api/auth/one/${email}`);
  }

  public getCountUsersWithoutPermission(): number {
    return this.users.filter(u => !u.roles?.length).length;
  }

  public updateUser(u: User): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/auth`, new User(u));
  }

  public deleteUser(email: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/auth/${email}`);
  }

  public updateFromBackendNow(): void {
    this.requestNow.next();
  }

  private getListOfUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/api/auth/list`);
  }

  private getLastUpdate(): Observable<string> {
    return this.http.get<string>(`${environment.apiUrl}/api/auth/timestamp`);
  }

  private getNewData(): Observable<void> {
    return new Observable<void>(observer => {
      // console.log('getNewData');
      if (!this.accountService.user?.isAdmin()) {
        this.users = [];
        observer.next();
      } else {
        this.getLastUpdate().subscribe(lu => {
          if (lu !== this.lastUpdate) {
            // console.log('timestamp updated. old:', this.lastUpdate, ' new:', lu);
            this.lastUpdate = lu;
            this.loading = true;
            this.getListOfUsers().subscribe(u => {
              this.users = u;
              observer.next();
              this.loading = false;
            });
            // } else {
            //   console.log('old data');
          }
        });
      }
    });
  }

}
