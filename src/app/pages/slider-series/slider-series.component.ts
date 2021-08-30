import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { forkJoin, Subscription } from 'rxjs';
import { ResourcesService } from 'src/app/services/resources.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-slider-series',
  templateUrl: './slider-series.component.html',
  styleUrls: ['./slider-series.component.scss']
})
export class SliderSeriesComponent implements OnInit {
  public getAllDataSub?: Subscription

  todo:any  = [
  ];

  done:any = [
  ];

  constructor(private cd: ChangeDetectorRef,public resourcesService:ResourcesService) { }

  ngOnInit(): void {
    this.presentLoader()
    this.getAllData()
  }

  getAllData() {
    this.getAllDataSub = forkJoin([this.resourcesService.getAllSlidersSeries(),this.resourcesService.getMongoSerieResources()]).subscribe((([sliders,resources]) => {

      /* console.log('Sliders',sliders,'Resources',resources); */

      this.done = sliders
      this.todo = resources.filter((res)=>{

       const finded = sliders.find((slider:any)=> slider['_id'] == res['_id'])         

        if(finded) return false
        else return true
      }).sort((a, b) => a.name.localeCompare(b.name))

      console.log('Sliders',this.done,'Series',this.todo);
      
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


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  submit(){
    const data = this.done.map((d:any)=>{ return d['_id']})
    console.log("Slider", data);

    this.presentLoader()

    this.resourcesService.updateSerieSliders(data)
      .toPromise().then(((resp)=>{
        console.log(resp)
        this.getAllData()
      }))
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
