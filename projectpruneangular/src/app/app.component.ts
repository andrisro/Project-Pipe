import { Component } from '@angular/core';
import {startTimeRange} from "@angular/core/src/profile/wtf_impl";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'projectpruneangular';

  timeLeft: number = 60;
  interval;

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.pauseTimer();
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  constructor() {
    this.timeLeft = 2;
    this.startTimer();
  }
}
