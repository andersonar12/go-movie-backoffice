import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { MoviesComponent } from './movies/movies.component';
import { SeriesComponent } from './series/series.component';
import { SliderMoviesComponent } from './slider-movies/slider-movies.component';
import { SliderSeriesComponent } from './slider-series/slider-series.component';
import { SliderHomeComponent } from './slider-home/slider-home.component';
import { PagesComponent } from './pages.component';
import { PagesRoutes } from './pages.routing';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MoviesPopupComponent } from './movies/movies-popup/movies-popup.component';
import { ChaptersPopupComponent } from './series/chapters-popup/chapters-popup.component';
import { SeasonsPopupComponent } from './series/seasons-popup/seasons-popup.component';
import { SeriesPopupComponent } from './series/series-popup/series-popup.component';
import { UpdateChaptersPopupComponent } from './series/update-chapters-popup/update-chapters-popup.component';
import { UpdateSeasonsPopupComponent } from './series/update-seasons-popup/update-seasons-popup.component';
import { SliderHomePopupComponent } from './slider-home/slider-home-popup/slider-home-popup.component';


const Components = [
  PagesComponent,
  MoviesComponent,
  SeriesComponent, 
  SliderMoviesComponent,
  SliderSeriesComponent,
  SliderHomeComponent,
  MoviesPopupComponent,
  ChaptersPopupComponent,
  SeasonsPopupComponent,
  SeriesPopupComponent,
  UpdateChaptersPopupComponent,
  UpdateSeasonsPopupComponent,
  SliderHomePopupComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDialogModule,
    MatIconModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatTabsModule,
    NgMultiSelectDropDownModule,
    DragDropModule,
    MatSlideToggleModule,
    RouterModule.forChild(PagesRoutes)
  ],
  declarations: [ ...Components]
})
export class PagesModule { }