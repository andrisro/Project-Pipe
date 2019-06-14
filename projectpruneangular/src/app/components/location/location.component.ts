import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SubjectService} from '../../common/services/subject.service';
import {Subscription} from 'rxjs';
import {UserSessionDTO} from '../../common/dto/UserSessionDTO';
import {ApiService} from '../../common/services/api.service';
import {SetStandortStandortDTO} from '../../common/dto/SetStandortStandortDTO';
import {SetStandortDTO} from '../../common/dto/SetStandortDTO';
import {} from 'googlemaps';
import {UserCookieService} from '../../common/services/usercookie.service';
import {forEach} from '@angular/router/src/utils/collection';
import {UserListDTO} from '../../common/dto/UserListDTO';
import {MatExpansionModule, MatTableDataSource} from '@angular/material';
import {UserDataDTO} from '../../common/dto/UserDataDTO';
import {FlexLayoutModule} from '@angular/flex-layout';
import {Marker} from "@agm/core/services/google-maps-types";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit, OnDestroy {
  private loginActionFinished: Subscription;
  private getUserActionFinished: Subscription;
  private getUserStandortActionFinished: Subscription;

  private userSession: UserSessionDTO;
  private locationFormData: LocationFormData;
  private geolocationPosition: Position;
  public dataSource = new MatTableDataSource<UserListDTO>();
  private friendsEnabledList = new UserDataDTO();
  private markers: Array<google.maps.Marker> = [];
  // users: UserDataDTO = null;

  successMessageSetLocation = false;

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  @ViewChild('gmapfriends') gmapElementFriends: any;
  mapFriends: google.maps.Map;
  displayedColumns = ['name', 'checkbox'];
  private checkboxesInited:boolean = false;


  constructor(private subjectService: SubjectService, private apiService: ApiService, private userCookieService: UserCookieService) {
    this.locationFormData = new LocationFormData();
  }

  private getStandortOfUser(userData: UserListDTO) {
    this.apiService.getStandort(this.userSession, userData.loginName);
  }

  ngOnInit() {
    this.initSubscriptions();
    this.apiService.getActiveSession();
    this.setCurrentLocationByBrowserLocation();

    this.initMap();
  }

  private setCurrentLocationByBrowserLocation() {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          this.geolocationPosition = position;
          console.log(position);

          this.setMapPositionMarker(position);

          const setStandortDto = new SetStandortDTO();
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
  }

  private initMap() {
    const myLatLng = {lat: -25.363, lng: 131.044};

    const mapProp = {
      center: myLatLng,
      zoom: 4,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };


    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
  }

  private initSubscriptions() {
    this.loginActionFinished = this.subjectService.loginFinishedSubject.subscribe((data) => {
        this.userSession = data;
        this.apiService.getAllUsers(this.userSession);
      }
    );

    this.getUserActionFinished = this.subjectService.allUsersSubject.subscribe((data) => {
      data.benutzerliste.forEach((user) => {
        this.dataSource.data = data.benutzerliste;
        this.friendsEnabledList = data;
        this.reloadMap()
      });
    });

    this.getUserStandortActionFinished = this.subjectService.userStandortSubject.subscribe((data) => {
      // setPositionWithoutInfo
      const pos = {
        lat: data.breitengrad,
        lng: data.laengengrad
      };

      this.setPositionWithoutInfo(pos);
      console.log('got standort ' + data);
    });
  }

  setMapPositionMarker(data: Position) {
    console.log('set position');
    console.log(JSON.stringify(data));

    const pos = {
      lat: data.coords.latitude,
      lng: data.coords.longitude
    };

    console.log('add marker');
    console.warn('disabled browser standort marker ');
    // this.setPositionWithoutInfo(pos);

    // const infoWindow = new google.maps.InfoWindow;
    //
    // infoWindow.setPosition(pos);
    // infoWindow.setContent('Location found.');
    // infoWindow.open(this.map);
    this.map.setCenter(pos);

  }

  setPositionWithoutInfo(pos) {
    const marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      title: 'Mein Standort'
    });

    this.markers.push(marker);
  }

  ngOnDestroy() {
    this.loginActionFinished.unsubscribe();
  }

  setStandortByFormData() {
    const geocoder = new google.maps.Geocoder();

    const address = encodeURI(this.locationFormData.country + ' ' + this.locationFormData.city + ' ' + this.locationFormData.streetAndHouseNumber);

    console.log('address ' + address);

    geocoder.geocode( { 'address' : address }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        console.log('ok');

        const setStandort = new SetStandortDTO();
        setStandort.standort = new SetStandortStandortDTO();
        setStandort.standort.breitengrad = results[0].geometry.location.lat();
        setStandort.standort.laengengrad = results[0].geometry.location.lng();
        setStandort.sitzung = this.userSession.sessionID;
        setStandort.loginName = this.userSession.userName;

        const pos = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };

        // this.setPositionWithoutInfo(pos);
        this.apiService.setStandort(setStandort);
        this.reloadMap();
        this.successMessageSetLocation = true;
      }
    } );
  }

  resetSetLocationBool() {
    this.successMessageSetLocation = false;
  }

  public filterFriendsTable = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }


  private reloadMap() {
    console.log('reload2');
    this.markers.forEach((marker) => {
      marker.setMap(null);
    });

    this.markers = [];

    this.friendsEnabledList.benutzerliste.forEach(user => {
      this.getStandortOfUser(user);
    });
  }

  isFriendEnabledGUI(element: any) {
    if(this.isFriendEnabled(element)) {
      return 'checked';
    } else {
      return 'unchecked';
    }
  }

  isFriendEnabled(element: any) {
    let enabled = false;
    this.friendsEnabledList.benutzerliste.forEach(item => {
      if (element.loginName === item.loginName) {
        enabled = true;
      }
    });

    console.log("enabled "+enabled);
    return enabled;
  }

  switchFriendEnablement(element: any) {
    console.log('switch enablement ');
    const friendFound = this.isFriendEnabled(element);

    if (!friendFound) {
      this.friendsEnabledList.benutzerliste.push(element);
    } else {
      this.friendsEnabledList.benutzerliste.splice(this.friendsEnabledList.benutzerliste.indexOf(element), 1 );
    }

    this.reloadMap();

  }
}

export class LocationFormData {
  streetAndHouseNumber: string;
  city: string;
  country: string;

  constructor() {
    this.streetAndHouseNumber = '';
    this.city = '';
    this.country = '';
  }
}


