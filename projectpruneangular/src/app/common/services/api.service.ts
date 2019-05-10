import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {encodeUriFragment, encodeUriSegment, encodeUriQuery} from '@angular/router/src/url_tree';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiPath = 'http://localhost:8080/FAPServer/service/fapservice';
  private readonly loginPath = '/login';


  constructor(private http: HttpClient) {
  }

  public loginExampleCall(){
    let url = this.apiPath + this.loginPath;

    const req = this.http.post(url, {
      loginName: 'tester',
      password: 'tester'
    }).subscribe((res) => {
      console.log("got response " + JSON.stringify(res));

    }, (err) => {
      console.error('error');
    });
  }
}
