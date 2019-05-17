import {UserSessionDTO} from '../dto/UserSessionDTO';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {UserListDTO} from '../dto/UserListDTO';
import {UserDataDTO} from '../dto/UserDataDTO';
import {GetStandortDTO} from '../dto/GetStandortDTO';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  public readonly loginFinishedSubject = new Subject<UserSessionDTO>();
  public readonly userDataSubject = new Subject<UserListDTO>();
  public readonly allUsersSubject = new Subject<UserDataDTO>();
  public readonly userStandortSubject = new Subject<GetStandortDTO>();
}
