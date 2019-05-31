import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubjectService} from '../../common/services/subject.service';
import {Subscription} from 'rxjs';
import {UserSessionDTO} from '../../common/dto/UserSessionDTO';
import {UserCookieService} from '../../common/services/usercookie.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private loginActionFinished: Subscription;
  private logoutActionFinished: Subscription;
  private userSession: UserSessionDTO;


  constructor(private subjectService: SubjectService, private cookieService: UserCookieService) {
  }

  ngOnInit() {
    this.userSession = this.cookieService.getSession();

    this.loginActionFinished = this.subjectService.loginFinishedSubject.subscribe((data) => {
        this.userSession = data;
      }
    );

    this.logoutActionFinished = this.subjectService.userLoggedOut.subscribe((data) => {
      this.userSession = this.cookieService.getSession();
    });
  }

  isUserLoggedIn(): boolean {
    if (this.userSession != null) {
      return true;
    }

    return false;
  }

  ngOnDestroy() {
    this.loginActionFinished.unsubscribe();
  }
}

