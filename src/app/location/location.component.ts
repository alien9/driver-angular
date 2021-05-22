import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { environment } from '../../environments/environment';

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
  constructor() { }

  ngOnInit(): void {
    this.osm=L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' });

    this.controlOptions={collapsed:true};
    this.options = {
      zoom: environment.zoom,
      center: environment.center,
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
  }

}
