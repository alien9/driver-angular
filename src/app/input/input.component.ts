import { Component, OnInit } from '@angular/core';
import { RecordService } from '../record.service';
import { Router } from '@angular/router';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  private schema:object;
  public description:string;
  public tables: any[];
  public JSON: any;
  constructor(    
    private recordService: RecordService,
    private router: Router,
  ) {
    this.JSON = JSON;
  }

  ngOnInit(): void {
    let recordSchema=localStorage.getItem('record_schema');
    if(!recordSchema){
      this.router.navigateByUrl('/login?returnUrl=input');
      return;
    }
    this.schema=JSON.parse(recordSchema).schema;
    this.tables=Object.keys(this.schema['properties'])
      .sort((k, j)=>{return this.tables[k].propertyOrder-this.tables[j].propertyOrder})
      .map(k=>{return this.schema['definitions'][k]});
    this.tables.forEach(t=>{
      t['fields']=Object.keys(t.properties)
        .sort((k,j)=>t.properties[k].propertyOrder-t.properties[j].propertyOrder)
        .map(function(k){
          return {...{"key":k}, ...t.properties[k]};
        })
    })

    this.description=JSON.stringify(this.tables);
  }
  getRecordType(): string{
    return "";
  }
  ngAfterViewInit() {
  }
  //sortByPropertyOrder(props: object): array{

  //}
}
