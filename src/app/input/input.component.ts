import { Component, OnInit } from '@angular/core';
import { RecordService } from '../record.service';
import { Router } from '@angular/router';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { FormControl, FormGroup } from '@angular/forms';
import * as $ from "jquery";
import { v4 as uuid } from 'uuid';
import { flattenDiagnosticMessageText } from 'typescript';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  private schema:object;
  private schema_uuid:string;
  public description:string;
  public tables: any[];
  public JSON: any;
  public registry: object;
  date: object;
  time: object;
  constructor(    
    private recordService: RecordService,
    private router: Router,
  ) {
    this.JSON = JSON;
    this.registry={
      'data':{}
    };

 }

  ngOnInit(): void {
    let recordSchema=localStorage.getItem('record_schema');
    if(!recordSchema){
      this.router.navigateByUrl('/login?returnUrl=input');
      return;
    }
    this.date = new FormGroup({
      date: new FormControl()
    });
    this.time = new FormGroup({
      time: new FormControl()
    });
    this.schema=JSON.parse(recordSchema);
    this.schema_uuid=this.schema['uuid'];
    this.schema=this.schema['schema'];
    let data={};

    this.tables=Object.keys(this.schema['properties'])
      .sort((k, j)=>{return this.schema['definitions'][k].propertyOrder-this.schema['definitions'][j].propertyOrder})
    this.tables.forEach(t=>{
      data[t]=(this.schema['definitions'][t].multiple)?[]:{};
      let defs=this.schema['definitions'][t]
      defs['fields']=Object.keys(defs.properties)
        .sort((k,j)=>defs.properties[k].propertyOrder-defs.properties[j].propertyOrder)
        .map(function(k){
          return {...{"key":k}, ...defs.properties[k]};
        })
    })
    this.registry['data']=data;
    this.description=JSON.stringify(this.tables);



  }
  getRecordType(): string{
    return "";
  }
  ngAfterViewInit() {
  }
  cancel(): void {
    window.location.href="/list";
  }
  add(t){
    console.log({"_LocalId":uuid()});
    this.registry['data'][t].push({"_LocalId":uuid()});
  }
  write(){
    if(!this.date['value'].date)
      return
    if(!this.time['value'].time)
      return
    
    let t=this.time['value'].time.split(/\s|:/)
    
    let d=this.date['value'].date
    d.setHours(Math.round(t[0])+((t[2]=="AM")?0:12))
    d.setMinutes(t[1])
   
    
    this.registry['occurred_from']=d.toISOString()
    this.registry['occurred_to']=d.toISOString()
    this.registry['schema']=this.schema_uuid

    console.log(this.registry);
    let r = this.registry;
    this.tables.forEach(t=>{
      let i=0;
      if(this.schema['definitions'][t].multiple){
        //r['data'][t]=[]
        $('div.'+t+' .item').each(function(y){
          let v={}
          $(this).find('input').each(function(z){
            v[$(this).attr('name')]=$(this).val();  
          })
          $(this).find('.selectable').each(function(y){
            v[$(this).attr('id')]=$(this).find('.mat-select-value-text span').text();
          });
          r['data'][t][i]=v;
          i++;  
        })
      }else{
        r['data'][t]={"_LocalId":uuid()}
        $('.'+t+' input').each(function(y){
          r['data'][t][$(this).attr('name')]=$(this).val();
        });
        $('.'+t+' .selectable').each(function(y){
          r['data'][t][$(this).attr('id')]=$(this).find('.mat-select-value-text span').text();
        }); 
      } 
    })
    let ds=localStorage.getItem("dataset");
    if(!ds) ds='[]';
    let dataset=JSON.parse(ds);
    dataset.push(this.registry);    
    localStorage.setItem("dataset", JSON.stringify(dataset));
    window.location.href="/list";   
  }
}
