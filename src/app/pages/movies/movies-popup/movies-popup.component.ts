import { Component, OnInit,OnDestroy, Inject, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips'

@Component({
  selector: 'app-movies-popup',
  templateUrl: './movies-popup.component.html',
  styleUrls: ['./movies-popup.component.scss']
})
export class MoviesPopupComponent implements OnInit {
  public itemForm!: FormGroup;
  public genders = []
  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public settings = {};
  
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
    this.genders = this.data.genders
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
      landscape_poster_url: new FormControl(item.landscape_poster_url || '', [Validators.required]),
      poster_url: new FormControl(item.poster_url || '', [Validators.required]),
      resource_file_name: new FormControl(item.resource_file_name || '', ),
      resource_file_url: new FormControl(item.resource_file_url || '', [Validators.required]),
      resource_trailer_file_name: new FormControl(item.resource_trailer_file_name || '', ),
      resource_trailer_file_url: new FormControl(item.resource_trailer_file_url || '', [Validators.required]),
      thumb: new FormControl(item.thumb || '', [Validators.required]),
      year: new FormControl(item.year || '', [Validators.required,Validators.minLength(4)]),
      genders: new FormControl(  genders ||'', [Validators.required]),
      artists: new FormControl( this.artists, [Validators.required])
       /*  [ '', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]  */
    })

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

  submit() {

    if (this.itemForm.value.genders.length > 0){

      this.itemForm.value.genders = this.itemForm.value.genders.map((gender:any)=>{
        return gender.name
      })
    }
 
     this.dialogRef.close(this.itemForm?.value)
   }

}
