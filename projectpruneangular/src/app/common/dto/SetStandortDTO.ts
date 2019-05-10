import {SetStandortStandortDTO} from './SetStandortStandortDTO';

export class SetStandortDTO {
  public loginName: string;
  public sitzung: string;
  public standort: SetStandortStandortDTO;

  constructor() {
    this.loginName = '';
    this.sitzung = '';
    this.standort = null;
  }
}
