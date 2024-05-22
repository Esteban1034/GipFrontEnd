import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DependenciaEmpleado } from '../model/dependencia-empleado';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class DependenciaEmpleadoService {

  private baseUrl = environment.baseUrl + "/empleados/dependencias";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getDependenciasList(): Observable<DependenciaEmpleado[]> {
    return this.httpClient.get<DependenciaEmpleado[]>(`${this.baseUrl}`, { headers: this.header});
  }

}