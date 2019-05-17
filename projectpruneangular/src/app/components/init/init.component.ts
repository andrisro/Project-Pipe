import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../common/services/api.service';
import {SubjectService} from '../../common/services/subject.service';
import {UserRegistrationDTO} from "../../common/dto/UserRegistrationDTO";
import {UserRegistrationEmailDTO} from "../../common/dto/UserRegistrationEmailDTO";
import {UserLoginDTO} from "../../common/dto/UserLoginDTO";
import {UserSessionDTO} from "../../common/dto/UserSessionDTO";
import {SetStandortDTO} from "../../common/dto/SetStandortDTO";
import set = Reflect.set;
import {SetStandortStandortDTO} from "../../common/dto/SetStandortStandortDTO";
import {UserCookieService} from "../../common/services/usercookie.service";
import {Subscription} from "rxjs";
import {UserPasswordDTO} from "../../common/dto/UserPasswordDTO";

@Component({
  selector: 'app-profile',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit, OnDestroy {

  private subscriptionLogin: Subscription = null;
  public countCreation = 0;
  public countMax = 10;

  constructor(private apiService: ApiService, private subjectService: SubjectService, private userCookieService: UserCookieService) {

  }

  ngOnInit() {
    this.subscriptionLogin = this.subjectService.loginFinishedSubject.subscribe((data) => {
      let setStandortDTO = new SetStandortDTO();
      setStandortDTO.loginName = data.userName;
      setStandortDTO.sitzung = data.sessionID;
      setStandortDTO.standort = new SetStandortStandortDTO();
      setStandortDTO.standort.laengengrad = 6.5 + this.countCreation / 10;
      setStandortDTO.standort.breitengrad = 51 - this.countCreation / 10;

      this.apiService.setStandort(setStandortDTO);

      if(this.countCreation <= this.countMax) {
        this.countCreation++;
        this.startLogin(this.countCreation, this.countMax);
      }
    });

    this.startLogin(this.countCreation,this.countMax);
  }

  startLogin(count: number , max: number) {
    console.log('create user '+ count);
    this.userCookieService.deleteCookies();

    let i = count;
    let userReg = new UserRegistrationDTO();
    userReg.vorname = 'vorname ' + i;
    userReg.nachname = 'nachname ' + i;
    userReg.land = 'Deutschland';
    userReg.email = new UserRegistrationEmailDTO();
    userReg.email.adresse = 'email@russlandshacker.io';
    userReg.ort = 'Gescher';
    userReg.plz = '48712';
    userReg.strasse = 'Amselweg 1';
    userReg.telefon = '00112244';
    userReg.loginName = 'user' + i;
    userReg.passwort = new UserPasswordDTO();
    userReg.passwort.passwort = 'user' + i;
    this.apiService.register(userReg);

    let userLogin = new UserLoginDTO();
    userLogin.loginName = userReg.vorname;
    userLogin.passwort = userReg.passwort;

    this.apiService.login(userLogin);
  }

  ngOnDestroy() {
  }
}
