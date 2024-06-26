// contenido-ufs.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ContenidoUfs } from '../model/contenido-ufs';
import { MantenimientoPesoHora } from '../model/mantenimiento-peso-hora';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class ContenidoUfsService {
  private baseUrl = `${environment.baseUrl}/contenido-ufs`;
  
  private header = this.headers.headerPrivate();
    

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

  getContenidoUfs(): Observable<ContenidoUfs[]> {
    return this.httpClient.get<ContenidoUfs[]>(`${this.baseUrl}`, { headers: this.header });
  }


  obtenerHoras(peso: number): Observable<MantenimientoPesoHora | any> {
    return this.httpClient.get(`${this.baseUrl}/obtenerHoras/${peso}`);
  }

  getUltimoContenidoUfs(): Observable<ContenidoUfs> {
    return this.httpClient.get<ContenidoUfs>(`${this.baseUrl}/ultimo`);
  }

  
  saveContenidoUfs(contenidoUfs: ContenidoUfs): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`,contenidoUfs, { headers: this.header });
  }

  deleteContenidoUfs(id: number): Observable<ContenidoUfs> {
    return this.httpClient.delete<ContenidoUfs>(`${this.baseUrl}/${id}`, { headers: this.header });
  }
  updateContenidoUfs(id: number, contenidoUfs: ContenidoUfs): Observable<ContenidoUfs> {
    return this.httpClient.put<ContenidoUfs>(`${this.baseUrl}/${id}`, contenidoUfs, { headers: this.header });
  }

  getContenidoUfsById(id: number): Observable<ContenidoUfs> {
    return this.httpClient.get<ContenidoUfs>(`${this.baseUrl}/contenido-ufs/${id}`);
  }


}
