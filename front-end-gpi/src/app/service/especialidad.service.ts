import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Especialidad } from '../model/especialidad';
import { HttpHeaderApp } from './header';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  private baseUrl = environment.baseUrl + "/empleados/especialidades";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getEspecialidadesList(): Observable<Especialidad[]> {
    return this.httpClient.get<Especialidad[]>(`${this.baseUrl}`, { headers: this.header});
  }

  getEspecialidById(id: number): Observable<Especialidad> {
    return this.httpClient.get<Especialidad>(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  updateEspecialid(id: number, especialidad: Especialidad): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, especialidad, { headers: this.header});
  }

}