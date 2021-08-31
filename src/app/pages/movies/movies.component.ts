import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Subscription, zip } from 'rxjs';
import { Gender, ResourceMovieM } from 'src/app/interfaces/interfaces';
import { ResourcesService } from 'src/app/services/resources.service';
import { MoviesPopupComponent } from './movies-popup/movies-popup.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  public getAllDataSub?: Subscription
  public dataJson = {}
  public genders: Array<Gender> = []
  public movies: Array<ResourceMovieM> = []

  public displayedColumns: string[] = ['name', 'year', 'director', 'score_average', 'acciones'];
  public dataSource!: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public resourcesService:ResourcesService,private cd: ChangeDetectorRef,private snack: MatSnackBar,private dialog: MatDialog) { }

  ngOnInit() {
    this.presentLoader()
    this.getAllData()

    
    window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/";
      localStorage.setItem('Cierre de Ventana','closing the tab so do your small interval actions here like cookie removal etc but you cannot stop customer from closing');

      setTimeout(() => {
        
        (e || window.event).returnValue = confirmationMessage; 
        return confirmationMessage;                            
      }, 3000);
    });
    
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

        if (this.dataSource) {
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

          }, 0);
        }
        console.log('Genders',genders,'Movies',resources);
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
      width: '1150px',
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
            this.getAllData() 
            Swal.fire('Realizado','Pelicula actualizada','success')
          })
          /* this.configService.updateFaenaByUser(res.contract_user, res.user_id, res.id_faena).subscribe(() => {

          }, (error) => { console.log(error) }, (() => {
            this.getAllData();
            this.cd.markForCheck()
            this.loader.close();
            this.snack.open('Usuario Actualizado!', 'OK', { duration: 4000 })
          })) */

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

}
