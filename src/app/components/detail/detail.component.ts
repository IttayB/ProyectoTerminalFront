import {   ChangeDetectionStrategy, Component, ElementRef,   Input,   OnInit, ViewChild } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import Chart from 'chart.js/auto';
import { PERCENTAGE_CHART_DATASET ,PERFORMANCE_CHART_DATASET } from 'src/app/shared/constants/sge.constants';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DetailComponent implements OnInit {
  @ViewChild('graphicPercentageChart') graphicPercentageChartCanvas: ElementRef | undefined;
  @ViewChild('graphicPerformanceChart') graphicPerformanceChartCanvas: ElementRef | undefined;
  @Input() selectedAttribute: string = '';
  graphicPercentageChart: any;
  graphicPerformanceChart: any;
  summaryData: any = undefined;
  tableSummary: any = undefined;
  tablePercentage: any = undefined;
  tablePerformance: any = undefined;
  
  setData: number = 0;
  constructor(private readonly homeService: HomeService) { }

 /**
  *En este metodo se realiza una suscripcion al homeservice
  *para detectar los cambios de los valores en el summaryData
  *
 * @memberof DetailComponent
 */
ngOnInit(): void {
    this.homeService.summaryTabData.subscribe(
      (summaryData)=>{
       
      
        this.summaryData = summaryData;
        this.tableSummary = summaryData.tableSumary;
        this.tablePercentage = summaryData.tablePercentage;
        this.tablePerformance = summaryData.tablePerformance;
        this.generateGraphicPercentageChart();
        this.setData = 0;
        this.generateGraphicPerformanceChart();
      
     
        
      }
    );
  
  }  

  /**
   *Metodo para generar la grafica de porcentajes
   *
   * @memberof DetailComponent
   */
  generateGraphicPercentageChart(): void {
    
    if(this.graphicPercentageChart){
      this.setData=0;
      this.graphicPercentageChart.destroy();

    }

    this.graphicPercentageChart = new Chart(this.graphicPercentageChartCanvas?.nativeElement, {
      type: 'line',
      data: {
        labels: [...this.getPercentageChartLabels()],
        datasets: [...this.getDatasetPercentageChart()],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false
          },
          title: {
            display: true,
            text: `Grafico de porcentaje de ${this.selectedAttribute}`,
            font:{
              size:15,
              family:'Arial, Helvetica, sans-serif'
            }
          },
          
        },
        hover: {
          mode: 'index',
        
        },
        scales: {
         
          y: {
            title: {
              display: true,
              text: '% Porcentaje',
              font:{
                size:15,
                family:'Arial, Helvetica, sans-serif'
              }
            },
            min: 0,
            max: 100,
            ticks: {
              
              font:{
                size:14,
                family:'Arial, Helvetica, sans-serif'
              },
              stepSize: 25
            }
          },

          x: {
            title: {
              display: true,
             
              font:{
                size:50,
                family:'Arial, Helvetica, sans-serif'
              }
            },
           
            
          }
        }
      },


    });
    


  }
  
  /**
   *Metodo para generar la grafica de rendimiento
   *
   * @memberof DetailComponent
   */
  generateGraphicPerformanceChart(): void {
    
    if(this.graphicPerformanceChart){
     
      this.graphicPerformanceChart.destroy();

    }
    this.graphicPerformanceChart = new Chart(this.graphicPerformanceChartCanvas?.nativeElement, {
      type: 'bar',
      options: {
        plugins: {
          title: {
            display: true,
           text: `Grafico de rendimiento de ${this.selectedAttribute}`,
          
            font:{
              size:15,
              family:'Arial, Helvetica, sans-serif'
            }
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }
      },
     
      data: {
        labels: [...this.getPerformanceChartLabels()],
        datasets: [...this.getDatasetPerformanceChart()],
      },
      
    });
  
  }



/**
 *Metodo para obtener las etiquetas para la grafica de porcentaje
 *
 * @return {*}  {string[]} arreglo con las etiquetas inferiores de la 
 * grafica porcentaje
 * @memberof DetailComponent
 */
getPercentageChartLabels(): string[] {
    return this.tablePercentage.map((item: any) => {
      return `Año ${item.year.toString()}`;
    });
  }

/**
 *Metodo para obtener las etiquetas para la grafica de rendimiento
 *
 * @return {*}  {string[]} arreglo con las etiquetas inferiores de 
 * la grafica de rendimiento
 * @memberof DetailComponent
 */
getPerformanceChartLabels(): string[] {
    return this.tablePerformance.map((item: any) => {
      return `Año ${item.year.toString()}`;
    });
  }

  /**
   *Metodo para llenar los datos de la grafica de porcentaje
   *
   * @return {*}  {any[]}  el modelo con datos
   * @memberof DetailComponent
   */
  getDatasetPercentageChart(): any[] {
    const result = JSON.parse(JSON.stringify( PERCENTAGE_CHART_DATASET));

    if (this.setData < 1) {
      this.tablePercentage.forEach((item: any) => {
        result[0].data.push(item.beatPercentage);
        result[1].data.push(item.achievePercentage);
        result[2].data.push(item.partialPercentage);
        result[3].data.push(item.notAchievedPercentage);
      });

      this.setData++;
    }

    return result;}


/**
 *Metodo para llenar los datos de la grafica de rendimiento
 *
 * @return {*}  {any[]} el modelo con datos
 * @memberof DetailComponent
 */
getDatasetPerformanceChart(): any[] {
      const result = JSON.parse(JSON.stringify(PERFORMANCE_CHART_DATASET));
  
      if (this.setData < 1) {
        this.tablePerformance.forEach((item: any) => {
          result[0].data.push(item.performanceUp);
          result[1].data.push(item.performanceDown);
         
        });
  
        this.setData++;
      }
  
      return result;}  


}
