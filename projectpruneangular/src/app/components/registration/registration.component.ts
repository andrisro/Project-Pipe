import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../common/services/api.service';
import {MatInputModule} from '@angular/material/input';
import {MatButtonToggleModule} from '@angular/material';
import {UserPasswordDTO} from '../../common/dto/UserPasswordDTO';
import {UserRegistrationDTO} from '../../common/dto/UserRegistrationDTO';
import {UserRegistrationEmailDTO} from '../../common/dto/UserRegistrationEmailDTO';
import {Subscription} from 'rxjs';
import {SubjectService} from '../../common/services/subject.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserLoginDTO} from '../../common/dto/UserLoginDTO';

export interface FormModel {
  captcha?: string;
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  title = 'registration';
  public user: User;
  public formModel: FormModel = {};
  private checkLoginNameSubscription: Subscription;
  checkLogin = true;
  public userRegistration: UserRegistrationDTO;
  private registrationSubjectSubscription: Subscription;
  loginFinished: boolean = false;
  failureRegistration: boolean = false;
  private loginFinishedSubject: Subscription;
  constructor(private apiService: ApiService,
              private subjectService: SubjectService) {
    this.user = new User();
  }

  ngOnInit() {
    this.subscribeCheckLoginName();
    this.subscribeRegistrationSuccess();
    this.subscribeLoginFinished();
    this.checkLogin = true;

    this.userRegistration.email = new UserRegistrationEmailDTO();
    this.userRegistration.passwort = new UserPasswordDTO();
  }

  ngOnDestroy() {
    this.checkLoginNameSubscription.unsubscribe();
    this.registrationSubjectSubscription.unsubscribe();
  }

  testCall() {
    console.log('registration');
  }

  subscribeCheckLoginName() {
    this.checkLoginNameSubscription = this.subjectService.checkLoginNameSubject.subscribe((data) => {
        console.log('hab die daten hier ' + JSON.stringify(data));
        this.checkLogin = data.ergebnis;

        if (this.checkLogin) {
          this.apiService.register(this.userRegistration);
        }
      }
    );
  }

  subscribeRegistrationSuccess() {
    this.registrationSubjectSubscription = this.subjectService.userRegisteredSubject.subscribe((data) => {
      if(data.ergebnis === true) {
        const userLoginDto = new UserLoginDTO();
        userLoginDto.loginName = this.userRegistration.loginName;
        userLoginDto.passwort = this.userRegistration.passwort;

        this.apiService.login(userLoginDto);

      } else {
        this.failureRegistration = true;
      }
        console.log('response ' +data);
    });
  }

  registration() {
    this.userRegistration = new UserRegistrationDTO();
    this.userRegistration.loginName = this.user.loginName;
    this.userRegistration.passwort = new UserPasswordDTO();
    this.userRegistration.passwort.passwort = this.user.password;
    this.userRegistration.nachname = this.user.lastName;
    this.userRegistration.vorname = this.user.firstName;
    this.userRegistration.strasse = this.user.street;
    this.userRegistration.plz = this.user.zip;
    this.userRegistration.ort = this.user.city;
    this.userRegistration.land = this.user.country;
    this.userRegistration.telefon = this.user.telephone;
    this.userRegistration.email = new UserRegistrationEmailDTO();
    this.userRegistration.email.adresse = this.user.email;

    this.apiService.checkLoginName(this.userRegistration.loginName);

    console.log('Log: ');
    console.log(JSON.stringify(this.userRegistration));
  }

  isPasswordConfirmationValid() {
    return this.user.password === this.user.passwordConfirmation;
  }

  getSecurityLevelPassword() {
    const regExUserLastName = new RegExp(this.user.lastName, 'i');
    const regExUserFirstName = new RegExp(this.user.firstName, 'i');
    const regExUserUserName = new RegExp(this.user.loginName, 'i');

    const banned = new  Array();
    banned.push(regExUserLastName);
    banned.push(regExUserFirstName);
    banned.push(regExUserUserName);

    let strengthLevel = 0;
    // Prüfe ob einer der Ausdrücke benutzt wird
    for (let j = 0; j < banned.length; j++) {
      if (new RegExp(banned[j]).test(this.user.password)) {
        strengthLevel--;
      }
    }

    if (strengthLevel < 0) {
      return 0;
    } else {
      // Prüfung auf die Länge
      if (this.user.password.length > 6) {
        strengthLevel++;
      } else if (this.user.password.length > 8) {
        strengthLevel += 2;
      }

      if (strengthLevel >= 1) {
        const charscontainer = new Array();
        charscontainer.push('[A-Z]');
        charscontainer.push('[a-z]');
        charscontainer.push('[0-9]');
        charscontainer.push('[°!§$%&/()=?ß*+~#<>@\'.:,;-]');

        // Prüfe ob min ein Char aus derm jeweiligen Array verwendet wird
        for (let i = 0; i < charscontainer.length; i++) {
          if (new RegExp(charscontainer[i]).test(this.user.password)) {
            strengthLevel++;
          }
        }
      }
    }

    return strengthLevel;
  }

  getProgressBarColor(securityLevelPassword: number): string {
    if (securityLevelPassword === 0) {
      return 'warn';
    } else if (securityLevelPassword > 0 && securityLevelPassword <= 3) {
      return 'accent';
    } else {
      return 'primary';
    }
  }

  isNoFieldEmpty() {
    console.log('field status');
    console.log(this.user.password.length);
    console.log(this.user.passwordConfirmation.length);
    console.log(this.user.loginName.length);
    console.log(this.user.city.length);
    console.log(this.user.country.length);
    console.log(this.user.email.length);
    console.log(this.user.street.length);
    console.log(this.user.telephone.length);

    return ((this.user.password.length > 1) && (this.user.passwordConfirmation.length > 1) && (this.user.loginName.length > 1) && (this.user.city.length > 1) && (this.user.country.length > 1) && (this.user.email.length > 1) && (this.user.street.length > 1) && (this.user.telephone.length > 1) && (this.user.zip.length > 1));
  }

  isAdressFormFilledOut() {
    return ((this.user.city.length > 1) && (this.user.country.length > 1) && (this.user.email.length > 1) && (this.user.street.length > 1) && (this.user.telephone.length > 1) && (this.user.zip.length > 1));
  }

  private subscribeLoginFinished() {
    this.loginFinishedSubject = this.subjectService.loginFinishedSubject.subscribe((data) => {
      this.loginFinished = true;
    });
  }
}

export class User {
  loginName = '';
  password = '';
  passwordConfirmation = '';
  lastName = '';
  firstName = '';
  street = '';
  zip = '';
  city = '';
  country = '';
  telephone = '';
  email = '';
}
