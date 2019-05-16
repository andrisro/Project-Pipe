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

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiPath = 'http://localhost:8080/FAPServer/service/fapservice';
  private readonly loginPath = '/login';
  private readonly registrationPath = '/addUser';
  private readonly setStandortPath = '/setStandort';
  private readonly getUserDataPath = '/getBenutzer';
  private readonly checkLoginNamePath = '/checkLoginName';
  private userSession: UserSessionDTO;

  constructor(private http: HttpClient, private subjectService:SubjectService) {
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
      let url = this.apiPath + this.loginPath;

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      const req = this.http.post<UserSessionDTO>(url, user).subscribe((data) => {
        console.log("got response " + JSON.stringify(data));

        if (data.sessionID != null) {
          this.userSession = data;
          this.userSession.userName = user.loginName;

          console.log("push "+JSON.stringify(this.userSession));
          this.subjectService.loginFinishedSubject.next(this.userSession);
        }

      }, (err) => {
        console.error('error ' + err);
      });
    }
    else {
      this.subjectService.loginFinishedSubject.next(this.userSession);
    }
  }

  public getActiveSession() {
    if(this.userSession != null) {
      this.subjectService.loginFinishedSubject.next(this.userSession);
    }
  }

  public getUserData(session:UserSessionDTO) {
    let url = this.apiPath + this.getUserDataPath + '?login='+session.userName+'&session='+session.sessionID;

    let headers = new Headers();
    headers.append('Accept', 'application/json');

    const req = this.http.get<UserDataDTO>(url).subscribe((data) => {
      console.log("got response " + JSON.stringify(data));

      this.subjectService.userDataSubject.next(data);

    }, (err) => {
      console.error('error ' + err);
    });
  }
}
