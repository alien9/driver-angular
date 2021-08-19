import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import * as L from 'leaflet';
import { Gps } from 'node_modules/leaflet-gps'
import { environment } from '../../environments/environment';

const iconRetinaUrl = './assets/marker-icon-2x.png';
const iconUrl = './assets/marker-icon.png';
const shadowUrl = './assets/marker-shadow.png';
const iconDefault = L.icon({
iconRetinaUrl,
iconUrl,
shadowUrl,
iconSize: [25, 41],
iconAnchor: [12, 41],
popupAnchor: [1, -34],
tooltipAnchor: [16, -28],
shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  osm: L.TileLayer;
  options: any;
  layersControl: any;
  layers: any=[];
  controlOptions: any;
  position: L.LatLng
  @Input() latitude: number
  @Input() longitude: number
  
  constructor() { }

  @Output() locateEvent = new EventEmitter<object>();
  ngOnInit(): void {
    console.log("init locate")
    this.osm=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });
    let center=[-23.5, -46.6]
    if(this.latitude && this.longitude){
      center=[this.latitude, this.longitude]
    }else if(localStorage.getItem("position")){
      center=(localStorage.getItem("position")).split(/\t/).map((item)=>parseFloat(item))
    }
    this.controlOptions={collapsed:true};
    this.options = {
      zoom: 16,
      center: center,
      layers:[
        this.osm
      ]
    }
    this.layersControl={
      baseLayers: {
        'Open Street Map': this.osm
      }, overlays:{

      }
    }
    if(this.latitude && this.longitude){
      this.setLocation({
        "latlng":new L.LatLng(this.latitude,this.longitude)
      })
    }
  }
  setLocation(e){
    this.position=e.latlng
    this.layers=[new L.Marker([ this.position.lat, this.position.lng ])];
    console.log(this.layers)
  }
  save(){
    this.locateEvent.emit(this.position)
  }
  cancel(){
    this.locateEvent.emit(null)
  }
  onMapReady(map){
    var gps = new Gps({
      autoActive:true,
      autoCenter:true
    })
    map.addControl(gps )
  }
}
