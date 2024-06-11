import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContenidoUfs } from '../model/contenido-ufs';
import { MantenimientoUnidad } from '../model/mantenimiento-unidad';
import { Funcion } from '../model/funcion';
import { Esfuerzo } from '../model/esfuerzo';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoUnidadService {
  private baseUrl = `${environment.baseUrl}/mantenimiento-unidad`;

  constructor(private httpClient: HttpClient) { }


  getMantenimientos(): Observable<MantenimientoUnidad[]> {
    return this.httpClient.get<MantenimientoUnidad[]>(`${this.baseUrl}`);
  }

}