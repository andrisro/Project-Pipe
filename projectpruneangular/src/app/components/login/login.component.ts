import { Component } from '@angular/core';
import {ApiService} from '../../common/services/api.service';
import {MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material';
import {passBoolean} from "protractor/built/util";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public user: UserLogin;
  title = 'login';

  constructor(private apiService: ApiService) {
    this.user = new UserLogin();
  }

  testCall() {
    console.log('login');
    this.apiService.login('tester', 'tester');
  }

  login() {
    console.log('Log: ');
    console.log(JSON.stringify(this.user));
    this.apiService.login(this.user.username, this.user.password);
  }
}

export class UserLogin {
  public username: string;
  public password: string;

  constructor() {
    this.username = '';
    this.password = '';
  }
}
