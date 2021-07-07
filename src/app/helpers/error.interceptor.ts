import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AlertService} from '../services/alert.service';
import {MyError} from '../model/my-error';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private alertService: AlertService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(
        catchError(err => {
          console.log('Error interceptor', err);
          const myError: MyError = err.error;
          this.alertService.error(myError.error, {autoClose: true});
          myError.errors?.map(e => this.alertService.error(`${e.rejectedField} ${e.errorMessage}`, {autoClose: true}));
          // return EMPTY;
          return throwError(err);
        })
      );
  }
}
