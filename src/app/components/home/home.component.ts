import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HomeService } from 'src/app/services/home.service';
import { Attribute } from 'src/app/shared/models/home.models';
import { MatDialog } from '@angular/material/dialog';
import { DialogDetailComponent } from '../dialog-detail/dialog-detail.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})

export class HomeComponent implements OnInit {

  showTabContent = false;
  summaryDataForTabs: any = undefined;
  attributeList: Attribute[] = [];
  subjectControl = new FormControl('');
  subjectList: string[] = [];
  selectedSubject: string | undefined = '';
  isSelected: boolean = false;
  attribSelected: string = 'AE1';
  previousAttrib: number = 0;
  hide: boolean = false;

  constructor(private readonly homeService: HomeService, public dialog: MatDialog) { }

/**
 * se establecen los servicios, listeners y suscripciones necesarias para obtener los datos necesarios para mostrar en la vista.
 *
 * @memberof HomeComponent
 */

ngOnInit(): void {

    this.homeService.getAttributesList().subscribe(
      (subjectListResponse: Attribute[]) => {
        this.attributeList = subjectListResponse;
      }
    );


    this.homeService.getSubjectList().subscribe(
      (subjectListResponse: string[]) => {
        this.subjectList = subjectListResponse;
      }
    );


    this.subjectControl.valueChanges.subscribe(
      (value) => {
        this.selectedSubject = value?.toString();
      }


    );
  }

   /**
   * Este metodo actualiza los datos necesarios para las tablas y graficas
   * al cambiar de pestaña de atributo o licenciatura
   * @param {*} attrib una cadena con el nombre de licenciatura o un evento si es cambio de licenciatura
   * @param {boolean} [first=false] bandera si es la primera seleccion de licenciatura
   * @memberof HomeComponent
   */
  getDataPerTab(attrib: any, first: boolean = false) {
    this.showTabContent = true;

    if (first) {
      this.selectedSubject = attrib.value;
      if (this.selectedSubject) {

        this.homeService.getSummary(this.selectedSubject, this.attribSelected);
        this.showTabContent = true;
        this.previousAttrib = 0;

      }


    } else if (this.selectedSubject) {
      this.previousAttrib = attrib.index;
      this.homeService.getSummary(this.selectedSubject, this.attributeList[this.previousAttrib].id);
      this.homeService.currentTab.subscribe(
        (attribId) => {
          if (this.attributeList[this.previousAttrib].id === attribId) {
            this.showTabContent = true;
          }
        }
      );
    }
  }


/**
 *Este metodo genera el componente dialog-detail dentro de un modal
 *
 * @memberof HomeComponent
 */
openDialog() {
    const dialogRef = this.dialog.open(DialogDetailComponent, { data: { degree: this.selectedSubject }, disableClose: true });

    dialogRef.afterClosed().subscribe(result => {

    });
  }


 /**
   *Metodo para generar el renderizado de los elementos de estaditicas
   *
   * @param {*} attrib si es cadena es la primera seleccion, si es un evento es una actualizacion de datos
   * @memberof HomeComponent
   */
  setDropdownSubject(attrib: any) {

    if (typeof (attrib.value) == 'string' && !this.isSelected) {

      this.getDataPerTab(attrib, true);
      this.isSelected = true;



    } else {

      let attrib2 = {
        index: !!this.previousAttrib ? this.previousAttrib : 0,


      }
      this.getDataPerTab(attrib2);
      this.isSelected = true;
    }




  }

  /**
   * Este metodo se utiliza para generar un archivo PDF de la seccion html con id printSection
   *
   * @memberof HomeComponent
   */
  generatePDF(): void {
      let data: any = document.getElementById('printSection');
      html2canvas(data).then((canvas) => {
        let PDF = new jsPDF('l', 'mm', 'a4');
        let fileWidth = PDF.internal.pageSize.getWidth();
        let fileHeight = canvas.height * fileWidth / canvas.width;
        const FILEURI = canvas.toDataURL('image/png',1.0);
        let position = -8;
        PDF.addImage(FILEURI, 'PNG', 0, position, PDF.internal.pageSize.getWidth(), PDF.internal.pageSize.getHeight());
        PDF.save('Reporte.pdf');
      });
    }


}
