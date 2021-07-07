import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {JobService} from '../../services/job.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {Job} from '../../model/job';
import {DialogOkCancelComponent} from '../dialog-ok-cancel/dialog-ok-cancel.component';
import {MatDialog} from '@angular/material/dialog';
import {AlertService} from '../../services/alert.service';
import {AccountService} from '../../services/account.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit, OnDestroy {
  deleting = false;
  adding = false;
  displayedColumns: string[] = ['name', 'stamp', 'error', 'errorDate', 'delete'];
  dataSource: MatTableDataSource<Job> = new MatTableDataSource<Job>([]);
  private dataSubscription: Subscription;

  @ViewChild(MatSort) sort: MatSort;

  // @ViewChild('input') input: ElementRef;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  private reloadData(): void {
    // console.log('data reload');
    this.dataSource.data = this.jobService.jobs;
  }

  constructor(
    public jobService: JobService,
    public dialog: MatDialog,
    private alertService: AlertService,
    public accountService: AccountService,
  ) {
  }

  ngOnInit(): void {
    // console.log('ngOnInit');
    this.dataSubscription = this.jobService.forSubscribe.subscribe(() => this.reloadData());
  }

  ngOnDestroy(): void {
    // console.log('ngOnDestroy');
    this.dataSubscription.unsubscribe();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    // console.log(filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // console.log(this.dataSource);
  }

  deleteJob(row: Job): void {
    const dialogRef = this.dialog.open(DialogOkCancelComponent, {data: {question: `Are you sure for delete job for server ${row.name} ?`}});
    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        this.deleting = true;
        this.jobService.delete(row.name).subscribe({
          next: () => this.alertService.success(`Delete job for server ${row.name} complete`, {autoClose: true}),
          error: () => this.deleting = false,
          complete: () => {
            this.jobService.updateFromBackendNow();
            this.deleting = false;
          }
        });
      }
    });
  }

  addJob(server: string): void {
    this.adding = true;
    this.jobService.add(server).subscribe({
      next: () => this.alertService.success(`Added job for server ${server}`, {autoClose: true}),
      error: () => this.adding = false,
      complete: () => {
        this.jobService.updateFromBackendNow();
        this.adding = false;
      }
    });
  }
}
