import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MantenimientoPesoHora } from '../model/mantenimiento-peso-hora';
import { MantenimientoUnidad } from '../model/mantenimiento-unidad';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoUnidadService {
  private baseUrl = `${environment.baseUrl}/mantenimiento-unidad`;

  constructor(private httpClient: HttpClient) { }

  getMantenimientos(): Observable<MantenimientoUnidad[]> {
    return this.httpClient.get<MantenimientoUnidad[]>(`${this.baseUrl}`);
  }

  getPesoHora(mantenimientoId: number): Observable<MantenimientoPesoHora[]> {
    return this.httpClient.get<MantenimientoPesoHora[]>(`${this.baseUrl}/${mantenimientoId}/peso-hora`);
  }
}
