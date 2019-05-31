import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {ProfileComponent} from './components/profile/profile.component';
import {LocationComponent} from './components/location/location.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {InitComponent} from './components/init/init.component';
import {LogoutComponent} from './components/logout/logout.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'location', component: LocationComponent},
  {path: 'init', component: InitComponent},
  {path: 'logout', component: LogoutComponent},
  {path: '', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
