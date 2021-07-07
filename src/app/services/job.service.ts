import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Job} from '../model/job';
import {BehaviorSubject, Observable, of, Subject, timer} from 'rxjs';
import {environment} from '../../environments/environment';
import {mergeAll, mergeMap} from 'rxjs/operators';
import {AccountService} from './account.service';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  public jobs: Job[] = [];
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

  public delete(name: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/job`, {params: {name}});
  }

  public add(name: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/job`, null, {params: {name}});
  }

  public updateFromBackendNow(): void {
    this.requestNow.next();
  }

  private get(): Observable<Job[]> {
    return this.http.get<Job[]>(`${environment.apiUrl}/api/job/list`);
  }

  private getLastUpdate(): Observable<string> {
    return this.http.get<string>(`${environment.apiUrl}/api/job/timestamp`);
  }

  private getNewData(): Observable<void> {
    return new Observable<void>(observer => {
      // console.log('getNewData');
      if (!this.accountService.user?.isFBC()) {
        this.jobs = [];
        observer.next();
      } else {
        this.getLastUpdate().subscribe(lu => {
          if (lu !== this.lastUpdate) {
            // console.log('jobs timestamp updated. old:', this.lastUpdate, ' new:', lu);
            this.lastUpdate = lu;
            this.loading = true;
            this.get().subscribe(j => {
              this.jobs = j;
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
