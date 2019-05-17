import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {encodeUriFragment, encodeUriSegment, encodeUriQuery} from '@angular/router/src/url_tree';
import {UserLoginDTO} from "../dto/UserLoginDTO";
import {UserRegistrationDTO} from "../dto/UserRegistrationDTO";
import {SetStandortStandortDTO} from "../dto/SetStandortStandortDTO";
import {SubjectService} from "./subject.service";
import {UserSessionDTO} from "../dto/UserSessionDTO";
import {UserDataDTO} from "../dto/UserDataDTO";
import {SetStandortDTO} from "../dto/SetStandortDTO";
import {UserCookieService} from "./usercookie.service";
import {activateRoutes} from "@angular/router/src/operators/activate_routes";
import {UserListDTO} from "../dto/UserListDTO";
import {User} from "../../components/login/login.component";

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
  private userSession: UserSessionDTO;

  constructor(private http: HttpClient, public subjectService:SubjectService, private userCookieService: UserCookieService) {
    let activeSession = userCookieService.getSession();

    if(activeSession != null && this.isSessionValid(activeSession)==true) {
      console.log('found active session '+activeSession);
      this.userSession = activeSession;
    }
  }

  public checkLoginName(loginName:string) {
    // let url = this.apiPath + this.checkLoginNamePath + '?id='+loginName;
    //
    // const req = this.http.get(url).subscribe((res) => {
    //   console.log("got response "+JSON.stringify(res));
    // }, (err) => {
    //   console.error('error '+err);
    // })
  }

  public setStandort(standort: SetStandortDTO) {
    let url = this.apiPath + this.setStandortPath;

    const req = this.http.put(url,standort).subscribe((res) => {
      console.log("got response "+JSON.stringify(res));
    }, (err) => {
      console.error('error '+err);
    });
  }

  public getStandort(userSession: UserSessionDTO, userName: string) {
    let url = this.apiPath + this.getStandortPath + '?login='+userSession.userName+'&session='+userSession.sessionID+'&id='+userName;

    const req = this.http.get(url).subscribe((data) => {
      console.log(JSON.stringify(data));
    });
  }

  public register(user:UserRegistrationDTO) {
    let url = this.apiPath + this.loginPath;

    const req = this.http.post(url, user).subscribe((res) => {
      console.log("got response "+JSON.stringify(res));
    }, (err) => {
      console.error('error '+err);
    })
  }

  public login(user:UserLoginDTO){
    if(this.userSession == null) {
      let activeSession = this.userCookieService.getSession();

      let url = this.apiPath + this.loginPath;

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const req = this.http.post<UserSessionDTO>(url, user).subscribe((data) => {
        console.log("got response " + JSON.stringify(data));

        if (data.sessionID != null) {
          this.userSession = data;
          this.userSession.userName = user.loginName;

          console.log("push " + JSON.stringify(this.userSession));

          this.userCookieService.setSession(this.userSession);
          this.subjectService.loginFinishedSubject.next(this.userSession);
        }

      }, (err) => {
        console.error('error ' + err);
      });
    }
  }

  public isSessionValid(sessionDto: UserSessionDTO): boolean {
    //TODO: validität prüfen
    return false;
  }

  public getActiveSession() {
    if(this.userSession != null) {
      this.subjectService.loginFinishedSubject.next(this.userSession);
    } else {
      console.error("no active user session found");
    }
  }

  public getUserData(session:UserSessionDTO) {
    this.callGetUsers(session).subscribe((data) => {
      data.benutzerliste.forEach( (user) => {
        if (user.loginName == session.userName) {
          console.log("subject service defined ? ");
          this.subjectService.userDataSubject.next(user);
        }
      });
      console.log("got response " + JSON.stringify(data));
    }, (err) => {
      console.error('error ' + err);
    });
  }

  public getAllUsers(session: UserSessionDTO) {
    this.callGetUsers(session).subscribe((data) => {
        this.subjectService.allUsersSubject.next(data);
    }, (err) => {
      console.error('error '+err);
    });
  }

  private callGetUsers(session: UserSessionDTO) {
      let url = this.apiPath + this.getUserDataPath + '?login='+session.userName+'&session='+session.sessionID;

      let headers = new Headers();
      headers.append('Accept', 'application/json');

      return this.http.get<UserDataDTO>(url);
  }

}
