import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {  Observable, Subject, tap } from 'rxjs';
import { Attribute } from '../shared/models/home.models';

@Injectable({
  providedIn: 'root'
})

export class HomeService {
  summaryTabData: Subject<any> = new Subject<any>();
  currentTab: Subject<string> = new Subject<string>();

  constructor(private readonly http: HttpClient ) { }

  /**
   * Metodo para obtener la lista de licenciaturas del servicio
   *
   * @return {*}  {Observable<string[]>} lista de licenciaturas
   * @memberof HomeService
   */
  getSubjectList(): Observable<string[]> {
  
  const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');

    return this.http.get<string[]>('https://localhost:44370/api/sge/degree',{headers: headers});
  }



  /**
   *Metodo para realizar la peticion de atributos de egreso al servicio 
   *
   * @return {*}  {Observable<Attribute[]>} lista de atributos disponibles 
   * @memberof HomeService
   */
  getAttributesList(): Observable<Attribute[]> {
  const headers= new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');


    return this.http.get<Attribute[]>('https://localhost:44370/api/sge/attributes',{headers: headers});
  }


/**
 *Metodo para acceder al servicio summary
 *
 * @param {string} degree la licenciatura 
 * @param {string} attrib el id del atributo de egreso
 * @memberof HomeService
 */
getSummary(degree: string, attrib: string): void {
  const headers= new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Access-Control-Allow-Origin', '*');
  
  
      this.http.get(`https://localhost:44370/api/sge/summary/${degree}/${attrib}`,{headers: headers}).subscribe(
        (dataSummary) => {
          this.summaryTabData.next(dataSummary);
          this.currentTab.next(attrib);
        }
      );
  }

  /**
   *Metodo para acceder al servicio overview
   *
   * @param {string} degree la licenciatura de la que se desea el detalle
   * @return {*}  {Observable<any[]>} Arreglo de objetos overview 
   * @memberof HomeService
   */
  getOverview(degree: string): Observable<any[]> {
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
    
      return this.http.get<any[]>(`https://localhost:44370/api/sge/overview/${degree}`,{headers: headers});
  }

}
