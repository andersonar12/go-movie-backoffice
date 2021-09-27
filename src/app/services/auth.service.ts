import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public apiUrl = environment.apiUrl + '/api'
  /* public token:string | undefined  = '' */

  constructor(private http: HttpClient) { }
  
  signIn(data: any) {

    /* console.log(user) */

    const endpoint = `${this.apiUrl}/admin/users/sign_in`;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*'
    })

    const body = {
      email: data.email,
      password: data.password
    }

    return this.http.post<any>(endpoint, JSON.stringify(body), { headers: headers, withCredentials: true })
  }



  signUp(data:any) {
    const endpoint = `${ this.apiUrl }/users/sign_up`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*'})

    let body = {}

    if (data.hasOwnProperty('password')) {

      body = {
        user:
        {
          name: data.name,
          email: data.email,
          password: data.password,
          status: 1,
          phone_number: "584125558887",
          role_id: 2
        }
      };

    } 

    if(data.hasOwnProperty('google_id')) { /* Se cumple cuando se crea la cuenta con Google */

      body = {
        user:
        {
          name: data.name,
          email: data.email,
          google_auth_id: data.google_id,
          image_url: data.image_url,
          status: 1,
          phone_number: "584125558887",
          role_id: 2
        }
      }
    }

    if(data.hasOwnProperty('facebook_id')) { /* Se cumple cuando se crea la cuenta con Facebook */

      body = {
        user:
        {
          name: data.name,
          email: data.email,
          facebook_auth_id: data.facebook_id,
          image_url: data.image_url,
          status: 1,
          phone_number: "584125558887",
          role_id: 2
        }
      }
    }


  return this.http.post<any>(endpoint,body, { headers: headers, withCredentials: true })
  }

  updateUser(data:any,id:any) {
    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/users/${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`})
      
    const body = {
        user: data
      };

  return this.http.patch<any>(endpoint,body, { headers: headers, withCredentials: true })
  }

 /*  getUserByEmail(email:string){
    const endpoint = `${ this.apiUrl }/users`;
    this.token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` })
    const params = new HttpParams().set('email', email)

   return this.http.get<any>(endpoint, { headers: headers, withCredentials: true, params })
  }
 */
}
