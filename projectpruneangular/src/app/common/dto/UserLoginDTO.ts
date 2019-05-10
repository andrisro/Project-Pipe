export class UserLoginDTO {
  public loginName: string;
  public password: string;

  constructor() {
    this.loginName = '';
    this.password = '';
  }
}
