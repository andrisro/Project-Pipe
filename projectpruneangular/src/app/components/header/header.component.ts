import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubjectService} from '../../common/services/subject.service';
import {Subscription} from 'rxjs';
import {UserSessionDTO} from '../../common/dto/UserSessionDTO';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private loginActionFinished: Subscription;
  private userSession: UserSessionDTO;

  constructor(private subjectService: SubjectService) {
  }

  ngOnInit() {
    this.loginActionFinished = this.subjectService.loginFinishedSubject.subscribe((data) => {
        this.userSession = data;
      }
    );
  }

  ngOnDestroy() {
    this.loginActionFinished.unsubscribe();
  }
}

