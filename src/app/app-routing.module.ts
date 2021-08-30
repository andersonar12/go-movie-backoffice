import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesComponent } from './pages/movies/movies.component';
import { SeriesComponent } from './pages/series/series.component';
import { SliderMoviesComponent } from './pages/slider-movies/slider-movies.component';
import { SliderSeriesComponent } from './pages/slider-series/slider-series.component';

const routes: Routes = [
  {path:'movies', component: MoviesComponent},
  {path:'series', component: SeriesComponent},
  {path:'slider-movies', component: SliderMoviesComponent},
  {path:'slider-series', component: SliderSeriesComponent},
  {path:'**', pathMatch: 'full', redirectTo:'movies'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
