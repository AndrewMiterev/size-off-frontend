export class User {
  email: string;
  name?: string;
  registrationDate?: any;
  lastLogin?: any;
  roles?: string[];

  constructor(u?: User) {
    this.email = u?.email;
    this.name = u?.name;
    this.lastLogin = u?.lastLogin;
    this.registrationDate = u?.registrationDate;
    this.roles = u?.roles;
  }

  isAdmin?(): boolean {
    return this.roles?.includes('ROLE_ADMIN');
  }

  isUser?(): boolean {
    return this.roles?.includes('ROLE_USER');
  }

  isObserver?(): boolean {
    return this.roles?.includes('ROLE_OBSERVER');
  }

  isFBC?(): boolean {
    return this.isAdmin() || this.isUser();
  }

  observeTo?(): string[] {
    return this.roles?.filter(item => item.startsWith('SERVER_')).map(item => item.substr(7));
  }
}
