import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Subject, Subscription, zip } from 'rxjs';
import {  ResourceMovieM, SliderHome } from 'src/app/interfaces/interfaces';
import { ResourcesService } from 'src/app/services/resources.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2'
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { SliderHomePopupComponent } from './slider-home-popup/slider-home-popup.component';

@Component({
  selector: 'app-slider-home',
  templateUrl: './slider-home.component.html',
  styleUrls: ['./slider-home.component.scss']
})
export class SliderHomeComponent implements OnInit {

  public getAllDataSub?: Subscription

  /* public sliders: Array<SliderHome> = [] */

  public displayedColumns: string[] = ['title', 'description', 'order', 'acciones'];
  public dataSource!: MatTableDataSource<any>

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public resourcesService:ResourcesService,private cd: ChangeDetectorRef,private snack: MatSnackBar,private dialog: MatDialog) { }

  ngOnInit() {
    this.presentLoader()
    this.getAllData()
  }


  getAllData() {
    this.getAllDataSub = forkJoin([this.resourcesService.getAllSlidersHome()])
      .subscribe((([{data}]) => {

        this.dataSource = new MatTableDataSource(data);
       
        if (this.dataSource) {
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

          }, 0);
        }
        console.log('Sliders Home',data);
        

      }),
        error => {
          console.log(error)
        },
        () => {
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
    let title = isNew ? 'Añadir Slider' : 'Actualizar Slider';
    let dialogRef: MatDialogRef<any> = this.dialog.open(SliderHomePopupComponent, {
      width: '1150px',
      /* disableClose: true, */
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe((res) => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.presentLoader()
   
        if (isNew) {


          this.resourcesService.addSliderWithImage(res).toPromise().then((res)=>{
            console.log(res)
            this.getAllData() 
            Swal.fire('Realizado','Slider agregado','success')
          })


        } else {
          /* console.log(res); */

          this.resourcesService.updateSliderWithImage(res.id,res).toPromise().then((res)=>{
            /* console.log(res) */
            this.getAllData() 
            Swal.fire('Realizado','Pelicula actualizada','success')
          })
         
        }
         
      }
      )
  }

  deleteItem(item:any) {
    /* console.log(item); */
    Swal.fire({
      title: 'Desea eliminar:',
      html: ` <strong>${item.title}</strong>?` ,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar'
    }).then((result) => {
      
      
      if (result.isConfirmed) {
        this.presentLoader()
        this.resourcesService.deleteOneSliderHome(item.id).toPromise().then((res)=>{
          /* console.log(res) */
          this.getAllData() 
          Swal.fire('Eliminado','Slider Eliminado','success')
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
