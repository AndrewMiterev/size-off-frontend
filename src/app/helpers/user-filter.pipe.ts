import {Pipe, PipeTransform} from '@angular/core';
import {User} from '../model/user';

@Pipe({
  name: 'userFilter'
})
export class UserFilterPipe implements PipeTransform {
  private findInArray(array: string[], search: string): boolean {
    return array?.filter(s => s.toUpperCase().includes(search)).length > 0;
  }

  transform(users: User[], search: string = ''): User[] {
    const ss = search.trim().toUpperCase();
    if (!ss) {
      return users;
    }
    return users.filter(user =>
      user.email.toUpperCase().includes(ss)
      || this.findInArray(user.roles, ss)
      || user.name.toUpperCase().includes(ss)
    );
  }
}
