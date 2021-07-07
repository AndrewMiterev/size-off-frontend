import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {User} from '../../model/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['email', 'name', 'registrationDate', 'roles'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);

  private dataSubscription: Subscription;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  private setDataSourceToServiceData(): void {
    this.dataSource.data = this.service.users;
  }

  constructor(public service: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.dataSubscription = this.service.forSubscribe.subscribe(() => this.setDataSourceToServiceData());
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  changeUser(email: string): void {
    this.router.navigate(['/change-user', email]);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
