import {UserSessionDTO} from '../dto/UserSessionDTO';
import {Subject, Subscription} from 'rxjs';
import {Injectable} from '@angular/core';
import {UserListDTO} from '../dto/UserListDTO';
import {UserDataDTO} from '../dto/UserDataDTO';
import {GetStandortDTO} from '../dto/GetStandortDTO';
import {UserRegistrationEmailDTO} from '../dto/UserRegistrationEmailDTO';
import {UserRegistrationDTO} from '../dto/UserRegistrationDTO';
import {CheckLoginNameDTO} from "../dto/CheckLoginNameDTO";


@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  public readonly loginFinishedSubject = new Subject<UserSessionDTO>();
  public readonly wrongLoginSubject = new Subject();

  public readonly userDataSubject = new Subject<UserListDTO>();
  public readonly allUsersSubject = new Subject<UserDataDTO>();
  public readonly userStandortSubject = new Subject<GetStandortDTO>();
  public readonly userRegisteredSubject = new Subject<UserRegistrationDTO>();
  public readonly userLoggedOut = new Subject();

  public readonly checkLoginNameSubject = new Subject<CheckLoginNameDTO>();
}
