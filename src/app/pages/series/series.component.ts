import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Subscription, zip } from 'rxjs';
import { Gender, ResourceMovieM } from 'src/app/interfaces/interfaces';
import { ResourcesService } from 'src/app/services/resources.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2'
import { SeriesPopupComponent } from './series-popup/series-popup.component';
import { SeasonsPopupComponent } from './seasons-popup/seasons-popup.component';
import { ChaptersPopupComponent } from './chapters-popup/chapters-popup.component';


@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {

  public getAllDataSub?: Subscription
  public genders: Array<Gender> = []
  public series: Array<ResourceMovieM> = []

  public displayedColumns: string[] = ['name', 'year', 'director', 'score_average', 'seasons','acciones'];
  public dataSource!: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public resourcesService:ResourcesService,private cd: ChangeDetectorRef,private snack: MatSnackBar,private dialog: MatDialog) { }

  ngOnInit() {
    this.presentLoader()
    this.getAllData()

    
    /* window.addEventListener("beforeunload", function (e) {
      var confirmationMessage = "\o/";
      localStorage.setItem('Cierre de Ventana','closing the tab so do your small interval actions here like cookie removal etc but you cannot stop customer from closing');

      setTimeout(() => {
        
        (e || window.event).returnValue = confirmationMessage; 
        return confirmationMessage;                            
      }, 3000);
    }); */
    
  }

  /* ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  } */

  getAllData() {
    this.getAllDataSub = forkJoin([this.resourcesService.getMongoGenders(),this.resourcesService.getMongoSerieResources()])
      .subscribe((([genders, resources ,]) => {

        this.genders = genders
        this.series = resources

        this.dataSource = new MatTableDataSource(this.series);

        if (this.dataSource) {
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

          }, 0);
        }
        console.log('Genders',genders,'Series',resources);
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

  openPopUpSerie(data: any = {}, isNew?:any) {
    let title = isNew ? 'Añadir Recurso' : 'Actualizar Recurso';
    let dialogRef: MatDialogRef<any> = this.dialog.open(SeriesPopupComponent, {
      width: '1400px',
      /* disableClose: true, */
      data: { title: title, payload: data, genders: this.genders, new: isNew}
    })
    dialogRef.afterClosed()
      .subscribe((res) => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.presentLoader()
   
        if (isNew) {


          this.resourcesService.addSerieComplete(res).toPromise().then((res)=>{
            /* console.log(res) */
            this.getAllData() 
            Swal.fire('Realizado','Serie agregada','success')
          })


        } else {
          console.log(res);
          
          this.resourcesService.updateSerie(res,res._id).toPromise().then((res)=>{
            /* console.log(res) */
            this.getAllData() 
            Swal.fire('Realizado','Serie actualizada','success')
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

  openPopUpSeasons(isNew?:any) {
    let title = 'Añadir Temporada';
    let dialogRef: MatDialogRef<any> = this.dialog.open(SeasonsPopupComponent, {
      width: '950px',
      /* disableClose: true, */
      data: { title: title, payload: this.series}
    })
    dialogRef.afterClosed()
      .subscribe((res) => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.presentLoader()
   
        if (isNew) {

        } else {
          console.log(res);

          this.resourcesService.addSeason(res,res.serie_id[0]._id).toPromise().then((res)=>{
            /* console.log(res) */
            this.getAllData() 
            Swal.fire('Realizado','Temporada actualizada','success')
          })

        }
         
      }
      )
  }

  openPopUpChapters(isNew?:any) {
    let title = 'Añadir Capitulo';
    let dialogRef: MatDialogRef<any> = this.dialog.open(ChaptersPopupComponent, {
      width: '950px',
      /* disableClose: true, */
      data: { title: title, payload: this.series}
    })
    dialogRef.afterClosed()
      .subscribe((res) => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.presentLoader()
   
        if (isNew) {

        } else {
          console.log(res);

          
          this.resourcesService.addChapter(res,res.serie_id[0]._id,res.season_id).toPromise().then((res)=>{
            this.getAllData() 
            Swal.fire('Realizado','Temporada actualizada','success')
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
        this.resourcesService.deleteSerie(item._id).toPromise().then((res)=>{
          /* console.log(res) */
          this.getAllData() 
          Swal.fire('Eliminado','Serie eliminada','success')
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


}
