export class ErrorLine {
  rejectedField: string;
  errorMessage: string;
  rejectedValue: string;
}

export class MyError {
  status: number;
  error: string;
  timestamp?: any;
  errors?: ErrorLine[];
}
