import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'pages',
  templateUrl:'./pages.component.html',
})
export class PagesComponent {

  constructor(private router:Router,private authService:AuthService){}

  signOut() {

    this.authService.logOut().toPromise().then(()=>{
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.router.navigate(['/auth/signin']) 
    })
  }
}
