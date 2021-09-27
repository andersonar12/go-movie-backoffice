import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  public loading:any;
  public password = ''
  public email = ''
  public remember_password = false
  public formGroup!: FormGroup;
  public  hide = true;

  public auth2: any;

  constructor(private _formBuilder: FormBuilder, private router:Router,public authService:AuthService) {}

  ngOnInit() {

    this.email = this.rememberUser('email')
    this.password = this.rememberUser('password')
    this.remember_password  = this.rememberUser('remember_password')
   

    this.formGroup = this._formBuilder.group({
      email: [this.email, Validators.required],
      password:[this.password, Validators.required],
      remember_password: [this.remember_password],
    });
  
  }

   signIn(){
    /* this.router.navigate(['/auth/home']) */
    this.presentLoader()

    this.authService.signIn(this.formGroup.value).toPromise().then((resp)=>{
      
      console.log(resp);
      if (resp.errors) {

        Swal.fire({
          icon: 'warning',
          title: 'Datos Invalidos',
          text: 'Ingresa los datos correctos para acceder' })
        
      } else {

        if (this.formGroup.value.remember_password) {
          localStorage.setItem('remember_user',JSON.stringify(this.formGroup.value))
        } else {
          localStorage.removeItem('remember_user')
        }

        const dataBody = {
          user_id: resp.user['user_id'],
          name: resp.user['name'] ,
          email: resp.user['email'],
          image_url: resp.user['image_url'],
          city: resp.user['city'],
          birthdate: resp.user['birthdate'],
          profile_description:resp.user['profile_description'],
          status: 1 ,
          phone_number: "584125558887" ,
          role_id:2  
        }

        localStorage.setItem('user',JSON.stringify(dataBody))
        localStorage.setItem('token', JSON.stringify(resp.user['token']));
        window.location.href = window.location.origin + '/pages/movies' 
      }

    }).catch( async (error)=>{

      const errorMsg = await error
      console.log(error);

      if (errorMsg.error.error == 'You are not allowed to access this route.') {

        Swal.fire({
          icon: 'warning',
          title: 'Usuario no permitido',
          text: 'Ingresa los datos de un Administrador' })
        
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Datos Invalidos',
          text: 'Ingresa los datos correctos para acceder' })

      }
     

      
    })
    
  }

  presentLoader(){
    Swal.fire({
      title: 'Cargando',
      allowOutsideClick: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      },
    })
  }
  

  rememberUser(arg:string){
    const remember = JSON.parse(localStorage.getItem('remember_user')!)
    return (remember) ? remember[`${arg}`] : ''
  }
 
}
