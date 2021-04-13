import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { FotoService, Photo } from '../services/foto.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  // constructor(public fotoService : FotoService) {}
  // async ngOnInit(){
  //   await this.fotoService.loadFoto();
  // }
  // TambahFoto(){
  //   this.fotoService.tambahFoto();
  // }

  isiData : Observable<data[]>
  isiDataColl : AngularFirestoreCollection<data>

  Judul : string;
  Isi : string;
  Tanggal : string;
  Nilai : string;
  dateFormat : string;
  dataFoto : Photo;

    
    constructor(private afStorage :  AngularFireStorage, afs : AngularFirestore, public fotoService : FotoService) {
      this.isiDataColl = afs.collection('dataCoba')
      this.isiData = this.isiDataColl.valueChanges();
  }

  async TambahFoto(){
    this.dataFoto = await this.fotoService.tambahFoto(this.Judul);
  }

  simpan(){
    this.dateFormat = this.Tanggal.split('T')[0];

    
    this.isiDataColl.doc(this.Judul).set({
      judul : this.Judul,
      isi : this.Isi,
      tanggal : this.dateFormat,
      nilai : this.Nilai
    });

    const imgfilepath = `imgStorage/${this.dataFoto.filePath}`
    this.afStorage.upload(imgfilepath, this.dataFoto.dataImage).then(() =>{
      console.log(this.dataFoto)
    });
    alert("Notes terupload ke firebase")
  }

}

interface data{
  judul :string,
  isi : string,
  tanggal : string,
  nilai : string
  // foto : Photo
}
