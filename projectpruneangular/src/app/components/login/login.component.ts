import { Component } from '@angular/core';
import {ApiService} from '../../common/services/api.service';
import {MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material';
import {UserLoginDTO} from "../../common/dto/UserLoginDTO";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public user: UserLoginDTO;
  title = 'login';

  constructor(private apiService: ApiService) {
    this.user = new UserLoginDTO();
  }

  testCall() {
    console.log('login');
    // this.apiService.login('tester', 'tester');
  }

  login() {
    console.log('Log: ');
    console.log(JSON.stringify(this.user));
    this.apiService.login(this.user);
  }
}


