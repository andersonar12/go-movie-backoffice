import { Component, OnInit,OnDestroy, Inject, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl,FormArray } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ResourceMovieM } from 'src/app/interfaces/interfaces';

interface Preview {
  [key: string] : any;
}

interface DataImages {
  [key: string] : any;
}

@Component({
  selector: 'app-update-chapters-popup',
  templateUrl: './update-chapters-popup.component.html',
  styleUrls: ['./update-chapters-popup.component.scss']
})
export class UpdateChaptersPopupComponent implements OnInit {

  public itemForm!: FormGroup;
  public seasons:any = []
  public seasonPick = ''
  public chapters:any = []
  public chapterPick = ''
  /* Estos son objetos para la validacion de carga de imagenes y previsualizacion */
  public dataImages:DataImages ={
    thumb_file:'',
  }
  
  public preview:Preview ={
    thumb_file:'',
  }
  /* Estos son objetos para la validacion de carga de imagenes y previsualizacion */
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<UpdateChaptersPopupComponent>,private fb: FormBuilder,private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    console.log('ngOnInitPopup', this.data.payload);
    this.seasons = this.data.payload.seasons


    /* this.buildItemForm(this.data.payload) */
  }

  buildItemForm(item:any) {
   
    this.itemForm = new FormGroup({
      _id:new FormControl(''),
      season_id:new FormControl(''),
      serie_id:new FormControl(this.data.payload._id),
      chapter_number: new FormControl(item.chapter_number,[Validators.required]),
      name: new FormControl( item.name ,[Validators.required] ),
      description: new FormControl(item.description,[Validators.required] ),
      year: new FormControl(  item.year ,[Validators.required]),
      score_average:new FormControl( item.score_average),
      thumb:new FormControl( item.thumb ),
      thumb_file: new FormControl(''),
      resource_file_url: new FormControl( item.resource_file_url,[Validators.required]),
      delete:new FormControl(true)
    })

  }

  public seasonPicked(value:any){
    const season = this.seasons.find((s:any)=>s._id == value)
    this.chapters = season['chapters']
    this.seasonPick = season['_id']
    
  }

  public chapterPicked(value:any){
    const chapterCurrent = this.chapters.find((s:any)=>s._id == value)
    this.chapterPick = chapterCurrent['_id']
    this.buildItemForm(chapterCurrent)

    this.preview['thumb_file'] = (chapterCurrent.hasOwnProperty('thumb')) ? chapterCurrent.thumb :''
  }

  uploadImagen(target: any,type:string){

    const file:File = target.files[0]

    if(!file){
      return;
    }

    //Si la imagen es png, jpg, jpeg... llamamos la funcion para convertir a .webp
    if (file['type'] !== 'image/webp') {
      this.convertImgToWebp(file,type)
      return
    }

    /* console.log('Original Image',file); */
    
    this.dataImages[`${type}`] = file;

    let reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onloadend = () => this.preview[`${type}`] = reader.result 
  }

  convertImgToWebp(file:any,type:string ) {
    if (!file) {
      return;
    }
    console.log('Original Image',file);

    let nameFile = file['name'].split('.')[0]
  
    // Load the data into an image
    new Promise( (resolve, reject)=> {
      let rawImage = new Image();
  
      rawImage.addEventListener("load",  ()=> {
        resolve(rawImage);
      });
  
      rawImage.src = URL.createObjectURL(file);
    })
    .then((rawImage:any)=> {
      // Convert image to webp ObjectURL via a canvas blob
      return new Promise((resolve, reject) => {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext("2d");
  
        canvas.width = rawImage.width;
        canvas.height = rawImage.height;
        ctx?.drawImage(rawImage, 0, 0);

        let blobFile:any
  
        canvas.toBlob((blob)=> {
          blobFile = blob
          resolve({imageURL:URL.createObjectURL(blob),blobFile});
        }, "image/webp");

      });
    })
    .then((resp:any)=> {

      let newFile = new File([resp.blobFile], nameFile, { lastModified: new Date().getTime(), type: "image/webp"})
          
      this.preview[`${type}`] = this.sanitizer.bypassSecurityTrustUrl(resp.imageURL) 
      console.log('File Webp', newFile);

      this.dataImages[`${type}`] = newFile;
    })
  }
  
  submit() {
    this.itemForm.value._id = this.chapterPick
    this.itemForm.value.season_id = this.seasonPick
   /*  console.log(this.itemForm?.value); */

    Object.entries(this.dataImages).forEach((key) =>{
      this.itemForm.value[`${key[0]}`] = key[1]
    })

    let body = this.itemForm?.value
    delete body.delete

    this.dialogRef.close(body)
   }

   deleteChapter(){
    this.itemForm.value._id = this.chapterPick
    this.itemForm.value.season_id = this.seasonPick
    this.dialogRef.close(this.itemForm.value)
   }


}
