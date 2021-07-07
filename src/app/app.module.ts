import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {AboutComponent} from './components/about/about.component';
import {LoginComponent} from './components/login/login.component';
import {LogoffComponent} from './components/logoff/logoff.component';
import {MenuComponent} from './components/menu/menu.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AlertComponent} from './components/alert/alert.component';
import {RegisterComponent} from './components/register/register.component';
import {UsersComponent} from './components/users/users.component';
import {TokenInterceptor} from './helpers/token.interceptor';
import {ErrorInterceptor} from './helpers/error.interceptor';
import {UserFilterPipe} from './helpers/user-filter.pipe';
import {ChangeUserComponent} from './components/change-user/change-user.component';
import {WhoAmIComponent} from './components/who-am-i/who-am-i.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDialogModule} from '@angular/material/dialog';
import {DialogOkCancelComponent} from './components/dialog-ok-cancel/dialog-ok-cancel.component';
import {MatSortModule} from '@angular/material/sort';
import {JobsComponent} from './components/jobs/jobs.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {LoadingComponent} from './components/loading/loading.component';
import {ServersComponent} from './components/servers/servers.component';
import {ServerInfoComponent} from './components/server-info/server-info.component';
import {Number2sizePipe} from './helpers/number2size.pipe';
import {DatabasesListComponent} from './components/databases-list/databases-list.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {BlockInfoComponent} from './components/block-info/block-info.component';
import {SocialLoginComponent} from './components/social-login/social-login.component';
import {CallbackSocialComponent} from './components/callback-social/callback-social.component';
import {HebrewPipe} from './helpers/hebrew.pipe';
import {CallbackSocialDeletionComponent} from './components/callback-social-deletion/callback-social-deletion.component';
import {MatBadgeModule} from '@angular/material/badge';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    AboutComponent,
    LoginComponent,
    LogoffComponent,
    MenuComponent,
    AlertComponent,
    RegisterComponent,
    UsersComponent,
    UserFilterPipe,
    ChangeUserComponent,
    WhoAmIComponent,
    DialogOkCancelComponent,
    JobsComponent,
    LoadingComponent,
    ServersComponent,
    ServerInfoComponent,
    Number2sizePipe,
    DatabasesListComponent,
    BlockInfoComponent,
    SocialLoginComponent,
    CallbackSocialComponent,
    HebrewPipe,
    CallbackSocialDeletionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSortModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatExpansionModule,
    MatBadgeModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
