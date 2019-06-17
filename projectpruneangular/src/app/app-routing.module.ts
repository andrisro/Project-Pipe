import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {ProfileComponent} from './components/profile/profile.component';
import {LocationComponent} from './components/location/location.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {InitComponent} from './components/init/init.component';
import {LogoutComponent} from './components/logout/logout.component';
import {RegLoginWrapperComponent} from "./components/regloginwrapper/reg-login-wrapper.component";


const routes: Routes = [
  {path: 'profile', component: ProfileComponent},
  {path: 'location', component: LocationComponent},
  {path: 'init', component: InitComponent},
  {path: 'logout', component: LogoutComponent},
  {path: '', component: LoginComponent},
  {path: 'registration', component: RegLoginWrapperComponent},
  {path: 'login', component: RegLoginWrapperComponent},
  {path: 'wrapper', component: RegLoginWrapperComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
