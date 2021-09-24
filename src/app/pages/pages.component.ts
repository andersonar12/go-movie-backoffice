import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pages',
  templateUrl:'./pages.component.html',
})
export class PagesComponent {

  constructor(private router:Router){}

  signOut() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this.router.navigate(['/auth/signin']) 
  }
}
