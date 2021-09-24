import { Routes } from '@angular/router';
import { MoviesComponent } from './movies/movies.component';
import { PagesComponent } from './pages.component';
import { SeriesComponent } from './series/series.component';
import { SliderHomeComponent } from './slider-home/slider-home.component';
import { SliderMoviesComponent } from './slider-movies/slider-movies.component';
import { SliderSeriesComponent } from './slider-series/slider-series.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component:PagesComponent,
    children: [
      { path: 'movies', component: MoviesComponent },
      { path: 'series', component: SeriesComponent },
      {
        path: 'slider-movies',
        component: SliderMoviesComponent,
      },
      {
        path: 'slider-series',
        component: SliderSeriesComponent,
      },
      {
        path: 'slider-home',
        component: SliderHomeComponent,
      },
    ],
  },
];
