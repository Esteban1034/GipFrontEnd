import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmpleadoRol } from '../model/empleado-rol';
import { HttpHeaderApp } from './header';

@Injectable({
    providedIn: 'root'
})
export class EmpleadoRolService {

    private baseUrl = environment.baseUrl + '/usuarios/roles-empleado';

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
    private header = this.headers.headerPrivate();

    findAll(): Observable<EmpleadoRol[]> {
        return this.httpClient.get<EmpleadoRol[]>(`${this.baseUrl}`, { headers: this.header});
    }

    save(rol: EmpleadoRol): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}`, rol, { headers: this.header});
    }

    findById(id: number): Observable<EmpleadoRol> {
        return this.httpClient.get<EmpleadoRol>(`${this.baseUrl}/${id}`, { headers: this.header});
    }

    findByEmpleado(idEmpleado: number): Observable<EmpleadoRol[]> {
        return this.httpClient.get<EmpleadoRol[]>(`${this.baseUrl}/empleado/${idEmpleado}`, { headers: this.header});
    }

    delete(id: number): Observable<Object> {
        return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header});
    }

}
