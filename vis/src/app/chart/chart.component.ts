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
  summary:any
  color: any

  constructor() {
    this.summary = [
      {'Season':'Winter','Min':100,'q1':100,'Median':150,'q3':200,'Max':250},
      {'Season':'Summer','Min':100,'q1':100,'Median':150,'q3':200,'Max':250},
      {'Season':'Fall/Spring','Min':100,'q1':100,'Median':150,'q3':200,'Max':250}
    ]
    this.color=["#553DD9","#EDAF49","#39B140"]
   }

  ngAfterViewInit(): void {
    
    var margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 390 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin + "," + margin + ")");

  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(this.summary.map((d:any) => d.Season))
    .paddingInner(1)
    .paddingOuter(.5)
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))

  
  var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0,720])
   
    svg.append("g")
    .call(d3.axisRight(y));

    // Build the verical lines
    svg
    .selectAll("vertLines")
    .data(this.summary)
    .enter()
    .append("line")
    .attr("x1", (d:any) => x(d.Season)!)
    .attr("x2", (d:any) => x(d.Season)!)
    .attr("y1", (d:any) => y(d.Min))
    .attr("y2", (d:any) => y(d.Max))
    .attr("stroke", "black")
    .style("width", 40)

  
  var boxWidth = 40

  // Build the boxes
  svg
  .selectAll("boxes")
  .data(this.summary)
  .enter()
  .append("rect")
  .attr("x", (d:any) => x(d.Season)!-boxWidth/2)
  .attr("y", (d:any) => y(d.q3))
  .attr("height", (d:any) => y(d.q1)-y(d.q3))
  .attr("width", boxWidth )
  .attr("stroke", "black")
  .attr("fill",(d:any,i:any)=>this.color[i])
  

  // Build the median lines
 
  svg
  .selectAll("medianLines")
  .data(this.summary)
  .enter()
  .append("line")
  .attr("x1", (d:any) => x(d.Season)!-boxWidth/2)
  .attr("x2", (d:any) => x(d.Season)!+boxWidth/2) 
  .attr("y1", (d:any) => y(d.Median))
  .attr("y2", (d:any) => y(d.Median))
  .attr("stroke", "black")
  .style("width", 40)

  }

  updateValues(values: any) {
    
     let data=JSON.parse(values)[0]
     
     this.summary[0]['Min'] = data['Winter']['min']
     this.summary[0]['q1'] = data['Winter']['25']
     this.summary[0]['Median'] = data['Winter']['50']
     this.summary[0]['q3'] = data['Winter']['75']
     this.summary[0]['Max'] = data['Winter']['max']

     this.summary[1]['Min'] = data['Summer']['min']
     this.summary[1]['q1'] = data['Summer']['25']
     this.summary[1]['Median'] = data['Summer']['50']
     this.summary[1]['q3'] = data['Summer']['75']
     this.summary[1]['Max'] = data['Summer']['max']

     this.summary[2]['Min'] = data['Fall/Spring']['min']
     this.summary[2]['q1'] = data['Fall/Spring']['25']
     this.summary[2]['Median'] = data['Fall/Spring']['50']
     this.summary[2]['q3'] = data['Fall/Spring']['75']
     this.summary[2]['Max'] = data['Fall/Spring']['max']

     console.log(this.summary)

    d3.selectAll("svg").remove()

    this.ngAfterViewInit()
  }

}
