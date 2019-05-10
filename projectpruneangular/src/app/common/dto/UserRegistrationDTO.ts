import {UserRegistrationPasswordDTO} from './UserRegistrationPasswordDTO';
import {UserRegistrationEmailDTO} from './UserRegistrationEmailDTO';

export class UserRegistrationDTO {
  public loginName: string;
  public passwort: UserRegistrationPasswordDTO;
  public vorname: string;
  public nachname: string;
  public strasse: string;
  public plz: string;
  public ort: string;
  public land: string;
  public telefon: string;
  public email: UserRegistrationEmailDTO; 

  constructor() {

  }
}
