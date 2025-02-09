import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SubjectService} from '../../common/services/subject.service';
import {Subscription} from 'rxjs';
import {UserSessionDTO} from '../../common/dto/UserSessionDTO';
import {ApiService} from '../../common/services/api.service';
import {SetStandortStandortDTO} from '../../common/dto/SetStandortStandortDTO';
import {SetStandortDTO} from '../../common/dto/SetStandortDTO';
import {UserCookieService} from '../../common/services/usercookie.service';
import {UserListDTO} from '../../common/dto/UserListDTO';
import {MatTableDataSource} from '@angular/material';
import {UserDataDTO} from '../../common/dto/UserDataDTO';
import {} from 'googlemaps';

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
  locationFormData: LocationFormData;
  private geolocationPosition: Position;
  public dataSource = new MatTableDataSource<UserListDTO>();
  private friendsEnabledList = new UserDataDTO();
  private markers: Array<google.maps.Marker> = [];
  private pPic = 1;
  private profilePicMap = new Map();

  successMessageSetLocation = false;
  zeroResultsMessage = false;

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  displayedColumns = ['profilePicture', 'name', 'lastname', 'checkbox'];

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
        this.reloadMap();
      });
    });

    this.getUserStandortActionFinished = this.subjectService.userStandortSubject.subscribe((data) => {
      const pos = {
        lat: data.breitengrad,
        lng: data.laengengrad
      };

      // this.setPositionWithoutInfo(pos);
      this.setPositionUser(pos, data.userName);
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
    this.map.setCenter(pos);
  }

  private setPositionUser(pos: { lng: number; lat: number }, userName: string) {
    let foundUserElement = null;

    this.dataSource.data.forEach(user => {
      if (user.loginName === userName) {
        foundUserElement = user;
      }
    });

    let icon = '';
    icon = this.getProfilePicture(foundUserElement);

    var iconScaled = {
      url: icon, // url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    }

    const marker = new google.maps.Marker( {
      position: pos,
      map: this.map,
      title: userName + 's Standort',
      icon: iconScaled
    });

    this.markers.push(marker);
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

    geocoder.geocode({'address': address}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
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
        this.zeroResultsMessage = false;
      } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
        console.log('zero');
        this.zeroResultsMessage = true;
        this.successMessageSetLocation = false;
      }
    });
  }

  resetSetLocationBool() {
    this.successMessageSetLocation = false;
    this.zeroResultsMessage = false;
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

  isFriendEnabled(element: any) {
    let enabled = false;
    this.friendsEnabledList.benutzerliste.forEach(item => {
      if (element.loginName === item.loginName) {
        enabled = true;
      }
    });

    return enabled;
  }

  switchFriendEnablement(element: any) {
    console.log('switch enablement ');
    const friendFound = this.isFriendEnabled(element);

    if (!friendFound) {
      this.friendsEnabledList.benutzerliste.push(element);
    } else {
      this.friendsEnabledList.benutzerliste.splice(this.friendsEnabledList.benutzerliste.indexOf(element), 1);
    }

    this.reloadMap();

  }

  getProfilePicture(element: any) {
    // tslint:disable-next-line:triple-equals
    if (this.profilePicMap.has(element)) {
      return this.profilePicMap.get(element);
    }

    let url = '';
    this.pPic++;
    if ((this.pPic % 2) === 0) {
      url = 'https://randomuser.me/api/portraits/men/' + this.pPic + '.jpg';
    } else {
      url = 'https://randomuser.me/api/portraits/women/' + this.pPic + '.jpg';
    }

    this.profilePicMap.set(element, url);
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
