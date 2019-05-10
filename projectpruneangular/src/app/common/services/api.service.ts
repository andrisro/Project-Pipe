import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {encodeUriFragment, encodeUriSegment, encodeUriQuery} from '@angular/router/src/url_tree';
import {UserLoginDTO} from "../dto/UserLoginDTO";
import {UserRegistrationDTO} from "../dto/UserRegistrationDTO";
import {SetStandortStandortDTO} from "../dto/SetStandortStandortDTO";
import {SubjectService} from "./subject.service";
import {UserSessionDTO} from "../dto/UserSessionDTO";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiPath = 'http://localhost:8080/FAPServer/service/fapservice';
  private readonly loginPath = '/login';
  private readonly registrationPath = '/addUser';
  private readonly setStandortPath = '/setStandort';

  constructor(private http: HttpClient, private subjectService:SubjectService) {
  }

  

  public setStandort(standort: SetStandortStandortDTO) {
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
    let url = this.apiPath + this.loginPath;

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept','application/json');

    const req = this.http.post<UserSessionDTO>(url, user).subscribe((data) => {
      console.log("got response " + JSON.stringify(data));

      if(data.sessionID != null) {
        data.userName = user.loginName;
        this.subjectService.loginFinishedSubject.next(data);
      }

    }, (err) => {
      console.error('error '+err);
    });
  }
}
