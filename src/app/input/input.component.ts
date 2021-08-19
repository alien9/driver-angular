import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { RecordService } from '../record.service';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
  @Input() existingRecord;
  private schema: object;
  private schema_uuid: string;
  public description: string;
  public tables: any[];
  public JSON: any;
  public registry: object;
  public pane: string = 'listing'
  public locating: boolean = false
  public listing: boolean = true
  public inputing: boolean = false;
  public title: string = "..."
  public validationErrorMessage: string
  private mess: string = ""
  private latitude: number;
  private longitude: number;
  public clock: string = ''
  private index: number
  private recordIndex: number
  date: Date;
  @ViewChild('form') mainForm;
  constructor(
    private recordService: RecordService,
    private router: Router,
    private authenticationService: AuthService,
  ) {
    this.JSON = JSON;
    this.registry = {
      'data': {}
    };

  }

  ngOnInit(): void {
    console.log("inicialtis-zing")
    this.initDataset()
  }
  loadRecordSchema() {
    let recordSchema = localStorage.getItem('record_schema');
    if (!recordSchema) {
      this.pane = 'login'
      return;
    }
    this.schema = JSON.parse(recordSchema);
    this.schema_uuid = this.schema['uuid'];
    this.schema = this.schema['schema'];
  }
  initDataset() {
    this.loadRecordSchema()
    if (!this.schema) return
    let data = {};
    this.tables = Object.keys(this.schema['properties'])
      .sort((k, j) => { return this.schema['definitions'][k].propertyOrder - this.schema['definitions'][j].propertyOrder })
    this.tables.forEach(t => {
      data[t] = (this.schema['definitions'][t].multiple) ? [] : { "_localId": uuid() };
      let defs = this.schema['definitions'][t]
      defs['fields'] = Object.keys(defs.properties)
        .sort((k, j) => defs.properties[k].propertyOrder - defs.properties[j].propertyOrder)
        .map(function (k) {
          return { ...{ "key": k }, ...defs.properties[k] };
        })
    })
    this.registry['data'] = data;
    this.description = JSON.stringify(this.tables);
  }

  getRecordType(): string {
    return "";
  }
  ngAfterViewInit() {

  }
  cancel(): void {
    this.pane = 'listing'
  }
  add(t) {
    this.registry['data'][t].push({ "_localId": uuid() });
  }
  pop(t) {
    this.registry['data'][t].pop();
  }
  write() {
    if (!this.date)
      return
    if (!this.clock)
      return

    let t = this.clock.split(/\s|:/).map((y) => parseInt(y))

    let d = this.date
    d.setHours(t[0])
    d.setMinutes(t[1])

    //this.registry['geom'] = `"SRID=4326;POINT{lng} {lat})"`
    this.registry['occurred_from'] = d.toISOString()
    this.registry['occurred_to'] = d.toISOString()
    this.registry['schema'] = this.schema_uuid
    this.registry["geom"] = `SRID=4326;POINT(${this.longitude} ${this.latitude})`
    console.log(this.registry);
    let r = this.registry;
    let ds = localStorage.getItem("dataset");
    if (!ds) ds = '[]';
    let dataset = JSON.parse(ds);
    if (typeof this.index == 'number')
      dataset[this.index] = this.registry
    else
      dataset.push(this.registry);
    localStorage.setItem("dataset", JSON.stringify(dataset));
    this.pane = 'listing'
  }
  isValid() {
    if (!this.date)
      return false
    if (!this.clock)
      return false
    if (!this.latitude || !this.longitude)
      return false
    let v = true
    this.mess = "..."
    Object.entries(this.schema['definitions']).forEach(([key, definition]) => {
      let tablename = definition['title']
      if (definition['multiple']) {
        //console.log(key)
      } else {
        Object.entries(definition['properties']).filter(([nk, fu]) => definition['required'].indexOf(nk) >= 0).forEach((f) => {
          if (!this.registry['data'][key]) {
            this.mess = `validation error: ${key}`
            v = false
          } else if (!this.registry['data'][key][f[0]]) {
            this.mess = `validation error: ${tablename} / ${f[0]}`
            v = false
          }
        })
      }
    })
    return v
  }
  locate() {
    this.pane = "locating"
  }
  setLocation(p) {
    this.pane = "inputing"
    console.log("SETTING LOCATION")
    if (p) {
      this.latitude = p.lat
      this.longitude = p.lng
    }
  }
  loadRecord(e: any) {
    console.log("Loading")
    if (e) {
      this.loadRecordSchema()
      this.title = "Edit Record"
      this.registry = e
      this.index = e.index
      delete e.index
      this.date = new Date(Date.parse(e['occurred_from']))
      this.clock = `${this.date.getHours()}:${this.date.getMinutes()}`
      if (e.geom) {
        let cords = e.geom.match(/POINT\((\S+) (\S+)\)/)
        if (cords.length > 0) {
          this.longitude = cords[1]
          this.latitude = cords[2]
        }
      }
    } else {
      this.title = "New Record"
      this.initDataset()
      this.clock = null
      this.date = null
      this.index = null
      this.latitude = null
      this.longitude = null
    }
    this.pane = 'inputing'
  }
  setTime(e) {
    console.log("setting time")
    console.log(e)
    this.clock = e
  }
  setDate(e) {
    if (e) {
      this.date = e.value
    }
    console.log("setting date")
    console.log(e)
  }
  list() {
    this.pane = 'listing'
  }
  logout() {
    this.authenticationService.logout();
    this.pane = 'login'
  }

}
