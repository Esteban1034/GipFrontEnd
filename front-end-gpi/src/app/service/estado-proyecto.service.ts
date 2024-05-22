import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EstadoProyecto } from '../model/estado-proyecto';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class EstadoProyectoService {

  private baseUrl = environment.baseUrl + "/proyectos/estados-proyecto";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getEstadosList(): Observable<EstadoProyecto[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}`, { headers: this.header});
  }

}