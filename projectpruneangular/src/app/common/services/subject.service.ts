import {UserSessionDTO} from '../dto/UserSessionDTO';
import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  public readonly loginFinishedSubject = new Subject<UserSessionDTO>();
}
