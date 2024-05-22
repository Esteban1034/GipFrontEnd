import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EstadoEmpleado } from '../model/estado-empleado';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class EstadoEmpleadoService {

  private baseUrl = environment.baseUrl + "/empleados/estados";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getEstadosList(): Observable<EstadoEmpleado[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}`, { headers: this.header});
  }

}