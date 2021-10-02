import { environment } from '../../environments/environment.prod';
import { DataService } from '../data.service';
import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import {Feature, Map, View} from 'ol';
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
import FeatureFormat from 'ol/format/Feature';
import Polygon from 'ol/geom/Polygon';
import {
  defaults as defaultInteractions,
} from 'ol/interaction';
import * as d3 from 'd3';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  map: any;
  coordinates: any;
  mousePosition: number[] = [0,0];
  values: any = {'Winter': {}, 'Summer': {}, 'Fall/Spring': {}};
  shadow_color: any
  @Output() onValues = new EventEmitter<string>();
  
  constructor(private dataService: DataService) { }
  

  ngAfterViewInit(): void {

    //
    const style = new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255)',
      }),
      stroke: new Stroke({
        color: '#319FD3',
        width: 2,
      }),
    });

    const sourceShadows = new VectorSource({
      url:'http://127.0.0.1:8080/network',
      format: new GeoJSON()
      })

      //vector layer1 shadow map lines

      const vectorLayer1 = new VectorLayer({
        source: sourceShadows,
        style: function (feature) {
         var mean = ((feature.getProperties()['chi-dec-21']/360)+(feature.getProperties()['chi-jun-21']/540)+(feature.getProperties()['chi-sep-22']/720)/3)
         var color = d3.interpolateBlues(mean)
          style.getStroke().setColor(color)
         return style

        },
      })

      const drawingSource = new VectorSource({
            useSpatialIndex: false
        })

        // Vector Layer 2 drawing layer

      const vectorLayer2 = new VectorLayer({
        source : drawingSource
      })


      const select = new Select({
        layers: [vectorLayer1, vectorLayer2],
        condition: click
      })
      const translate = new Translate({
        layers: [vectorLayer2]
      })

    // Building the map
    this.map = new Map({
      interactions: defaultInteractions().extend([translate]),
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://s.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png'
          })
        }),
          vectorLayer1,
          vectorLayer2,
      ],
      view: new View({
        center: transform([-87.6298, 41.8781], 'EPSG:4326', 'EPSG:3857'),
        zoom: 15,
      }),
    });

        // Drawing Source
        let draw: any 
        draw = new Draw({
          source: drawingSource,
          type: GeometryType.POLYGON
        });
        this.map.addInteraction(select)
        this.map.addInteraction(draw);

        
        
        /*console.log("features", select.getFeatures())*/
        /*select.on('select',(e)=>{
          //console.log("features" , select.getFeatures())
          let values : number [][] = []
          let polygon: any = vectorLayer2.getSource().getFeatures()[0].getGeometry()
          polygon.getCoordinates()[0].forEach((element:any) => {
            values.push(transform(element,'EPSG:3857','EPSG:4326'))
          });
          this.dataService.getDistribution(values).subscribe(data=>{
           this.values['Winter'] = data[0]['Winter']
           this.values['Summer'] = data[0]['Summer']
           this.values['Fall/Spring'] = data[0]['Fall/Spring']
           this.updateValues()
          })
          
        })*/
        
    // Functionality to be implemented after drawing has been finished
    draw.on('drawend',(event: any)=>{
      this.map.removeInteraction(draw);
      let values : number [][] = []
          
           let polygon: any = event.feature.getGeometry().getCoordinates()
        
           polygon[0].forEach((element:any) => {
          values.push(transform(element,'EPSG:3857','EPSG:4326'))
           });
          this.dataService.getDistribution(values).subscribe(data=>{
          this.values['Winter'] = data[0]['Winter']
          this.values['Summer'] = data[0]['Summer']
          this.values['Fall/Spring'] = data[0]['Fall/Spring']
          
          this.updateValues()
          
           
          })
    })

    // Functionality to be finished after finishing moving the polygon

    translate.on('translateend',(event:any) => {
      let values : number [][] = []
      let polygon: any = vectorLayer2.getSource().getFeatures()[0].getGeometry()
      polygon.getCoordinates()[0].forEach((element:any) => {
        values.push(transform(element,'EPSG:3857','EPSG:4326'))
      });
      this.dataService.getDistribution(values).subscribe(data=>{
       this.values['Winter'] = data[0]['Winter']
       this.values['Summer'] = data[0]['Summer']
       this.values['Fall/Spring'] = data[0]['Fall/Spring']
       //console.log(this.values)
       this.updateValues()
       
      })
    })
    

   
  
  }

  async updateValues() {
    //
    
    this.onValues.emit(JSON.stringify([this.values]))
  }

}
