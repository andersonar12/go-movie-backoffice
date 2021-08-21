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

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  public getAllDataSub?: Subscription
  public genders: Array<Gender> = []
  public movies: Array<ResourceMovieM> = []

  public displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  public dataSource =  new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public resourcesService:ResourcesService,private cd: ChangeDetectorRef,private snack: MatSnackBar,private dialog: MatDialog) { }

  ngOnInit() {
    this.getAllData()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getAllData() {
    this.getAllDataSub = forkJoin([this.resourcesService.getMongoGenders(),this.resourcesService.getMongoMovieResources()])
      .subscribe((([genders, resources ,]) => {

        console.log('Genders',genders,'Movies',resources);
        /* this.dataSource = new MatTableDataSource(users); */

      }),
        error => {
          console.log(error)
        },
        () => {
          /* this.filterPredicated() */
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
   
        if (isNew) {

          /* this.configService.addFaenaByUser(data.user.id, res.id_faena).subscribe(data => {
              console.log("addFaenaByUser: ",data)
            },(error)=>{console.log(error)},(()=>{
              this.getAllData(),
              this.cd.markForCheck()
              this.loader.close();
              this.snack.open('Usuario añadido!', 'OK', { duration: 4000 })
            })) */


        } else {
          console.log(res);
         
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

}
