import { Component } from '@angular/core';
import {ApiService} from '../../common/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  title = 'login';

  constructor(private apiService: ApiService) {

  }

  testCall() {
    console.log('login');
    this.apiService.loginExampleCall();
  }
}
