import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MoviesComponent } from './pages/movies/movies.component';
import { SeriesComponent } from './pages/series/series.component';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { SeriesPopupComponent } from './pages/series/series-popup/series-popup.component';
import { MoviesPopupComponent } from './pages/movies/movies-popup/movies-popup.component';
import { SeasonsPopupComponent } from './pages/series/seasons-popup/seasons-popup.component';
import { ChaptersPopupComponent } from './pages/series/chapters-popup/chapters-popup.component';
import { UpdateSeasonsPopupComponent } from './pages/series/update-seasons-popup/update-seasons-popup.component';
import { UpdateChaptersPopupComponent } from './pages/series/update-chapters-popup/update-chapters-popup.component';
import { SliderMoviesComponent } from './pages/slider-movies/slider-movies.component';
import { SliderSeriesComponent } from './pages/slider-series/slider-series.component';

@NgModule({
  declarations: [
    AppComponent,
    MoviesComponent,
    SeriesComponent,
    SeriesPopupComponent,
    MoviesPopupComponent,
    SeasonsPopupComponent,
    ChaptersPopupComponent,
    UpdateSeasonsPopupComponent,
    UpdateChaptersPopupComponent,
    SliderMoviesComponent,
    SliderSeriesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
