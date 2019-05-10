import {UserPasswordDTO} from './UserPasswordDTO';

export class UserLoginDTO {
  public loginName: string;
  public passwort: UserPasswordDTO;

  constructor() {
    this.loginName = '';
    this.passwort = null;
  }
}
