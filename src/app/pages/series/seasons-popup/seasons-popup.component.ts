import { Component, OnInit,OnDestroy, Inject, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl,FormArray } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { ResourceMovieM } from 'src/app/interfaces/interfaces';


@Component({
  selector: 'app-seasons-popup',
  templateUrl: './seasons-popup.component.html',
  styleUrls: ['./seasons-popup.component.scss']
})
export class SeasonsPopupComponent implements OnInit {
  public series : Array<ResourceMovieM> = []
  public seasonPicked =''
  public itemForm!: FormGroup;
  public settings = {};
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<SeasonsPopupComponent>,private fb: FormBuilder,) { }

  ngOnInit(): void {
    console.log('ngOnInitPopup', this.data.payload);
    this.series = this.data.payload

    this.settings = {
      singleSelection: true,
      idField: '_id',
      textField: 'name',
      enableCheckAll: false,
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 100,
      itemsShowLimit: 1,
      searchPlaceholderText: 'Buscar Serie',
      noDataAvailablePlaceholderText: 'Sin resultados',
      closeDropDownOnSelection: true,
      showSelectedItemsAtTop: false,
      defaultOpen: false
    };

    this.buildItemForm()
  }

  buildItemForm() {

    this.itemForm = new FormGroup({
      serie_id:new FormControl('',[Validators.required]),
      season_number: new FormControl(''),
      name: new FormControl(  '',[Validators.required] ),
      description: new FormControl( '',[Validators.required] ),
      year: new FormControl(  '' ,[Validators.required]),
      score_average:new FormControl( '' ),
      chapters: new FormControl([])
    })

  }

  public onItemSelect(item: any) {

    const serie = this.series.find(s=>s._id == item._id)
    const length = (serie?.seasons?.length!) + 1
    
    this.seasonPicked = length.toString()
   /*  console.log(serie); */
  }

  submit() {
    this.itemForm.value.season_number = this.seasonPicked
   /*  console.log(this.itemForm?.value); */
     this.dialogRef.close(this.itemForm?.value)
   }


}
