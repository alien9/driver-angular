import { Component, OnInit } from '@angular/core';
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
  public dataset: Array<object>;
  constructor(    
    private recordService: RecordService,
    private locationService: LocationService,
    private router: Router,
    private r: ActivatedRoute,) { 

    }

  ngOnInit(): void {
    let recordSchema=localStorage.getItem('record_schema');
    if(!recordSchema){
      this.router.navigateByUrl('/login?returnUrl=list');
      return;
    }
    let ds=localStorage.getItem("dataset");
    if(!ds) ds='[]';
    this.dataset=JSON.parse(ds);
    let upload=this.r.snapshot.queryParamMap.get('upload')
    if(upload){
      this.locationService.getPosition().then(pos=>
        {
           console.log(`Positon: ${pos.lng} ${pos.lat}`);
        });
      let d: any;
      while(d=this.dataset.pop()){
        this.recordService.upload(d).subscribe(
          sata=>{
              alert("OK")
              console.log(sata)
          }
        )
      }
    }
  }
  new(): void {
    window.location.href='/input'
  }

}
