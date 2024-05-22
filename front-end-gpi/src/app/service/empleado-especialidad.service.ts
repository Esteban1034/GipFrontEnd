import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { EmpleadoEspecialidad } from "../model/empleado-especialidad";
import { HttpHeaderApp } from "./header";

@Injectable({
  providedIn: "root",
})
export class EmpleadoEspecialidadService {
  private baseUrl = environment.baseUrl + "/empleado-especialidad";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getEmpleadosEspecialidadList(): Observable<EmpleadoEspecialidad[]> {
    return this.httpClient.get<EmpleadoEspecialidad[]>(`${this.baseUrl}`, { headers: this.header});
  }

  createEmpleadoEspecialidad(empleado: EmpleadoEspecialidad): Observable<Object> {
    return this.httpClient.post(`${this.baseUrl}`, empleado, { headers: this.header});
  }

  getEmpleadoEspecialidadById(id: number): Observable<EmpleadoEspecialidad> {
    return this.httpClient.get<any>(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  updateEmpleadoEspecialidad(id: number, empleado: EmpleadoEspecialidad): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, empleado, { headers: this.header});
  }

  deleteEmpleadoEspecialidad(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  getEmpleadoEspecialidadByEmpleado(id: number): Observable<EmpleadoEspecialidad[]> {
    return this.httpClient.get<EmpleadoEspecialidad[]>(`${this.baseUrl}/empleado/${id}`, { headers: this.header});
  }

  deleteListByEmpleado(id: number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/delete-list/${id}`, { headers: this.header});
  }


}
