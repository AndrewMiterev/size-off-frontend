import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PushPopService {
  constructor() {
  }

  push(name: string, data: string): void {
    sessionStorage.setItem(name, data);
  }

  pop(name: string): string {
    const result = sessionStorage.getItem(name);
    sessionStorage.removeItem(name);
    return result;
  }
}
