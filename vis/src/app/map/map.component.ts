import { environment } from '../../environments/environment.prod';
import { DataService } from '../data.service';
import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import {Map, View} from 'ol';
import {Image as ImageLayer, Tile as TileLayer, Vector} from 'ol/layer';
import {transform} from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import {Fill, Stroke, Circle, Style} from 'ol/style';
import {interpolateBlues} from 'd3-scale-chromatic';
import {Draw, Select, Translate} from 'ol/interaction';
import GeometryType from 'ol/geom/GeometryType';
import {shiftKeyOnly, click} from 'ol/events/condition';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  map: any;
  coordinates: any;
  mousePosition: number[] = [0,0];
  values: any = {'Winter': 0, 'Summer': 0, 'Fall/Spring': 0};
  @Output() onValues = new EventEmitter<string>();
  
  constructor(private dataService: DataService) { }

  ngAfterViewInit(): void {
    //
  }

  async updateValues() {
    //
  }

}
