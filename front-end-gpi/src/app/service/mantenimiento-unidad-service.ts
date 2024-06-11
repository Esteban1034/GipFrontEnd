import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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

 
}
