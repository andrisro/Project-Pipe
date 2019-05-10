import { Component } from '@angular/core';
import {ApiService} from '../../common/services/api.service';
import {MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material';
import {UserLoginDTO} from "../../common/dto/UserLoginDTO";
import {UserPasswordDTO} from "../../common/dto/UserPasswordDTO";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public user: User;
  title = 'login';

  constructor(private apiService: ApiService) {
    this.user = new User();
  }

  testCall() {
    console.log('login');
    // this.apiService.login('tester', 'tester');
  }

  login() {
    const userLoginDto = new UserLoginDTO();
    userLoginDto.loginName = this.user.loginName;
    userLoginDto.passwort = new UserPasswordDTO();
    userLoginDto.passwort.passwort = this.user.password;

    console.log('Log: ');
    console.log(JSON.stringify(userLoginDto));
    this.apiService.login(userLoginDto);
  }
}

export class User {
  loginName = '';
  password = '';
}


