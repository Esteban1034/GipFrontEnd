import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MantenimientoPesoHora } from '../model/mantenimiento-peso-hora';
import { MantenimientoUnidad } from '../model/mantenimiento-unidad';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoUnidadService {
  private baseUrl = `${environment.baseUrl}`;

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

  private header = this.headers.headerPrivate();

  getMantenimientos(): Observable<MantenimientoUnidad[]> {
    return this.httpClient.get<MantenimientoUnidad[]>(`${this.baseUrl}/mantenimiento-unidad`);
  }

  createUnidad(mantenimiento: MantenimientoUnidad): Observable<object> {
    return this.httpClient.post(`${this.baseUrl}/crear-unidad`, mantenimiento, {headers: this.header});
  }

  updateUnidad(mantenimiento: MantenimientoUnidad): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}/editar-unidad`, mantenimiento, { headers: this.header });
  }

  deleteUnidad(id: number): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}/eliminar-unidad/${id}`, { headers: this.header});
  }
}
