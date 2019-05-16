import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ApiService} from '../../common/services/api.service';
import {MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material';
import {UserLoginDTO} from '../../common/dto/UserLoginDTO';
import {UserPasswordDTO} from '../../common/dto/UserPasswordDTO';
import {SubjectService} from '../../common/services/subject.service';
import {Subscription} from 'rxjs';
import {UserSessionDTO} from '../../common/dto/UserSessionDTO';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy, OnChanges {
  public user: User;
  public userSession: UserSessionDTO;
  title = 'login';
  private loginActionFinished: Subscription;

  constructor(private apiService: ApiService, private subjectService: SubjectService) {
    this.user = new User();
  }

  ngOnInit() {
    this.loginActionFinished = this.subjectService.loginFinishedSubject.subscribe((data) => {
        console.log('finished!!!' + JSON.stringify(data));
        this.userSession = data;

        this.apiService.getUserData(this.userSession);
      }
    );
  }

  ngOnDestroy() {
    this.loginActionFinished.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes '+ JSON.stringify(changes));
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

  isUsernameValid(): boolean {
    this.apiService.checkLoginName(this.user.loginName);

    return false;
  }
}

export class User {
  loginName = '';
  password = '';
}


