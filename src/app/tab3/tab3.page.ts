import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  isiData : Observable<data[]>
  isiDataColl : AngularFirestoreCollection<data>

  Judul : string;
  Isi : string;

    
    constructor(afs : AngularFirestore) {
      this.isiDataColl = afs.collection('dataCoba')
      this.isiData = this.isiDataColl.valueChanges();
  }

  simpan(){
    this.isiDataColl.doc(this.Judul).set({
      judul : this.Judul,
      isi : this.Isi
    });
  }

}

interface data{
  judul :string,
  isi : string
}
