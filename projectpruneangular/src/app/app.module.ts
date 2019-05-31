import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './components/login/login.component';
import {MaterialModule} from './material.module';
import {RegistrationComponent} from './components/registration/registration.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HeaderComponent} from './components/header/header.component';
import {MatExpansionModule, MatNativeDateModule} from '@angular/material';
import {ProfileComponent} from './components/profile/profile.component';
import {LocationComponent} from './components/location/location.component';
import {CookieService} from 'ngx-cookie-service';
import {InitComponent} from './components/init/init.component';
import {LogoutComponent} from './components/logout/logout.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    ProfileComponent,
    LocationComponent,
    RegistrationComponent,
    InitComponent,
    InitComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    MatExpansionModule
  ],
  providers: [
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
