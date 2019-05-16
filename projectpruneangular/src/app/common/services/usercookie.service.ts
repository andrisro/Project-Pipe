import {Injectable} from '@angular/core';
import {UserSessionDTO} from '../dto/UserSessionDTO';
import {toBase64String} from '@angular/compiler/src/output/source_map';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class UserCookieService {
  private readonly SESSION_COOKIE_NAME = 'SESSIONID';
  private readonly USERNAME_COOKIE_NAME = 'UID';

  constructor(private cookieService: CookieService) {

  }

  getSession(): UserSessionDTO {
    const sessionCookie = this.cookieService.get(this.SESSION_COOKIE_NAME);
    const userCookie = this.cookieService.get(this.USERNAME_COOKIE_NAME);

    let sessionData = null;

    if (sessionCookie != null && userCookie != null) {
      console.log(sessionCookie + ' - ' + userCookie);

      sessionData = new UserSessionDTO();
      sessionData.userName = atob(userCookie);
      sessionData.sessionID = atob(sessionCookie);
    }

    return sessionData;
  }

  setSession(sessionData: UserSessionDTO) {
    this.cookieService.set(this.SESSION_COOKIE_NAME, btoa(sessionData.sessionID));
    this.cookieService.set(this.USERNAME_COOKIE_NAME, btoa(sessionData.userName));
  }
}
