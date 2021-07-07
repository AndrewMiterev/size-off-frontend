import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {AboutComponent} from './components/about/about.component';
import {LoginComponent} from './components/login/login.component';
import {LogoffComponent} from './components/logoff/logoff.component';
import {RegisterComponent} from './components/register/register.component';
import {UsersComponent} from './components/users/users.component';
import {ChangeUserComponent} from './components/change-user/change-user.component';
import {WhoAmIComponent} from './components/who-am-i/who-am-i.component';
import {JobsComponent} from './components/jobs/jobs.component';
import {ServersComponent} from './components/servers/servers.component';
import {ServerInfoComponent} from './components/server-info/server-info.component';
import {AdminGuard} from './helpers/admin.guard';
import {AdminAndUserGuard} from './helpers/admin-and-user.guard';
import {AdminUserAndObservableGuard} from './helpers/admin-user-and-observable.guard';
import {CallbackSocialComponent} from './components/callback-social/callback-social.component';
import {CallbackSocialDeletionComponent} from './components/callback-social-deletion/callback-social-deletion.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'callback', component: CallbackSocialComponent},
  {path: 'callback-deletion', component: CallbackSocialDeletionComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'who-am-i', component: WhoAmIComponent},
  {path: 'users', component: UsersComponent, canActivate: [AdminGuard]},
  {path: 'jobs', component: JobsComponent, canActivate: [AdminAndUserGuard]},
  {path: 'servers', component: ServersComponent, canActivate: [AdminUserAndObservableGuard]},
  {path: 'server-info/:servername', component: ServerInfoComponent, canActivate: [AdminUserAndObservableGuard]},
  {path: 'change-user/:username', component: ChangeUserComponent, canActivate: [AdminGuard]},
  {path: 'logoff', component: LogoffComponent},
  {path: 'about', component: AboutComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  // imports: [RouterModule.forRoot(routes, {useHash: true})],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

