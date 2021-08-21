import { Component,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public authService:AuthService) { }

  ngOnInit(){

    this.authService.signIn({
      email: 'test@mail.com' ,
      password: '12345678'
    }).toPromise().then(({user})=>{
      console.log(user)
      localStorage.setItem('token',user.token);
    })
  }
}
