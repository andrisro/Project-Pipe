import {Component, OnDestroy, OnInit} from '@angular/core';
import {SubjectService} from '../../common/services/subject.service';
import {Subscription} from 'rxjs';
import {UserSessionDTO} from '../../common/dto/UserSessionDTO';
import {ApiService} from '../../common/services/api.service';
import {SetStandortStandortDTO} from "../../common/dto/SetStandortStandortDTO";
import {SetStandortDTO} from "../../common/dto/SetStandortDTO";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit, OnDestroy {
  private loginActionFinished: Subscription;
  private userSession: UserSessionDTO;
  private geolocationPosition: Position;

  constructor(private subjectService: SubjectService, private apiService: ApiService) {
  }

  ngOnInit() {
    this.loginActionFinished = this.subjectService.loginFinishedSubject.subscribe((data) => {
        this.userSession = data;
      }
    );

    this.apiService.getActiveSession();

    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          this.geolocationPosition = position,
            console.log(position);

          var setStandortDto = new SetStandortDTO();
          setStandortDto.sitzung = this.userSession.sessionID;
          setStandortDto.loginName = this.userSession.userName;
          setStandortDto.standort = new SetStandortStandortDTO();
          setStandortDto.standort.breitengrad = this.geolocationPosition.coords.latitude;
          setStandortDto.standort.laengengrad = this.geolocationPosition.coords.longitude;

          this.apiService.setStandort(setStandortDto);
        },
        error => {
          switch (error.code) {
            case 1:
              console.log('Permission Denied');
              break;
            case 2:
              console.log('Position Unavailable');
              break;
            case 3:
              console.log('Timeout');
              break;
          }
        }
      );
    };
  }

  setPosition(data) {
    console.log(JSON.stringify(data));
  }

  ngOnDestroy() {
    this.loginActionFinished.unsubscribe();
  }


}



