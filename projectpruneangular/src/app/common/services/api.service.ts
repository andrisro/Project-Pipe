import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, Subscription} from 'rxjs';
import {encodeUriFragment, encodeUriSegment, encodeUriQuery} from '@angular/router/src/url_tree';
import {UserLoginDTO} from "../dto/UserLoginDTO";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiPath = 'http://localhost:8080/FAPServer/service/fapservice';
  private readonly loginPath = '/login';


  constructor(private http: HttpClient) {
  }

  

  public login(user:UserLoginDTO){
    let url = this.apiPath + this.loginPath;

    const req = this.http.post(url, user).subscribe((res) => {
      console.log("got response " + JSON.stringify(res));

    }, (err) => {
      console.error('error');
    });
  }
}
