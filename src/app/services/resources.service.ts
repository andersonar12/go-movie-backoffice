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
