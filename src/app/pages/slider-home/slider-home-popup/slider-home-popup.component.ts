import { Component, OnInit,OnDestroy, Inject, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips'

@Component({
  selector: 'app-slider-home-popup',
  templateUrl: './slider-home-popup.component.html',
  styleUrls: ['./slider-home-popup.component.scss']
})
export class SliderHomePopupComponent implements OnInit {



  public itemForm!: FormGroup;
  public img_preview!:string;
  public isChecked = true;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<SliderHomePopupComponent>,private fb: FormBuilder,) { }

  ngOnInit(): void {
    console.log('ngOnInitPopup', this.data.payload);
 
  
    this.buildItemForm(this.data.payload)
    this.img_preview = this.data.payload.img_url
  }

  buildItemForm(item:any) {

    
    this.itemForm = new FormGroup({
      id:new FormControl( item.id || '' ),
      title: new FormControl(item.title || '', [Validators.required]),
      order:new FormControl(item.order || '', [Validators.required]),
      description: new FormControl(item.description || '', [Validators.required]),
      image: new FormControl( '', (this.data.title == 'Añadir Slider') ? Validators.required : undefined),
      status: new FormControl(item.status || false ),
      link_1: new FormControl(item.link_1 || ''),
      link_2: new FormControl(item.link_2 || ''),
    })

  }


  subirArchivo(target: any){

    const file:File = target.files[0]

    if(!file){
      return;
    }

    /* console.log(file); */

    this.itemForm.value.image = file;
    let reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onloadend = () => this.img_preview = reader.result || this.data.payload.img_url;
  }



  submit() {

    /* console.log(this.itemForm?.value); */
 
     this.dialogRef.close(this.itemForm?.value)
   }
}
