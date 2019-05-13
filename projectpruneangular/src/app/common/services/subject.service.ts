import {UserSessionDTO} from '../dto/UserSessionDTO';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {UserDataDTO} from '../dto/UserDataDTO';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  public readonly loginFinishedSubject = new Subject<UserSessionDTO>();
  public readonly userDataSubject = new Subject<UserDataDTO>();
}
