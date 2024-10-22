import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../common/services/api.service';
import {SubjectService} from '../../common/services/subject.service';
import {Subscription} from 'rxjs';
import {UserSessionDTO} from '../../common/dto/UserSessionDTO';
import {UserDataDTO} from '../../common/dto/UserDataDTO';
import {UserListDTO} from "../../common/dto/UserListDTO";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public userSession: UserSessionDTO;
  title = 'login';
  private loginActionFinished: Subscription;
  private userDataActionFinished: Subscription;
  public userData: UserListDTO;
  private profileUrl = '';

  constructor(private apiService: ApiService, private subjectService: SubjectService) {
  }

  ngOnInit() {

    this.loginActionFinished = this.subjectService.loginFinishedSubject.subscribe((data) => {
        console.log('finished!!!' + JSON.stringify(data));
        this.userSession = data;

        this.apiService.getUserData(this.userSession);
      }
    );

    this.userDataActionFinished = this.subjectService.userDataSubject.subscribe((data) => {
        console.log('got user data: ' + JSON.stringify(data));

        this.userData = data;
    });

    this.apiService.getActiveSession();
  }

  ngOnDestroy() {
    this.loginActionFinished.unsubscribe();
    this.userDataActionFinished.unsubscribe();
  }

  getProfileUrl() {
    if (this.profileUrl.length <= 1) {
      this.profileUrl = 'https://randomuser.me/api/portraits/men/' + this.getRandomInt(20) + '.jpg';
    }

    return this.profileUrl;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
