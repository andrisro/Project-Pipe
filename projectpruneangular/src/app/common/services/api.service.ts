import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {encodeUriFragment, encodeUriSegment, encodeUriQuery} from '@angular/router/src/url_tree';
import {UserLoginDTO} from '../dto/UserLoginDTO';
import {UserRegistrationDTO} from '../dto/UserRegistrationDTO';
import {SetStandortStandortDTO} from '../dto/SetStandortStandortDTO';
import {SubjectService} from './subject.service';
import {UserSessionDTO} from '../dto/UserSessionDTO';
import {UserDataDTO} from '../dto/UserDataDTO';
import {SetStandortDTO} from '../dto/SetStandortDTO';
import {UserCookieService} from './usercookie.service';
import {activateRoutes} from '@angular/router/src/operators/activate_routes';
import {UserListDTO} from '../dto/UserListDTO';
import {User} from '../../components/login/login.component';
import {GetStandortDTO} from '../dto/GetStandortDTO';
import {CheckLoginNameDTO} from "../dto/CheckLoginNameDTO";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiPath = 'http://localhost:8080/FAPServer/service/fapservice';
  private readonly loginPath = '/login';
  private readonly registrationPath = '/addUser';
  private readonly setStandortPath = '/setStandort';
  private readonly  getStandortPath = '/getStandort';
  private readonly getUserDataPath = '/getBenutzer';
  private readonly checkLoginNamePath = '/checkLoginName';
  private readonly  logoutPath = '/logout';
  private userSession: UserSessionDTO;

  constructor(private http: HttpClient, public subjectService: SubjectService, private userCookieService: UserCookieService) {
    const activeSession = userCookieService.getSession();

    if (activeSession != null && this.isSessionValid(activeSession) == true && activeSession.sessionID != '' && activeSession.sessionID != '') {
      console.log('found active session ' + JSON.stringify(activeSession));
      this.userSession = activeSession;
    }
  }

  public checkLoginName(loginName: string) {
    const url = this.apiPath + this.checkLoginNamePath + '?id=' + loginName;
    //
    const req = this.http.get<CheckLoginNameResponseDTO>z(url).subscribe((res) => {
       const dto = new CheckLoginNameDTO();
       dto.loginName = loginName;
       dto.ergebnis = res.ergebnis;

       this.subjectService.checkLoginNameSubject.next(dto);
    }, (err) => {
      console.error('error ' + err);
    });
  }

  public setStandort(standort: SetStandortDTO) {
    const url = this.apiPath + this.setStandortPath;

    const req = this.http.put(url, standort).subscribe((res) => {
      console.log('got response ' + JSON.stringify(res));
    }, (err) => {
      console.error('error ' + err);
    });
  }

  public getStandort(userSession: UserSessionDTO, userName: string) {
    console.log('get standort ');
    const url = this.apiPath + this.getStandortPath + '?login=' + userSession.userName + '&session=' + userSession.sessionID + '&id=' + userName;

    const req = this.http.get<GetStandortDTO>(url).subscribe((data) => {
      this.subjectService.userStandortSubject.next(data);
    });
  }

  public register(user: UserRegistrationDTO) {
    const url = this.apiPath + this.registrationPath;

    console.log('request is ' + JSON.stringify(user));
    const req = this.http.post<UserRegistrationDTO>(url, user).subscribe((res) => {
      console.log('got response register ' + JSON.stringify(res));
      this.subjectService.userRegisteredSubject.next(res);
    }, (err) => {
      console.error('error ' + err);
    });
  }

  public login(user: UserLoginDTO) {
    if (this.userSession == null) {
      const activeSession = this.userCookieService.getSession();

      const url = this.apiPath + this.loginPath;

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const req = this.http.post<UserSessionDTO>(url, user).subscribe((data) => {
        console.log('got response ' + JSON.stringify(data));

        if (data.sessionID != null) {
          this.userSession = data;
          this.userSession.userName = user.loginName;

          console.log('push ' + JSON.stringify(this.userSession));

          this.userCookieService.setSession(this.userSession);
          this.subjectService.loginFinishedSubject.next(this.userSession);
        } else {
          this.subjectService.wrongLoginSubject.next();
        }

      }, (err) => {
        console.error('error ' + err);
      });
    }
  }

  public logout() {
    const url = this.apiPath + this.logoutPath;

    const activeSession = this.userCookieService.getSession();

    this.userCookieService.deleteCookies();
    this.userSession = null;

    const req = this.http.post(url, activeSession).subscribe((data) => {
      console.log('got response ' + JSON.stringify(data));
    }, (err) => {
      console.error('error ' + err);
    });
  }

  public isSessionValid(sessionDto: UserSessionDTO): boolean {
    // TODO: validität prüfen
    return true;
  }

  public getActiveSession() {
    if (this.userSession != null) {
      this.subjectService.loginFinishedSubject.next(this.userSession);
    } else {
      console.error('no active user session found');
    }
  }

  public getUserData(session: UserSessionDTO) {
    this.callGetUsers(session).subscribe((data) => {
      data.benutzerliste.forEach( (user) => {
        if (user.loginName == session.userName) {
          this.subjectService.userDataSubject.next(user);
        }
      });
      console.log('got response ' + JSON.stringify(data));
    }, (err) => {
      console.error('error ' + err);
    });
  }

  public getAllUsers(session: UserSessionDTO) {
    this.callGetUsers(session).subscribe((data) => {
        this.subjectService.allUsersSubject.next(data);
    }, (err) => {
      console.error('error ' + err);
    });
  }

  private callGetUsers(session: UserSessionDTO) {
      const url = this.apiPath + this.getUserDataPath + '?login=' + session.userName + '&session=' + session.sessionID;

      const headers = new Headers();
      headers.append('Accept', 'application/json');

      return this.http.get<UserDataDTO>(url);
  }

}
