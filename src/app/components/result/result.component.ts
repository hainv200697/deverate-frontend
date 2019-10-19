
declare var d3: any;
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { RankApiService } from 'src/app/services/rank-api.services';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  gaugemap = {};
  public powerGauge: any;
  ListRank: [];
  selectedDevice = "";
    
  constructor(private rankApi: RankApiService,
    ) {}
  
  ngOnInit() {
  
      this.radarChartType = 'radar';
      this.getAllRank(true);
      this.draw();
      this.onChangeRank(3);
  }
  getAllRank(status: boolean) {
    this.rankApi.getAllRank(status).subscribe(
      (data) => {
        this.ListRank = data['data']['data'];
      }
    );

  }

  onChangeRank(newValue) {
    console.log(newValue);
    this.selectedDevice = newValue;}

// Radar
public radarChartLabels: string[] = [
    'Software Requirement Analysis',
    'Software Development Methods',
    'Software Design Methods',
    'Software Quality Inspection',
    'Software Programming Methods',
    'Software Quality Inspection',
    'Specialized Software Technology'
];
public radarChartData: any = [
    { data: [65, 59, 90, 81, 56, 55, 40], label: 'Assessment Result' },
    { data: [28, 48, 40, 19, 96, 27, 100], label: 'DEV 2' }
];
public radarChartType: string;

public lineChartOptions: any = {
    responsive: true
};
public lineChartColors: Array<any> = [
    {
        // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
        // dark grey
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    {
        // grey
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
];
public lineChartLegend: boolean;
public lineChartType: string;

// events
public chartClicked(e: any): void {
    // console.log(e);
}

public chartHovered(e: any): void {
    // console.log(e);
}




draw() {
  var self = this;
 var gauge = function (container, configuration) {
 
   var config = {
     size: 710,
     clipWidth: 200,
     clipHeight: 110,
     ringInset: 20,
     ringWidth: 20,

     pointerWidth: 4,
     pointerTailLength: 2,
     pointerHeadLengthPercent: 0.9,

     minValue: 0,
     maxValue: 10,

     minAngle: -90,
     maxAngle: 90,

     transitionMs: 750,

     majorTicks: 5,
     labelFormat: d3.format('d'),
     labelInset: 10,

     arcColorFn: d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'))
   };
   var range = undefined;
   var r = undefined;
   var pointerHeadLength = undefined;
   var value = 0;

   var svg = undefined;
   var arc = undefined;
   var scale = undefined;
   var ticks = undefined;
   var tickData = undefined;
   var pointer = undefined;

   var donut = d3.pie();

   function deg2rad(deg) {
     return deg * Math.PI / 180;
   }

   function newAngle(d) {
     var ratio = scale(d);
     var newAngle = config.minAngle + (ratio * range);
     return newAngle;
   }

   function configure(configuration) {
     var prop = undefined;
     for (prop in configuration) {
       config[prop] = configuration[prop];
     }

     range = config.maxAngle - config.minAngle;
     r = config.size / 2;
     pointerHeadLength = Math.round(r *  
     config.pointerHeadLengthPercent);

     // a linear scale this.gaugemap maps domain values to a percent from 0..1
     scale = d3.scaleLinear()
       .range([0, 1])
       .domain([config.minValue, config.maxValue]);

     ticks = scale.ticks(config.majorTicks);
     tickData = d3.range(config.majorTicks).map(function () { return 1 / config.majorTicks; });

     arc = d3.arc()
       .innerRadius(r - config.ringWidth - config.ringInset)
       .outerRadius(r - config.ringInset)
       .startAngle(function (d, i) {
         var ratio = d * i;
         return deg2rad(config.minAngle + (ratio * range));
       })
       .endAngle(function (d, i) {
         var ratio = d * (i + 1);
         return deg2rad(config.minAngle + (ratio * range));
       });
   }
  // self.gaugemap.configure = configure;
  self.gaugemap['isRendered'] = isRendered;

   function centerTranslation() {
     return 'translate(' + r + ',' + r + ')';
   }

   function isRendered() {
     return (svg !== undefined);
   }
  // self.gaugemap.isRendered = isRendered;
   self.gaugemap['isRendered'] = isRendered;

   function render(newValue) {
     svg = d3.select(container)
       .append('svg:svg')
       .attr('class', 'gauge')
       .attr('width', config.clipWidth)
       .attr('height', config.clipHeight);

     var centerTx = centerTranslation();

     var arcs = svg.append('g')
       .attr('class', 'arc')
       .attr('transform', centerTx);

     arcs.selectAll('path')
       .data(tickData)
       .enter().append('path')
       .attr('fill', function (d, i) {
         return config.arcColorFn(d * i);
       })
       .attr('d', arc);

     var lg = svg.append('g')
       .attr('class', 'label')
       .attr('transform', centerTx);
     lg.selectAll('text')
       .data(ticks)
       .enter().append('text')
       .attr('transform', function (d) {
         var ratio = scale(d);
         var newAngle = config.minAngle + (ratio * range);
         return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - r) + ')';
       })
       .text(config.labelFormat);

     var lineData = [[config.pointerWidth / 2, 0],
     [0, -pointerHeadLength],
     [-(config.pointerWidth / 2), 0],
     [0, config.pointerTailLength],
     [config.pointerWidth / 2, 0]];
     var pointerLine = d3.line().curve(d3.curveLinear)
     var pg = svg.append('g').data([lineData])
       .attr('class', 'pointer')
       .attr('transform', centerTx);

     pointer = pg.append('path')
       .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/)
       .attr('transform', 'rotate(' + config.minAngle + ')');

     update(newValue === undefined ? 0 : newValue);
   }
   //self.gaugemap.render = render;
   self.gaugemap['render'] = render;

   function update(newValue, newConfiguration?) {
     if (newConfiguration !== undefined) {
       configure(newConfiguration);
     }
     var ratio = scale(newValue);
     var newAngle = config.minAngle + (ratio * range);
     pointer.transition()
       .duration(config.transitionMs)
       .ease(d3.easeElastic)
       .attr('transform', 'rotate(' + newAngle + ')');
   }
   //self.gaugemap.update = update;
   self.gaugemap['update'] = update;
   configure(configuration);

   return self.gaugemap;
 };

 this.powerGauge = gauge('#power-gauge', {
   size: 300,
   clipWidth: 400,
   clipHeight: 300,
   ringWidth: 60,
   maxValue: 10,
   transitionMs: 3000,
 });
// powerGauge.render(6);
 this.powerGauge.render();
  this.powerGauge.update(6);

}
  
}