import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.scss']
})
export class DialogDetailComponent implements OnInit {
  detailTableData: any[] = [];
  tableHeaders: string[] = ['Grupo Temático', 'Clave', 'Nombre UEA', 'Atributo', 'Año', 'Supera', 'Logra', 'Parcial', 'No Logra', 'Total'];

 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private readonly homeService: HomeService) { }

 /**
  *En este metodo se realiza una suscripcion al homeservice
  *para detectar los cambios del overview
  *
  * @memberof DialogDetailComponent
  */
 ngOnInit(): void {
    this.homeService.getOverview(this.data.degree).subscribe(
      (overview) => {
        this.detailTableData = overview;
    });
  }
 

}
