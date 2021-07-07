import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Server} from '../../model/server';
import {MatSort} from '@angular/material/sort';
import {ServerService} from '../../services/server.service';
import {AccountService} from '../../services/account.service';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from '../../services/alert.service';
import {DialogOkCancelComponent} from '../dialog-ok-cancel/dialog-ok-cancel.component';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss']
})
export class ServersComponent implements OnInit, OnDestroy {
  deleting = false;
  displayedColumns: string[] = ['name', 'licenseFor', 'mainCompany', 'updated', 'willBeUpdated'];
  dataSource: MatTableDataSource<Server> = new MatTableDataSource<Server>([]);

  private dataSubscription: Subscription;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  private reloadData(): void {
    this.dataSource.data = this.serverService.servers;
  }

  constructor(public serverService: ServerService,
              public accountService: AccountService,
              public dialog: MatDialog,
              public alertService: AlertService,
              private router: Router
  ) {
    if (accountService.user.isAdmin()) {
      this.displayedColumns.push('delete');
    }
  }

  ngOnInit(): void {
    this.dataSubscription = this.serverService.forSubscribe.subscribe(() => this.reloadData());
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteServer(serverName: string): void {
    // console.log('deleteServer', serverName);
    const dialogRef = this.dialog.open(DialogOkCancelComponent, {data: {question: `Are you sure for delete server ${serverName} info?`}});
    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.deleting = true;
        this.serverService.delete(serverName).subscribe({
          next: () => this.alertService.success(`Delete server ${serverName} complete`, {autoClose: true}),
          error: () => this.deleting = false,
          complete: () => {
            this.deleting = false;
            this.serverService.updateFromBackendNow();
          }
        });
      }
    });
  }

  serverInfo(serverName: string): void {
    // console.log('serverInfo', serverName);
    this.router.navigate(['/server-info', serverName]);
  }
}
