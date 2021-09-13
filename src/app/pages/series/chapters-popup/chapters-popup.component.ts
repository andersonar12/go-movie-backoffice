import { Component, OnInit,OnDestroy, Inject, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl,FormArray } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { ResourceMovieM } from 'src/app/interfaces/interfaces';

interface Preview {
  [key: string] : any;
}

interface DataImages {
  [key: string] : any;
}

@Component({
  selector: 'app-chapters-popup',
  templateUrl: './chapters-popup.component.html',
  styleUrls: ['./chapters-popup.component.scss']
})
export class ChaptersPopupComponent implements OnInit {

  public series : Array<ResourceMovieM> = []
  public chapterNumber =''
  public seasons:any = []
  public itemForm!: FormGroup;
  public settings = {};

  /* Estos son objetos para la validacion de carga de imagenes y previsualizacion */
  public dataImages:DataImages ={
    thumb_file:'',
  }
  
  public preview:Preview ={
    thumb_file:'',
  }
  /* Estos son objetos para la validacion de carga de imagenes y previsualizacion */

  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<ChaptersPopupComponent>,private fb: FormBuilder,) { }

  ngOnInit(): void {
    console.log('ngOnInitPopup', this.data.payload);
    this.series = this.data.payload

    if (Object.keys(this.data.payload).length > 0) {

      this.preview['thumb_file'] = (this.data.payload.hasOwnProperty('thumb')) ? this.data.payload.thumb :''
    }

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
      season_id:new FormControl('',[Validators.required]),
      serie_id:new FormControl('',[Validators.required]),
      chapter_number: new FormControl(''),
      name: new FormControl(  '',[Validators.required] ),
      description: new FormControl('',[Validators.required] ),
      year: new FormControl(  '' ,[Validators.required]),
      score_average:new FormControl( '' ),
      thumb:new FormControl( '' ),
      thumb_file: new FormControl(''),
      resource_file_url: new FormControl( '' ,[Validators.required]),
    })
  }

  public onItemSelect(item: any) {

    const serie = this.series.find(s=>s._id == item._id)
    this.seasons = serie!['seasons']
    this.chapterNumber = ''
   /*  console.log(serie); */
  }

  public seasonPicked(value:any){
    const seasonCurrent = this.seasons.find((s:any)=>s._id == value)
    /* const length = (serie?.seasons?.length!) + 1 */
    this.chapterNumber = (seasonCurrent.chapters.length + 1).toString()
  }

  uploadImagen(target: any,type:string){

    const file:File = target.files[0]

    if(!file){
      return;
    }

    /* console.log(file); */

    this.dataImages[`${type}`] = file;

    let reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onloadend = () => this.preview[`${type}`] = reader.result 
  }
  submit() {

    Object.entries(this.dataImages).forEach((key) =>{
      this.itemForm.value[`${key[0]}`] = key[1]
    })
    
    this.itemForm.value.chapter_number = this.chapterNumber
    /* console.log(this.itemForm?.value); */
     this.dialogRef.close(this.itemForm?.value)
   }


}
