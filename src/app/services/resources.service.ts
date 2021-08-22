import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Gender, ResourceMovieM } from '../interfaces/interfaces';
@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  public apiUrl = environment.apiUrl + '/api'

  constructor(private http: HttpClient) { 

  }

  getMongoMovieResources(){
    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/m_resources_movies`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<ResourceMovieM[]>(endpoint, { headers: headers, withCredentials: true })
  }

  addMovie(data:Object){

    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/m_resources_movies`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`})

    const body = {
                  resource_movie: 
                    {
                        ...data
                    }
                 }


  return this.http.post<ResourceMovieM>(endpoint,body,{ headers: headers, withCredentials: true })}

  updateMovie(data:any){
    
    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/m_resources_movies/${data.id_}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`})

    const body = {
                  resource_movie: 
                    {
                        ...data
                    }
                 }
                 
  return this.http.patch<ResourceMovieM>(endpoint,body,{ headers: headers, withCredentials: true })}

  deleteMovie(id:any){

    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/m_resources_movies/${id}`;
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`})

  return this.http.delete<ResourceMovieM>(endpoint,{ headers: headers, withCredentials: true })}

  getMongoSerieResources(){
    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/m_resources_series`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<ResourceMovieM[]>(endpoint, { headers: headers, withCredentials: true })
  }

  getMongoGenders(){
    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/m_genders`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<Gender[]>(endpoint, { headers: headers, withCredentials: true })
  }
}
