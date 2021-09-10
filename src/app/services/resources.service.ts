import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Gender, ResourceMovieM, RespSliderHome } from '../interfaces/interfaces';
@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  public apiUrl = environment.apiUrl + '/api'

  constructor(private http: HttpClient) {
  }

  getMongoMovieResources() {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_movies`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<ResourceMovieM[]>(endpoint, { headers: headers, withCredentials: true })
  }

  /* Buscador  */

  searchMovieResources(value: string) {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_movies`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const params = new HttpParams().set('search', value)/* .set('fields', 'name,year,artists,poster_url') */
    return this.http.get<ResourceMovieM[]>(endpoint, { headers: headers, withCredentials: true, params })
  }

  searchSerieResources(value: string) {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_series`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    const params = new HttpParams().set('search', value)/* .set('fields', 'name,year,artists,poster_url') */
    return this.http.get<ResourceMovieM[]>(endpoint, { headers: headers, withCredentials: true, params })
  }

  /* Buscador */


  addMovie(data: Object | any) {

    delete data.id_

    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_movies`;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })

    /* const body = {
      resource_movie:
      {
        ...data
      }
    } */

    let formData = new FormData();

    Object.entries(data).forEach((key:any) =>{

      if(key[1]==''){
        return
      }

      if(key[0]=='genders' ||key[0]=='artists' ){

        formData.append(`resource_movie[${key[0]}]`, JSON.stringify(key[1]));
      } else {
        formData.append(`resource_movie[${key[0]}]`,key[1]);
      }

    })


    return this.http.post<any>(endpoint, formData, { headers: headers, withCredentials: true })
  }

  updateMovie(data: Object | any) {

    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_movies/${data.id_}`;
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`})

    delete data.id_

    /* const body = {
      resource_movie:
      {
        ...data
      }
    } */

    let formData = new FormData();

    Object.entries(data).forEach((key:any) =>{

      if(key[1]==''){
        return
      }

      if(key[0]=='genders' ||key[0]=='artists' ){

        formData.append(`resource_movie[${key[0]}]`, JSON.stringify(key[1]));
      } else {
        formData.append(`resource_movie[${key[0]}]`,key[1]);
      }

    })

    return this.http.patch<ResourceMovieM>(endpoint, formData, { headers: headers, withCredentials: true })
  }

  deleteMovie(id: any) {

    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_movies/${id}`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })

    return this.http.delete<any>(endpoint, { headers: headers, withCredentials: true })
  }

  getMongoSerieResources() {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_series`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<ResourceMovieM[]>(endpoint, { headers: headers, withCredentials: true })
  }

  /* Series */
  addSerieComplete(data: Object | any) {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_series`;
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`})

    delete data._id

    /* const body = {
      resource_serie:
      {
        ...data
      }
    } */

    if (data.genders.length > 0){
      data.genders = data.genders.map((gender:any)=>{
        return gender.name
      })
    }

    let formData = new FormData();

    Object.entries(data).forEach((key:any) =>{

      if(key[1]==''){
        return
      }

      if(key[0]=='genders' ||key[0]=='artists'||key[0]=='seasons'){

        formData.append(`resource_serie[${key[0]}]`, JSON.stringify(key[1]));
      } else {
        formData.append(`resource_serie[${key[0]}]`,key[1]);
      }

    })

    return this.http.post<any>(endpoint, formData, { headers: headers, withCredentials: true })
  }

  updateSerie(data: any, serie_id: Storage) {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_series/${serie_id}`;
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`
    })

    delete data._id
    delete data.seasons // no se pueden enviar seasons dado que solo interesa es modificar la informacion descriptiva de la Serie

    /* const body = {
      resource_serie:
      {
        ...data
      }
    } */

    if (data.genders.length > 0){
      data.genders = data.genders.map((gender:any)=>{
        return gender.name
      })
    }

    let formData = new FormData();

    Object.entries(data).forEach((key:any) =>{

      if(key[1]==''){
        return
      }

      if(key[0]=='genders' ||key[0]=='artists'){

        formData.append(`resource_serie[${key[0]}]`, JSON.stringify(key[1]));
      } else {
        formData.append(`resource_serie[${key[0]}]`,key[1]);
      }

    })

    return this.http.patch<any>(endpoint, formData, { headers: headers, withCredentials: true })
  }

  deleteSerie(id: any) {

    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_series/${id}`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })

    return this.http.delete<any>(endpoint, { headers: headers, withCredentials: true })
  }
  /* Series */

  /* Seasons  */

  addSeason(data: any, serie_id: string) {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_series/${serie_id}/seasons`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`
    })

    delete data.serie_id //No es necesario enviar un body con esos atributos
    delete data.id_ //No es necesario enviar un body con esos atributos
    const body = {
      season: {
        ...data
      }
    }

    return this.http.post<any>(endpoint, body, { headers: headers, withCredentials: true })
  }

  updateSeason(data: any, serie_id: string, season_id: string) {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_series/${serie_id}/seasons/${season_id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`
    })

    delete data._id
    delete data.serie_id //No es necesario enviar un body con esos atributos
    delete data.delete
    const body = {
      season: {
        ...data
      }
    }

    return this.http.patch<any>(endpoint, body, { headers: headers, withCredentials: true })
  }

  deleteSeason(serie_id: string, season_id: string) {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_series/${serie_id}/seasons/${season_id}`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })

    return this.http.delete<any>(endpoint, { headers: headers, withCredentials: true })
  }
  /* Seasons */

  /* Chapters */
  addChapter(data: any, serie_id: string, season_id: string) {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_series/${serie_id}/seasons/${season_id}/chapters`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`
    })

    delete data.season_id //No es necesario enviar un body con esos atributos
    delete data.serie_id //No es necesario enviar un body con esos atributos

    const body = {
      chapter: {
        ...data
      }
    }

    return this.http.post<any>(endpoint, body, { headers: headers, withCredentials: true })
  }

  updateChapter(data: any, serie_id: string, season_id: string, chapter_id: string) {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_series/${serie_id}/seasons/${season_id}/chapters/${chapter_id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`
    })

    delete data._id
    delete data.season_id
    delete data.serie_id  //No es necesario enviar un body con esos atributos

    const body = {
      chapter: {
        ...data
      }
    }

    return this.http.patch<any>(endpoint, body, { headers: headers, withCredentials: true })
  }

  deleteChapter(serie_id: string, season_id: string, chapter_id: string) {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_resources_series/${serie_id}/seasons/${season_id}/chapters/${chapter_id}`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })

    return this.http.delete<any>(endpoint, { headers: headers, withCredentials: true })
  }

  /* Chapters */

  getMongoGenders() {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/m_genders`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<Gender[]>(endpoint, { headers: headers, withCredentials: true })
  }


  /* SLider Movies */
  getAllSlidersMovies() {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/movies_sliders`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<any>(endpoint, { headers: headers, withCredentials: true })
  }

  updateMovieSliders(data: any) {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/movies_sliders`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`
    })

    const body = {
      movies_sliders: [
        ...data
      ]
    }

    return this.http.post<any>(endpoint, body, { headers: headers, withCredentials: true })
  }
  /* Slider Movies */

  /* SLider Series */
  getAllSlidersSeries() {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/series_sliders`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<any>(endpoint, { headers: headers, withCredentials: true })
  }

  updateSerieSliders(data: any) {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/series_sliders`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': `Bearer ${token}`
    })

    const body = {
      series_sliders: [
        ...data
      ]
    }

    return this.http.post<any>(endpoint, body, { headers: headers, withCredentials: true })
  }
  /* Slider Series */


  /* Slider Home */

  getAllSlidersHome() {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/main_sliders`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    return this.http.get<RespSliderHome>(endpoint, { headers: headers, withCredentials: true })
  }

  addSliderWithImage(content: any) {

    /* console.log(content) */

    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/main_sliders`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })

    let formData = new FormData();

    formData.append('main_slider[img]', content.image);
    formData.append('main_slider[title]', content.title);
    formData.append('main_slider[description]', content.description);
    formData.append('main_slider[status]',`${content.status}`);
    formData.append('main_slider[link_1]', content.link_1);
    formData.append('main_slider[link_2]', content.link_2);
    formData.append('main_slider[order]', content['order']);

    return this.http.post<any>(endpoint, formData, { headers})

  }

  /* eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJnb19tb3ZpZSIsImV4cCI6MTYzMzUzMDc2MCwiaWF0IjoxNjMxMTExNTYwLCJpc3MiOiJnb19tb3ZpZSIsImp0aSI6IjAyNDA0ZDAwLTk5OTctNDFhYy04NjhmLWMzM2QwZGJjMzc2ZSIsIm5iZiI6MTYzMTExMTU1OSwic3ViIjoiNzIiLCJ0eXAiOiJhY2Nlc3MifQ.nrh6rrB0wG-ypwkeRd2uXGRVF5QBJqhTljLbAyyyXF8hDibsSCImbjIsaVnbD8HLijOpZEXttvaaC1Jrgxl1sw */


  updateSliderWithImage(id:string,content: any) {

    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/main_sliders/${id}`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })

    let formData = new FormData();

    if (!content.image) {

      formData.append('main_slider[title]', content.title);
      formData.append('main_slider[description]', content.description);
      formData.append('main_slider[status]',`${content.status}`);
      formData.append('main_slider[link_1]', content.link_1);
      formData.append('main_slider[link_2]', content.link_2);
      formData.append('main_slider[order]', content['order']);

    } else {
      
      formData.append('main_slider[img]', content.image);
      formData.append('main_slider[title]', content.title);
      formData.append('main_slider[description]', content.description);
      formData.append('main_slider[status]',`${content.status}`);
      formData.append('main_slider[link_1]',content.link_1);
      formData.append('main_slider[link_2]', content.link_2);
      formData.append('main_slider[order]', content['order']);
    }



    return this.http.put<any>(endpoint, formData, { headers, withCredentials: true })

  }

  deleteOneSliderHome(id: string) {
    const token = localStorage.getItem('token')?.replace('"', '').replace('"', '')
    const endpoint = `${this.apiUrl}/main_sliders/${id}`;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` })

    return this.http.delete<any>(endpoint, { headers: headers, withCredentials: true })
  }


  /* Slider Home */



}
