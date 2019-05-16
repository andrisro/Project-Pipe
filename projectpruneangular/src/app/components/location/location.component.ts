import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SubjectService} from '../../common/services/subject.service';
import {Subscription} from 'rxjs';
import {UserSessionDTO} from '../../common/dto/UserSessionDTO';
import {ApiService} from '../../common/services/api.service';
import {SetStandortStandortDTO} from '../../common/dto/SetStandortStandortDTO';
import {SetStandortDTO} from '../../common/dto/SetStandortDTO';
import {} from 'googlemaps';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit, OnDestroy {
  private loginActionFinished: Subscription;
  private userSession: UserSessionDTO;
  private geolocationPosition: Position;

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;


  constructor(private subjectService: SubjectService, private apiService: ApiService) {
  }

  ngOnInit() {
    this.loginActionFinished = this.subjectService.loginFinishedSubject.subscribe((data) => {
        this.userSession = data;
      }
    );

    var myLatLng = {lat: -25.363, lng: 131.044};

    var mapProp = {
      center: myLatLng,
      zoom: 4,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };


    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);


    this.apiService.getActiveSession();

    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          this.geolocationPosition = position;
            console.log(position);

          this.setPosition(position);

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
    }
    ;
  }

  setMapType(mapTypeId: string) {
    console.log('set map type ' + mapTypeId);
    this.map.setMapTypeId(mapTypeId);
  }

  setPosition(data: Position) {
    console.log("set position");
    console.log(JSON.stringify(data));

    var pos = {
      lat: data.coords.latitude,
      lng: data.coords.longitude
    };

    console.log("add marker");
    var marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      title: 'Mein Standort'
    });

    var infoWindow = new google.maps.InfoWindow;

    infoWindow.setPosition(pos);
    infoWindow.setContent('Location found.');
    infoWindow.open(this.map);
    this.map.setCenter(pos);

  }

  ngOnDestroy() {
    this.loginActionFinished.unsubscribe();
  }
}



