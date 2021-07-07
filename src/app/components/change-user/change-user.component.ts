import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {User} from '../../model/user';
import {UserService} from '../../services/user.service';
import {ServerService} from '../../services/server.service';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {DialogOkCancelComponent} from '../dialog-ok-cancel/dialog-ok-cancel.component';
import {AlertService} from '../../services/alert.service';
import {AccountService} from '../../services/account.service';

@Component({
  selector: 'app-change-user',
  templateUrl: './change-user.component.html',
  styleUrls: ['./change-user.component.scss']
})
export class ChangeUserComponent implements OnInit {
  // user info
  user: User;
  isAdmin: boolean;
  isUser: boolean;
  userServersList: string[];

  // form
  formControl = new FormControl();

  // loading flags
  loading = false;
  loadingEmail: string;
  saving = false;
  deleting = false;

  // servers info
  allServers: string[] = [];
  filteredServers: Observable<string[]>;

  @ViewChild('serverInput') serverInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  private loadUserInfoForEdit(): void {
    this.isAdmin = this.user.isAdmin();
    this.isUser = this.user.isUser();
    this.userServersList = this.user.observeTo() || [];
  }

  userLoad(email: string): void {
    this.loading = true;
    this.loadingEmail = email;
    this.userService.getUser(email).subscribe(u => {
      // console.log('user loaded from userService', u);
      this.user = new User(u);
      this.loadUserInfoForEdit();
      this.loading = false;
    });
  }

  constructor(
    private route: ActivatedRoute,
    public userService: UserService,
    private accountService: AccountService,
    public serverService: ServerService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private router: Router
  ) {
    route.params.subscribe(p => this.userLoad(p.username));
    this.loading = true;
    this.serverService.forSubscribe.subscribe( () => {
        this.allServers = serverService.servers.map(s => s.name);
        this.filteredServers = this.formControl.valueChanges.pipe(
          startWith(null),
          map((server: string | null) => server ? this.filterServers(server) : this.allServers.slice())
        );
        this.loading = false;
      });
  }

  ngOnInit(): void {
  }

  private filterServers(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allServers.filter(s => s.toLowerCase().includes(filterValue));
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const newServer = event.option.viewValue;
    if (this.userServersList.indexOf(newServer) === -1) {
      this.userServersList.push(newServer);
    }
    this.serverInput.nativeElement.value = '';
    this.formControl.setValue(null);
  }

  removeServerFromList(server: string): void {
    this.userServersList = this.userServersList.filter(s => s !== server);
  }

  selfCheck(): boolean {
    const self = this.user.email === this.accountService.user.email;
    if (self) {
      this.alertService.warn('You can\'t change your own credentials. ' +
        'Please ask <strong>another</strong> Administrator', {autoClose: true});
    }
    return self;
  }

  onSubmit(): void {
    if (this.selfCheck()) {
      return;
    }
    const updatedRoles: string[] = [];
    if (this.isAdmin) {
      updatedRoles.push('ROLE_ADMIN');
    }
    if (this.isUser) {
      updatedRoles.push('ROLE_USER');
    }
    if (!(this.isAdmin || this.isUser)) {
      if (this.userServersList?.length > 0) {
        updatedRoles.push('ROLE_OBSERVER');
        this.userServersList?.map(s => updatedRoles.push('SERVER_' + s));
      }
    }
    const updatedUser: User = new User({...this.user, roles: updatedRoles});
    // console.log(updatedUser);
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(updatedUser, null, 4));
    this.saving = true;
    this.userService.updateUser(updatedUser).subscribe({
      next: () => this.alertService.success(`User ${this.user.email} updated`, {autoClose: true}),
      error: () => this.saving = false,
      complete: () => this.saving = false
    });
  }

  onReset(): void {
    this.loadUserInfoForEdit();
  }

  onDelete(): void {
    if (this.selfCheck()) {
      return;
    }
    const dialogRef = this.dialog.open(DialogOkCancelComponent, {data: {question: `Are you sure for delete user ${this.user.email} ?`}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleting = true;
        this.userService.deleteUser(this.user.email).subscribe({
          next: () => {
            this.alertService.success(`Delete user ${this.user.email} successful`, {keepAfterRouteChange: true, autoClose: true});
            this.router.navigate(['../users']);
          },
          error: () => this.deleting = false,
          complete: () => this.deleting = false
        });
      }
    });
  }
}
