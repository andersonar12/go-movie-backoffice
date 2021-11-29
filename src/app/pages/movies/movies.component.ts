import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Subject, Subscription, zip } from 'rxjs';
import { Gender, ResourceMovieM } from 'src/app/interfaces/interfaces';
import { ResourcesService } from 'src/app/services/resources.service';
import { MoviesPopupComponent } from './movies-popup/movies-popup.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2'
import { debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  public inputSearch$ = new Subject<any>();
  public getAllDataSub?: Subscription
  public dataJson = {}
  public genders: Array<Gender> = []
  public movies: Array<ResourceMovieM> = []
  public subMovies:Array<ResourceMovieM> = []

  public displayedColumns: string[] = ['name', 'year', 'director', 'score_average', 'acciones'];
  public dataSource!: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public resourcesService:ResourcesService,private cd: ChangeDetectorRef,private snack: MatSnackBar,private dialog: MatDialog) { }

  ngOnInit() {
    this.presentLoader()
    this.getAllData()
    
  }

  /* ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  } */

  getAllData() {
    this.getAllDataSub = forkJoin([this.resourcesService.getMongoGenders(),this.resourcesService.getMongoMovieResources()])
      .subscribe((([genders, resources ]) => {

        this.genders = genders
        this.movies = resources
        this.dataJson = resources

        this.dataSource = new MatTableDataSource(this.movies);
        this.subMovies = this.movies

        if (this.dataSource) {
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

          }, 0);
        }
        console.log('Genders',genders,'Movies',resources);
        this.inputSearch()
        /* this.dataSource = new MatTableDataSource(users); */

      }),
        error => {
          console.log(error)

        },
        () => {
          /* this.filterPredicated() */
          Swal.close()
          this.cd.markForCheck()
        })

  }

  ngOnDestroy() {
    if (this.getAllDataSub) {
      this.getAllDataSub.unsubscribe()
    }
  }

  openPopUp(data: any = {}, isNew?:any) {
    let title = isNew ? 'Añadir Recurso' : 'Actualizar Recurso';
    let dialogRef: MatDialogRef<any> = this.dialog.open(MoviesPopupComponent, {
      width: '1200px',
      /* disableClose: true, */
      data: { title: title, payload: data, genders: this.genders}
    })
    dialogRef.afterClosed()
      .subscribe((res) => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.presentLoader()
   
        if (isNew) {


          this.resourcesService.addMovie(res).toPromise().then((res)=>{
            /* console.log(res) */
            this.getAllData() 
            Swal.fire('Realizado','Pelicula agregada','success')
          })


        } else {
          console.log(res);
          this.resourcesService.updateMovie(res).toPromise().then((res)=>{
            /* console.log(res) */
            

            this.resourcesService.getAllSlidersMovies().toPromise()
            .then((movies)=>{

              const data = movies.map((d:any)=>{ return d['_id']})

              this.resourcesService.updateMovieSliders(data).toPromise()
              .then(((resp)=>{
                this.getAllData() 
                Swal.fire('Realizado','Pelicula actualizada','success')
              }))

            })//para refrescar los landscape_poster en los slider
          })

        }
         
      }
      )
  }

  deleteItem(item:any) {
    console.log(item);
    Swal.fire({
      title: 'Desea eliminar:',
      html: ` <strong>${item.name}</strong>?` ,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      
      
      if (result.isConfirmed) {
        this.presentLoader()
        this.resourcesService.deleteMovie(item._id).toPromise().then((res)=>{
          /* console.log(res) */
          this.getAllData() 
          Swal.fire('Eliminado','Pelicula eliminada','success')
        })
      }
      
    })
   
  }

  presentLoader(){
    Swal.fire({
      title: 'Cargando',
      allowOutsideClick: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
      },
    })
  }

  exportJSON(){
    let dataStr = JSON.stringify(this.dataJson, null, "\t");
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'all_movies.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  inputSearch(){
   
   this.inputSearch$.pipe(
      debounceTime(1000), // discard emitted values that take less than the specified time between output
      distinctUntilChanged() // only emit when value has changed
    ).subscribe(input => {
      this.presentLoader()

      if(input.target.value == '') {
        this.dataSource.data = this.subMovies;
        Swal.close()
        this.cd.markForCheck()
        return
      }
      this.resourcesService.searchMovieResources(input.target.value)
      .toPromise().then((res)=>{

        this.dataSource.data = res
        console.log(res);
        Swal.close()
        this.cd.markForCheck()
      })
      /* console.log(input.target.value); */
    });
  }

}
