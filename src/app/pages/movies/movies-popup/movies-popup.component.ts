import { Component, OnInit,OnDestroy, Inject, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips'


interface Preview {
  [key: string] : any;
}

interface DataImages {
  [key: string] : any;
}

@Component({
  selector: 'app-movies-popup',
  templateUrl: './movies-popup.component.html',
  styleUrls: ['./movies-popup.component.scss']
})
export class MoviesPopupComponent implements OnInit {

  public dataJson = {}

  public itemForm!: FormGroup;
  public genders = []
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public settings = {};


  /* Estos son objetos para la validacion de carga de imagenes y previsualizacion */
  public dataImages:DataImages ={
    poster_file : '',
    landscape_poster_file:'',
    thumb_file:'',
  }
  
  public preview:Preview ={
    poster_file : '',
    landscape_poster_file:'',
    thumb_file:'',
  }
  /* Estos son objetos para la validacion de carga de imagenes y previsualizacion */

  @ViewChild('multiSelect') multiSelect:any;
  @ViewChild('chipList') chipList:any;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  artists = [
    {name: 'Inserta un actor'},
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<MoviesPopupComponent>,private fb: FormBuilder,) { }

  ngOnInit(): void {
    console.log('ngOnInitPopup', this.data.payload);
    this.dataJson = this.data.payload
    this.genders = this.data.genders


    /*Asiganmos los source para la Previsualizacion de imagenes */

    if (Object.keys(this.data.payload).length > 0) {

      this.preview['poster_file'] = (this.data.payload.hasOwnProperty('poster_url')) 
                                    ?  this.data.payload.poster_url : ''

      this.preview['landscape_poster_file'] = (this.data.payload.hasOwnProperty('landscape_poster_url')) ? this.data.payload.landscape_poster_url : ''

      this.preview['thumb_file'] = (this.data.payload.hasOwnProperty('thumb')) ? this.data.payload.thumb :''
    }

    /* Asiganmos los sorce para la Previsualizacion de imagenes  */
    /* Settings del Ng-dropdown  */
    this.settings = {
      singleSelection: false,
      idField: '_id',
      textField: 'name',
      enableCheckAll: false,
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 100,
      itemsShowLimit: 5,
      searchPlaceholderText: 'Buscar Genero',
      noDataAvailablePlaceholderText: 'Sin resultados',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false
    };
    /* Settings del Ng-dropdown  */

    this.buildItemForm(this.data.payload)
  }

  buildItemForm(item:any) {

    let genders
    if (Object.keys(item).length === 0) {
      this.artists =this.artists 
    } else {
      this.artists = item.artists 
      genders = [...item.genders.map((g: any)=> {
        
        return {_id:g['_id'],name:g['name']}
      })]
    }
     

    
    this.itemForm = new FormGroup({
      id_:new FormControl( item._id || '' ),
      name: new FormControl(item.name || '', [Validators.required]) ,
      description: new FormControl(item.description || '', [Validators.required]),
      director:  new FormControl (item.director ||'', [Validators.required]),
      duration: new FormControl(item.duration || '', [Validators.required]),
      landscape_poster_url: new FormControl(item.landscape_poster_url || ''),
      landscape_poster_file: new FormControl(''),
      poster_url: new FormControl(item.poster_url || '', ),
      poster_file: new FormControl(''),
      resource_file_name: new FormControl(item.resource_file_name || '', ),
      resource_file_url: new FormControl(item.resource_file_url || '', [Validators.required]),
      resource_trailer_file_name: new FormControl(item.resource_trailer_file_name || '', ),
      resource_trailer_file_url: new FormControl(item.resource_trailer_file_url || '', [Validators.required]),
      thumb: new FormControl(item.thumb || '',),
      thumb_file: new FormControl(''),
      score_average: new FormControl(item.score_average || '', [Validators.max(5),Validators.min(0),this.ValidateMultiplo]),
      year: new FormControl(item.year || '', [Validators.required,Validators.minLength(4)]),
      genders: new FormControl(  genders ||'', [Validators.required]),
      artists: new FormControl( this.artists, [Validators.required])
       /*  [ '', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]  */
    })

  }

  ValidateMultiplo(control: AbstractControl): {[key: string]: any} | null  {
    if (control.value == 0 ||control.value == 0.5 ||control.value == 1 ||control.value == 1.5 ||control.value == 2 || control.value == 2.5 ||control.value == 3 ||control.value == 3.5 ||control.value == 4||control.value == 4.5 ||control.value == 5 ) {
      return null
    }

    return { 'multiploinValid': true };
  }

  public onItemSelect(item: any) {
    /* console.log(item); */
  }

  public onFilterChange(item: any) {
    console.log(item);
  }
  public onDropDownClose(item: any) {
    console.log(item);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our item
    if (value) {
      this.artists.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(artist:any) {
    const index = this.artists.indexOf(artist);

    if (index >= 0) {
      this.artists.splice(index, 1);
    }
  }

  exportJSON(){
    let dataStr = JSON.stringify(this.dataJson, null, "\t");
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'movie.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
    
    /* console.log(this.dataImages); */
    /* En el objeto dataImages se almacena la info de tipo File asociados a las imagenes */
    Object.entries(this.dataImages).forEach((key) =>{
      this.itemForm.value[`${key[0]}`] = key[1]
    })

    if (this.itemForm.value.genders.length > 0){
      this.itemForm.value.genders = this.itemForm.value.genders.map((gender:any)=>{
        return gender.name
      })
    }

    console.log(this.itemForm?.value);
     this.dialogRef.close(this.itemForm?.value)
   }

}
