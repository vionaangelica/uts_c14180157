import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FotoService, Photo } from '../services/foto.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  isiData : Observable<data[]>
  isiDataColl : AngularFirestoreCollection<data>

  judul;
  webPath;

  Isi : string;
  Tanggal : string;
  Nilai : string;
  dateFormat : string;
  dataFoto : Photo;

  newFoto : Photo;

  urlImageStorage : string[] = [];

  selectedData : data;

  constructor(private afStorage : AngularFireStorage, private afs : AngularFirestore, private route : ActivatedRoute, public fotoService : FotoService) {
    let title = this.route.snapshot.paramMap.get('judul')
    this.judul = title;
    this.isiDataColl = afs.collection('dataCoba')
    this.isiData = this.isiDataColl.valueChanges();
  }

  async ngOnInit() {
    await this.fotoService.loadFoto();
    
  }

  async ionViewDidEnter(){
    await this.fotoService.loadFoto();
    this.tampilkanData();
  }

  tampilkanData(){
    var refImage = this.afStorage.storage.ref('imgStorage');
      refImage.listAll().then((res) =>{
      res.items.forEach((itemRef) => {
        if(itemRef.name == this.judul){
          itemRef.getDownloadURL().then((url) => {
           this.webPath = url;
          });
        }
      })
    }).catch((error) => {
      console.log(error);
    })
  }

  hapus(){
    this.afs.collection(`dataCoba`).doc(this.judul).delete();
    var refImage = this.afStorage.storage.ref('imgStorage');
      refImage.listAll()
      .then((res) =>{
        res.items.forEach((itemRef) => {
          if(itemRef.name == this.judul){
          itemRef.delete().then(() => {
            alert("Notes telah dihapus")
          });
        }
        });
      }).catch((error) => {
        console.log(error);
      })
  }

  async TambahFoto(){
    this.newFoto = await this.fotoService.updateFoto(this.judul);
  }

  update(){
    this.dateFormat = this.Tanggal.split('T')[0];
    this.isiDataColl.doc(this.judul).update({
      isi : this.Isi,
      tanggal : this.dateFormat,  
      nilai : this.Nilai
    }).catch((error) => {
      console.log(error);
    })

    var refImage = this.afStorage.storage.ref('imgStorage');
    refImage.listAll()
    .then((res) =>{
      res.items.forEach((itemRef) => {
        if(itemRef.name == this.judul){
        itemRef.delete().then(() => {
        });
      }
      });
    }).catch((error) => {
      console.log(error);
    })

    const imgfilepath = `imgStorage/${this.newFoto.filePath}`
    this.afStorage.upload(imgfilepath, this.newFoto.dataImage).then(() =>{
      this.dataFoto = this.newFoto
      console.log(this.newFoto)
    }).catch((error) => {
    console.log(error);
  })

    alert("Notes sudah terupdate, tunggu sejenak/refresh untuk mengganti foto")
    this.fotoService.loadFoto();
    this.tampilkanData();
    // location.reload();

  }
}

interface data{
  judul :string,
  isi : string,
  tanggal : string,
  nilai : string
  // foto : Photo
}
