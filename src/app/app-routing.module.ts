import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesComponent } from './pages/movies/movies.component';
import { SeriesComponent } from './pages/series/series.component';

const routes: Routes = [
  {path:'movies', component: MoviesComponent},
  {path:'series', component: SeriesComponent},
  {path:'**', pathMatch: 'full', redirectTo:'movies'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
