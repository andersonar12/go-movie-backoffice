import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Subject, Subscription, zip } from 'rxjs';
import { Gender, ResourceMovieM } from 'src/app/interfaces/interfaces';
import { ResourcesService } from 'src/app/services/resources.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2'
import { SeriesPopupComponent } from './series-popup/series-popup.component';
import { SeasonsPopupComponent } from './seasons-popup/seasons-popup.component';
import { ChaptersPopupComponent } from './chapters-popup/chapters-popup.component';
import { UpdateSeasonsPopupComponent } from './update-seasons-popup/update-seasons-popup.component';
import { UpdateChaptersPopupComponent } from './update-chapters-popup/update-chapters-popup.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';



@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})
export class SeriesComponent implements OnInit {
  public inputSearch$ = new Subject<any>();
  public getAllDataSub?: Subscription
  public dataJson = {}
  public genders: Array<Gender> = []
  public series: Array<ResourceMovieM> = []
  public subSeries:Array<ResourceMovieM> = []

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
        this.dataJson = resources

        this.dataSource = new MatTableDataSource(this.series);
        this.subSeries = this.series
        if (this.dataSource) {
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

          }, 0);
        }
        console.log('Genders',genders,'Series',resources);
        /* this.dataSource = new MatTableDataSource(users); */
        this.inputSearch()
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

  openPopUpUpdateSeasons(data: any = {},isNew?:any) {
    let title = 'Actualizar Temporada';
    let dialogRef: MatDialogRef<any> = this.dialog.open(UpdateSeasonsPopupComponent, {
      width: '950px',
      /* disableClose: true, */
      data: { title: title, payload: data}
    })
    dialogRef.afterClosed()
      .subscribe((res) => {
 
        if(!res) {
          // If user press cancel
          return;
        }
        this.presentLoader()

        if (res.hasOwnProperty('delete')) {
          this.resourcesService.deleteSeason(res.serie_id,res._id).toPromise().then((res)=>{
          
            this.getAllData() 
            Swal.fire('Realizado','Temporada eliminada','success')
          })
          return
        }
   
        if (isNew) {
        } else {
          console.log(res);
          this.resourcesService.updateSeason(res,res.serie_id,res._id).toPromise().then((res)=>{
            /* console.log(res) */
            this.getAllData() 
            Swal.fire('Realizado','Temporada actualizada','success')
          })

        }
         
      }
      )
  }

  openPopUpUpdateChapters(data: any = {},isNew?:any) {
    let title = 'Actualizar Capitulos';
    let dialogRef: MatDialogRef<any> = this.dialog.open(UpdateChaptersPopupComponent, {
      width: '950px',
      /* disableClose: true, */
      data: { title: title, payload: data}
    })
    dialogRef.afterClosed()
      .subscribe((res) => {
 
        if(!res) {
          // If user press cancel
          return;
        }
        this.presentLoader()

        if (res.hasOwnProperty('delete')) {
        
          this.resourcesService.deleteChapter(res.serie_id,res.season_id,res._id).toPromise().then((res)=>{
          
            this.getAllData() 
            Swal.fire('Realizado','Capitulo eliminado','success')
          })
          return
        }
   
        if (isNew) {
        } else {
          console.log(res);
          this.resourcesService.updateChapter(res,res.serie_id,res.season_id,res._id).toPromise().then((res)=>{
            /* console.log(res) */
            this.getAllData() 
            Swal.fire('Realizado','Capitulo actualizado','success')
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

  exportJSON(){
    let dataStr = JSON.stringify(this.dataJson, null, "\t");
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'all_series.json';

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
        this.dataSource.data = this.subSeries;
        Swal.close()
        this.cd.markForCheck()
        return
      }
      this.resourcesService.searchSerieResources(input.target.value)
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
