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
export class MantenimientoPesoHoraService {
  private baseUrl = `${environment.baseUrl}`;

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

  private header = this.headers.headerPrivate();
  
  getPesoHora(): Observable<MantenimientoPesoHora[]> {
    return this.httpClient.get<MantenimientoPesoHora[]>(`${this.baseUrl}/peso-hora`);
  }

  createPesoHora(mantenimiento: MantenimientoPesoHora): Observable<object> {
    return this.httpClient.post(`${this.baseUrl}/crear-peso-hora`, mantenimiento, {headers: this.header});
  }

  updatePesoHora(mantenimiento: MantenimientoPesoHora): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}/editar-peso-hora`, mantenimiento, { headers: this.header });
  }

  deletePesoHora(id: number): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}/eliminar-peso-hora/${id}`, { headers: this.header});
  }
}
