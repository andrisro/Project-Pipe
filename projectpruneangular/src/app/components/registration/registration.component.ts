import { Component } from '@angular/core';
import {ApiService} from '../../common/services/api.service';
import {MatInputModule} from '@angular/material/input';
import {MatButtonToggleModule} from '@angular/material';
import {UserLoginDTO} from "../../common/dto/UserLoginDTO";
import {UserPasswordDTO} from "../../common/dto/UserPasswordDTO";
import {UserRegistrationDTO} from "../../common/dto/UserRegistrationDTO";
import {UserRegistrationEmailDTO} from "../../common/dto/UserRegistrationEmailDTO";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  title = 'registration';
  public user: User;

  constructor(private apiService: ApiService) {
    this.user = new User();
  }

  testCall() {
    console.log('registration');
  }

  registration() {
    const userRegistrationDto = new UserRegistrationDTO();
    userRegistrationDto.loginName = this.user.loginName;
    userRegistrationDto.passwort = new UserPasswordDTO();
    userRegistrationDto.passwort.passwort = this.user.password;
    userRegistrationDto.nachname = this.user.lastName;
    userRegistrationDto.vorname = this.user.firstName;
    userRegistrationDto.strasse = this.user.street;
    userRegistrationDto.plz = this.user.zip;
    userRegistrationDto.ort = this.user.city;
    userRegistrationDto.land = this.user.country;
    userRegistrationDto.telefon = this.user.telephone;
    userRegistrationDto.email = new UserRegistrationEmailDTO();
    userRegistrationDto.email.adresse = this.user.email;

    console.log('Log: ');
    console.log(JSON.stringify(userRegistrationDto));
    this.apiService.register(userRegistrationDto);
  }
}

export class User {
  loginName = '';
  password = '';
  lastName = '';
  firstName = '';
  street = '';
  zip = '';
  city = '';
  country = '';
  telephone = '';
  email = '';
}
