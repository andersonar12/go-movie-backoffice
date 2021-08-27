import { Component, OnInit,OnDestroy, Inject, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl,FormArray } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { ResourceMovieM } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-update-seasons-popup',
  templateUrl: './update-seasons-popup.component.html',
  styleUrls: ['./update-seasons-popup.component.scss']
})
export class UpdateSeasonsPopupComponent implements OnInit {


  public itemForm!: FormGroup;
  public seasons:any = []



  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<UpdateSeasonsPopupComponent>,private fb: FormBuilder,) { }

  ngOnInit(): void {
    console.log('ngOnInitPopup', this.data.payload);
    this.seasons = this.data.payload.seasons


    /* this.buildItemForm(this.data.payload) */
  }

  buildItemForm(item:any) {
   
    this.itemForm = new FormGroup({
      _id:new FormControl(item._id),
      serie_id:new FormControl(this.data.payload._id,[Validators.required]),
      season_number: new FormControl(item.season_number|| '',[Validators.required]),
      name: new FormControl( item.name||'',[Validators.required] ),
      year: new FormControl(item.year|| '' ,[Validators.required]),
      delete:new FormControl(true)
    })

  }

  public seasonPicked(value:any){
    const seasonCurrent = this.seasons.find((s:any)=>s._id == value)
    this.buildItemForm(seasonCurrent)
  }

  
  submit() {
    /* console.log(this.itemForm?.value); */
    let body =  this.itemForm?.value
    delete body.delete
    this.dialogRef.close(body)
   }


}
