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

  return this.http.delete<any>(endpoint,{ headers: headers, withCredentials: true })}

  getMongoSerieResources(){
    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/m_resources_series`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<ResourceMovieM[]>(endpoint, { headers: headers, withCredentials: true })
  }

  /* Series */
  addSerieComplete(data:any){
    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/m_resources_series`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`})
    delete data._id
    const body = {
                  resource_serie: 
                    {
                        ...data
                    }
                 }

    return this.http.post<ResourceMovieM[]>(endpoint,body,{ headers: headers, withCredentials: true })
  }

  updateSerie(data:any,serie_id:Storage){
    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/m_resources_series/${serie_id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`})
    
    delete data._id
    delete data.seasons // no se pueden enviar seasons dado que solo interesa es modificar la informacion descriptiva de la Serie
    const body = {
                  resource_serie: 
                    {
                        ...data
                    }
                 }

    return this.http.patch<ResourceMovieM[]>(endpoint,body,{ headers: headers, withCredentials: true })
  }

  deleteSerie(id:any){

    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/m_resources_series/${id}`;
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`})

  return this.http.delete<any>(endpoint,{ headers: headers, withCredentials: true })}
  /* Series */

  /* Seasons  */

  addSeason(data:any,serie_id:string){
    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/m_resources_series/${serie_id}/seasons`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`})

    delete data.serie_id //No es necesario enviar un body con esos atributos
    delete data.id_ //No es necesario enviar un body con esos atributos
    const body = {
      season: {
        ...data
      }
    }

    return this.http.post<any>(endpoint,body,{ headers: headers, withCredentials: true })
  }

  updateSeason(data:any,serie_id:string,season_id:string){
    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/m_resources_series/${serie_id}/seasons/${season_id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`})

      delete data.season_id 
      delete data.serie_id //No es necesario enviar un body con esos atributos

    const body = {
      season: {
        ...data
      }
    }

    return this.http.post<any>(endpoint,body,{ headers: headers, withCredentials: true })
  }

  /* Seasons */

  /* Chapters */
  addChapter(data:any,serie_id:string,season_id:string){
    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/m_resources_series/${serie_id}/seasons/${season_id}/chapters`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`})

    delete data.season_id //No es necesario enviar un body con esos atributos
    delete data.serie_id //No es necesario enviar un body con esos atributos

    const body = {
      chapter: {
        ...data
      }
    }

    return this.http.post<any>(endpoint,body,{ headers: headers, withCredentials: true })
  }

  updateChapter(data:any,serie_id:string,season_id:string,chapter_id:string){
    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/m_resources_series/${serie_id}/seasons/${season_id}/chapters/${chapter_id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`})

    delete data.chapter_id
    delete data.season_id 
    delete data.serie_id  //No es necesario enviar un body con esos atributos

    const body = {
      chapter: {
        ...data
      }
    }

    return this.http.patch<any>(endpoint,body,{ headers: headers, withCredentials: true })
  }

  /* Chapters */

  getMongoGenders(){
    const token = localStorage.getItem('token')?.replace('"','').replace('"','') 
    const endpoint = `${ this.apiUrl }/m_genders`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<Gender[]>(endpoint, { headers: headers, withCredentials: true })
  }
}
