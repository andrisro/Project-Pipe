import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ApiService} from '../../common/services/api.service';
import {SubjectService} from '../../common/services/subject.service';
import {Subscription} from 'rxjs';
import {UserSessionDTO} from '../../common/dto/UserSessionDTO';


@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit, OnDestroy, OnChanges {
  public userSession: UserSessionDTO;
  title = 'login';
  private loginActionFinished: Subscription;

  constructor(private apiService: ApiService, private subjectService: SubjectService) {
  }

  ngOnInit() {
    this.apiService.logout();
    this.subjectService.userLoggedOut.next();
  }

  ngOnDestroy() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes ' + JSON.stringify(changes));
  }
}
