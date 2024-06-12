import { Component, OnInit, ViewChild } from '@angular/core';
import { PSRService } from 'src/app/service/project-status-report.service';
import { ChartOptions, ChartType, ChartDataSets, RadialChartOptions } from 'chart.js';
import { Label, Color, SingleDataSet } from 'ng2-charts';


import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexGrid,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexMarkers,
  ApexStroke,
  ApexLegend,
  ApexTooltip,
  ApexDataLabels,
  ApexFill,
  ApexPlotOptions,
  ApexResponsive,
  ApexNonAxisChartSeries,
  ApexTitleSubtitle,
} from "ng-apexcharts";

export type ChartOptions1 = {
  series: ApexAxisChartSeries;
  nonAxisSeries: ApexNonAxisChartSeries;
  colors: string[];
  grid: ApexGrid;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  markers: ApexMarkers,
  stroke: ApexStroke,
  legend: ApexLegend,
  responsive: ApexResponsive[],
  tooltip: ApexTooltip,
  fill: ApexFill
  dataLabels: ApexDataLabels,
  plotOptions: ApexPlotOptions,
  labels: string[],
  title: ApexTitleSubtitle
};

@Component({
  selector: 'app-informe-psr',
  templateUrl: './informe-psr.component.html',
  styleUrls: ['./informe-psr.component.scss']
})

export class InformePsrComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;

  public barChartOptions: Partial<ChartOptions>;
  public lineChartOptions: Partial<ChartOptions>;
  public areaChartOptions: Partial<ChartOptions>;
  public mixedChartOptions: Partial<ChartOptions>;
  public donutChartOptions: Partial<ChartOptions>;
  public pieChartOptions: Partial<ChartOptions>;
  public heatMapChartOptions: Partial<ChartOptions>;
  public radarChartOptions: Partial<ChartOptions>;
  public scatterChartOptions: Partial<ChartOptions>;
  public radialBarChartOptions: Partial<ChartOptions>;

  valoresEjeX: any[] = []
  valoresEjeY: any[] = []
  results: any[] = []
  chart1DataReady = false
  chart2DataReady = false
  optionsRadios

  constructor(private psrService: PSRService) {
  }

  //Grafico uno
  public lineChartData1: ChartDataSets[];
  public lineChartLabels1: Label[];
  public lineChartOptions1: ChartOptions = {
    responsive: true,
  };
  public lineChartColors1: Color[] = [
    {
      borderColor: '#7ee5e5',
      backgroundColor: 'rgba(0,0,0,0)',
    },
    {
      borderColor: '#f77eb9',
      backgroundColor: 'rgba(0,0,0,0)',
    }
  ];
  public lineChartLegend1 = true;
  public lineChartType1: ChartType = 'line';
  public lineChartPlugins1 = [];

  //Grafico dos
  public lineChartData2: ChartDataSets[];
  public lineChartLabels2: Label[];
  public lineChartOptions2: ChartOptions = {
    responsive: true,
  };
  public lineChartColors2: Color[] = [
    {
      borderColor: '#DF013A',
      backgroundColor: 'rgba(0,0,0,0)',
    },
    {
      borderColor: '#DF013A',
      backgroundColor: 'rgba(0,0,0,0)',
    }
  ];
  public lineChartLegend2 = true;
  public lineChartType2: ChartType = 'line';
  public lineChartPlugins2 = [];

  ngOnInit(): void {
    this.getEjeX().then(function (item1) {
    })

    this.getEjeX().then(item1 => {
      this.lineChartLabels1 = item1
      this.lineChartLabels2 = item1
    })

    this.getEjeY_1().then(item => {
      this.lineChartData1 = item
      this.chart1DataReady = true
    });

    this.getEjeY_2().then(item => {
      this.lineChartData2 = item
      this.chart2DataReady = true
    });
  }

  //Grafico uno
  async getEjeY_1() {
    let results = []
    await this.psrService.getPsrList().subscribe(data => {
      this.groupByCodigo(data).forEach(itemEjeX => {
        let filterResult = data.filter((proyecto) => proyecto.codigo == itemEjeX)
        let dataTemp = []
        filterResult.forEach(itemEjeY => {
          dataTemp.push(itemEjeY.porcentajeDesviacion)
        })
        let dataTemp2 = {
          data: dataTemp,
          label: itemEjeX,
          fill: false
        }
        results.push(dataTemp2)
      })
    }, error => console.log(error));
    return results
  }

  //Grafico dos
  async getEjeY_2() {
    let results = []
    await this.psrService.getPsrList().subscribe(data => {
      this.groupByCodigo(data).forEach(itemEjeX => {
        let filterResult = data.filter((proyecto) => proyecto.codigo == itemEjeX)
        let dataTemp = []
        filterResult.forEach(itemEjeY => {
          dataTemp.push(itemEjeY.porcentajeAvanceReal)
        })
        let dataTemp2 = {
          data: dataTemp,
          label: itemEjeX,
          fill: false
        }
        results.push(dataTemp2)
      })
    }, error => console.log(error));
    return results
  }

  //Grafico uno - dos
  async getEjeX() {
    let results = []
    await this.psrService.getPsrList().subscribe(data => {
      data.forEach(item => {
        let filterResult = results.filter((psr) => psr == String(item.fechaCreacionPsr).substring(0, 10))
        if (filterResult.length == 0) {
          results.push(String(item.fechaCreacionPsr).substring(0, 10))
        }
      })
    })
    return results;
  }

  groupByCodigo(data) {
    this.results = []
    data.forEach(item => {
      let filterResult = this.results.filter((psr) => psr == item.codigo)
      if (filterResult.length == 0) {
        this.results.push(item.codigo)
      }
    })
    return this.results;
  }
}