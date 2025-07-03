import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  currentYear: number;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
  }
}
