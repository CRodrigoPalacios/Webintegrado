import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {
  token: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.router.navigate(['/']);
    }
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
