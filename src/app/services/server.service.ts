import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subject, timer} from 'rxjs';
import {environment} from '../../environments/environment';
import {mergeAll, mergeMap, tap} from 'rxjs/operators';
import {Server} from '../model/server';
import {AccountService} from './account.service';

export interface DatabaseInfo {
  dataBaseName: string;
  firmName: string;
  mdfSize: number;
  ldfSize: number;
}

export interface Info {
  name: string;
  sqlVersion: string;
  sqlVersionDescription: string;
  mainCompany: string;
  licenseFor: string;
  priorityVersion: string;
  firms: DatabaseInfo[];
  another: DatabaseInfo[];
  systemDB: DatabaseInfo;
  pritempDB: DatabaseInfo;

  numberFiles: number;
  filesSize: number;
  numberFolders: number;
  foldersSize: number;
  numberBackupFiles: number;
  backupSize: number;
  numberFilesCanClear: number;
  filesCanClearSize: number;

  freeSpacePriority: number;
  freeSpaceForMdf: number;
  freeSpaceForLdf: number;

  updated: string;
}

export interface CalculatedData {
  usedSpacePriority: number;
  totalPriorityDiskSize: number;
  percentPriorityUsage: number;
  canClearPrioritySpace: number;
  canClearPriorityFiles: number;

  usedSpaceDbForClient: number;
  usedSpaceDb: number;
  usedSpaceDbMdf: number;
  usedSpaceDbLdf: number;
  percentDbUsageMdf: number;
  percentDbUsageLdf: number;
  canClearDbSpace: number;

  usedSpaceFirmsDbMdf: number;
  usedSpaceFirmsDbLdf: number;
  usedSpaceAnotherDbMdf: number;
  usedSpaceAnotherDbLdf: number;
}

const percent = (free: number, now: number) => now * 100 / (now + free);

class CalculatedDataImpl implements CalculatedData {
  canClearDbSpace: number;
  canClearPriorityFiles: number;
  canClearPrioritySpace: number;
  percentDbUsageLdf: number;
  percentDbUsageMdf: number;
  percentPriorityUsage: number;
  totalPriorityDiskSize: number;
  usedSpaceDb: number;
  usedSpaceDbForClient: number;
  usedSpaceDbLdf: number;
  usedSpaceDbMdf: number;
  usedSpaceFirmsDbLdf: number;
  usedSpaceFirmsDbMdf: number;
  usedSpacePriority: number;
  usedSpaceAnotherDbLdf: number;
  usedSpaceAnotherDbMdf: number;
}

function fillCalculationData(info: Info): CalculatedData {
  const data = new CalculatedDataImpl();

  data.usedSpaceFirmsDbMdf = (info.firms || []).reduce((sum, d) => sum + d.mdfSize || 0, 0);
  data.usedSpaceFirmsDbLdf = (info.firms || []).reduce((sum, d) => sum + d.ldfSize || 0, 0);
  data.usedSpaceAnotherDbMdf = (info.another || []).reduce((sum, d) => sum + (d.mdfSize || 0), 0);
  data.usedSpaceAnotherDbLdf = (info.another || []).reduce((sum, d) => sum + (d.ldfSize || 0), 0);

  data.usedSpacePriority = (info.filesSize || 0) + (info.foldersSize || 0);
  data.totalPriorityDiskSize = (info.freeSpacePriority || 0) + data.usedSpacePriority;
  data.percentPriorityUsage = percent((info.freeSpacePriority || 0), data.usedSpacePriority);
  data.canClearPrioritySpace = (info.filesCanClearSize || 0) + (info.backupSize || 0);
  data.canClearPriorityFiles = (info.numberFilesCanClear || 0) + (info.numberBackupFiles || 0);

  data.usedSpaceDbMdf = (info.systemDB.mdfSize || 0) + (info.pritempDB.mdfSize || 0) + data.usedSpaceFirmsDbMdf
    + data.usedSpaceAnotherDbMdf;
  data.usedSpaceDbLdf = (info.systemDB.ldfSize || 0) + (info.pritempDB.ldfSize || 0) + data.usedSpaceFirmsDbLdf
    + data.usedSpaceAnotherDbLdf;

  data.usedSpaceDbForClient = (info.systemDB.mdfSize || 0) + (info.pritempDB.mdfSize || 0) + data.usedSpaceFirmsDbMdf
    + (info.systemDB.ldfSize || 0) + (info.pritempDB.ldfSize || 0) + data.usedSpaceFirmsDbLdf;
  data.usedSpaceDb = data.usedSpaceDbMdf + data.usedSpaceDbLdf;

  data.percentDbUsageMdf = percent((info.freeSpaceForMdf || 0), data.usedSpaceDbMdf);
  data.percentDbUsageLdf = percent((info.freeSpaceForLdf || 0), data.usedSpaceDbLdf);
  data.canClearDbSpace = (info.systemDB.ldfSize || 0) + (info.pritempDB.mdfSize || 0) + (info.pritempDB.ldfSize || 0)
    + data.usedSpaceFirmsDbLdf + data.usedSpaceAnotherDbMdf + data.usedSpaceAnotherDbLdf;
  return data;
}

@Injectable({
  providedIn: 'root'
})

export class ServerService {
  public servers: Server[] = [];
  public info: Info;
  public data: CalculatedData;

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

  public delete(serverName: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/info`, {params: {server: serverName}});
  }

  public getServerInfo(serverName: string): Observable<Info> {
    return this.http.get<Info>(`${environment.apiUrl}/api/info`, {params: {server: serverName}})
      .pipe(tap(info => this.setterData(info)));
  }

  public updateFromBackendNow(): void {
    this.requestNow.next();
  }

  private setterData(info: Info): void {
    this.info = info;
    this.data = fillCalculationData(info);
  }

  private getListOfAvailableServers(): Observable<Server[]> {
    return this.http.get<Server[]>(`${environment.apiUrl}/api/info/list`);
  }

  private getLastUpdate(): Observable<string> {
    return this.http.get<string>(`${environment.apiUrl}/api/info/timestamp`);
  }

  private getNewData(): Observable<void> {
    return new Observable<void>(observer => {
      // console.log('getNewData');
      if (!(this.accountService.user?.isFBC() || this.accountService.user?.isObserver())) {
        this.servers = [];
        observer.next();
      } else {
        this.getLastUpdate().subscribe(lu => {
          if (lu !== this.lastUpdate) {
            // console.log('timestamp updated. old:', this.lastUpdate, ' new:', lu);
            this.lastUpdate = lu;
            this.loading = true;
            this.getListOfAvailableServers().subscribe(s => {
              this.servers = s;
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
