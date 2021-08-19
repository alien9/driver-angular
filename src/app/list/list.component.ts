import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RecordService } from '../record.service';
import { ActivatedRoute } from '@angular/router';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public dataset: Array<object>
  @Output() record = new EventEmitter<object>()
  public uploading:boolean=false

  constructor(
    private recordService: RecordService,
    private locationService: LocationService,
    private router: Router,
    private r: ActivatedRoute,) {

  }

  ngOnInit(): void {
    let recordSchema = localStorage.getItem('record_schema');
    if (!recordSchema) {
      return;
    }
    let ds = localStorage.getItem("dataset");
    if (!ds) ds = '[]';
    this.dataset = JSON.parse(ds);
    let upload = this.r.snapshot.queryParamMap.get('upload')
    if (upload) {
      this.locationService.getPosition().then(pos => {
        console.log(`Position: ${pos.lng} ${pos.lat}`);
      });
      let d: any;
      while (d = this.dataset.pop()) {
        this.recordService.upload(d).subscribe(
          sata => {
            alert("OK")
            console.log(sata)
          }
        )
      }
    }
  }
  new(): void {
    console.log("new record")
    this.record.emit(null)
  }
  edit(item, index) {
    if(item["uploaded"]){
      console.log("Already uploaded, cannot edit anymore")
      return
    }
    item["index"]=index
    this.record.emit(item)
  }
  upload(){
    this.uploading=true
    let uploadable=this.dataset.filter((data)=>!data['uploaded'])
    
    if(uploadable.length>0){
      this.recordService.upload(uploadable[0])
      .subscribe(
        data => {
          console.log(data)
          uploadable[0]["status"]="OK"
          uploadable[0]["uploaded"]=true
          this.saveDataset()
          this.upload()
        },
        err => {
          console.log(err)
          uploadable[0]["status"]=err.data
          uploadable[0]["error"]=err.data
          uploadable[0]["uploaded"]=true
          this.saveDataset()
          this.upload()
        },
        () => {console.log('yay')}
      )
    }else{
      this.uploading=false
    }
  }
  isUploaded(item){
    return (item['uploaded'])?"grayed":"banal"
  }
  saveDataset(){
    localStorage.setItem("dataset", JSON.stringify(this.dataset));
  }
  cleanup() {
    this.dataset = this.dataset.filter((item) => !item['uploaded'])
    localStorage.setItem("dataset", JSON.stringify(this.dataset));
  }
}
