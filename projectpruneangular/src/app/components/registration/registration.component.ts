import { Component } from '@angular/core';
import {ApiService} from '../../common/services/api.service';
import {MatInputModule} from '@angular/material/input';
import {MatButtonToggleModule} from '@angular/material';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  title = 'registration';

  constructor(private apiService: ApiService) {

  }

  testCall() {
    console.log('registration');
  }
}
