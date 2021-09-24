import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit(){

    /* this.authService.signIn({
      email: 'operario@mail.com' ,
      password: '12345678'
    }).toPromise().then(({user})=>{
      console.log(user)
      localStorage.setItem('token',user.token);
    }).catch(error=>location.reload()) */
  }
}
