import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaderApp } from './header';
import { ContenidoUfs } from '../model/contenido-ufs';
import { MantenimientoUnidad } from '../model/mantenimiento-unidad';
import { Funcion } from '../model/funcion';
import { Esfuerzo } from '../model/esfuerzo';

@Injectable({
  providedIn: 'root'
})
export class ContenidoUfsService {
  private baseUrl = environment.baseUrl + "/contenido-ufs";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

  private header = this.headers.headerPrivate();
  getEsfuerzoData(): Observable<Esfuerzo[]> {
    return this.httpClient.get<Esfuerzo[]>(`${this.baseUrl}`, { headers: this.header });
  }  getFuncionData(): Observable<Funcion[]> {
    return this.httpClient.get<Funcion[]>(`${this.baseUrl}`, { headers: this.header });
  }  getMantenimiento(): Observable<MantenimientoUnidad[]> {
    return this.httpClient.get<MantenimientoUnidad[]>(`${this.baseUrl}`, { headers: this.header });
  }
  getContenidoUfs(): Observable<ContenidoUfs[]> {
    return this.httpClient.get<ContenidoUfs[]>(`${this.baseUrl}`, { headers: this.header });
  }

  getContenidoUfsById(id: string): Observable<ContenidoUfs> {
    return this.httpClient.get<ContenidoUfs>(`${this.baseUrl}/${id}`, { headers: this.header });
  }

  saveContenidoUfs(contenidoUfs: ContenidoUfs): Observable<ContenidoUfs> {
    return this.httpClient.post<ContenidoUfs>(`${this.baseUrl}`, contenidoUfs, { headers: this.header });
  }

  deleteContenidoUfs(id: string): Observable<ContenidoUfs> {
    return this.httpClient.delete<ContenidoUfs>(`${this.baseUrl}/${id}`, { headers: this.header });
  }

  updateContenidoUfs(id: string, contenidoUfs: ContenidoUfs): Observable<ContenidoUfs> {
    return this.httpClient.put<ContenidoUfs>(`${this.baseUrl}/${id}`, contenidoUfs, { headers: this.header });
  }
}
