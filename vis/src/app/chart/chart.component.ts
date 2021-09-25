import { Component, AfterViewInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit {
  boxPlot: any;
  @Input() values:any;

  constructor() { }

  ngAfterViewInit(): void {
    //
  }

  updateValues(values: any) {
    //
  }

}
