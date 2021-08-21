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
  selectable = true;
  removable = true;
  addOnBlur = true;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  artists = [
    {name: 'Leonardo Di Caprio'},
    {name: 'Jennifer Aninston'},
    {name: 'Vin Diesel'},
    {name: 'Jason Stanham'},
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<MoviesPopupComponent>,private fb: FormBuilder,) { }

  ngOnInit(): void {
    console.log('ngOnInitPopup', this.data.payload);

    this.buildItemForm(this.data.payload)
  }

  buildItemForm(item:any) {

    this.itemForm = new FormGroup({
      
      name: new FormControl('', [Validators.required]) ,
      description: new FormControl('', [Validators.required]),
      director:  new FormControl('', [Validators.required]),
      landscape_poster_url: new FormControl('', [Validators.required]),
      poster_url: new FormControl('', [Validators.required]),
      resource_file_name: new FormControl('', [Validators.required]),
      resource_file_url: new FormControl('', [Validators.required]),
      resource_trailer_file_name: new FormControl('', [Validators.required]),
      resource_trailer_file_url: new FormControl('', [Validators.required]),
      thumb: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required]),
      genders: new FormControl(''),
      artists: new FormControl(this.artists)
       /*  [ '', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]  */
    })

  }

   /* Funcion para setear FormControl en el mat-select  */
   public compareObjects(object1: any, object2: any) {
    return object1 && object2 && object1 == object2;
  }
 /* Funcion para setear FormControl en el mat-select  */

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
     console.log(this.itemForm.value); 
     /* this.dialogRef.close(this.itemForm?.value) */
   }

}
