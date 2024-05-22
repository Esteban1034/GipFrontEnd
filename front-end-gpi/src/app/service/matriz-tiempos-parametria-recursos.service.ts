import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaderApp } from './header';
import { ParametriaRecursosMatrizTiempo } from '../model/parametria-recursos-matriz-tiempo';
import { EspecialidadRecurso } from '../model/especialidad-recurso';
import { PerfilRecurso } from '../model/perfil-recurso';

@Injectable({
    providedIn: 'root'
})
export class ParametriaRecursosMatrizTiempoService {

    private baseUrl = environment.baseUrl + "/parametriaRecursosMatrizTiempo";

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    private header = this.headers.headerPrivate();

    getParametriaRecursos(): Observable<ParametriaRecursosMatrizTiempo[]> {
        return this.httpClient.get<ParametriaRecursosMatrizTiempo[]>(`${this.baseUrl}`, { headers: this.header });
    }

    getEspecialidadRecursos(): Observable<EspecialidadRecurso[]> {
        return this.httpClient.get<EspecialidadRecurso[]>(`${this.baseUrl}/EspecialidadRecurso` , { headers: this.header});
    }

    getPerfilRecursos(id: number): Observable<PerfilRecurso[]> {
        return this.httpClient.get<PerfilRecurso[]>(`${this.baseUrl}/PerfilesRecurso/${id}` , {headers: this.header});
    }

    getPerfilesRecursos(): Observable<PerfilRecurso[]> {
        return this.httpClient.get<PerfilRecurso[]>(`${this.baseUrl}/PerfilesRecurso/` , {headers: this.header});
    }

    saveParametriaRecursos(parametrosRecursos: ParametriaRecursosMatrizTiempo): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}`, parametrosRecursos, { headers: this.header });
    }

    deleteParametriaRecursos(id: number): Observable<Object> {
        return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header });
    }

    searchParametriaRecursos(id: number): Observable<ParametriaRecursosMatrizTiempo> {
        return this.httpClient.get<ParametriaRecursosMatrizTiempo>(`${this.baseUrl}/search/${id}`, { headers: this.header});
    }

    updateParametriaRecursos(id: number, recurso: ParametriaRecursosMatrizTiempo): Observable<Object> {
        return this.httpClient.put(`${this.baseUrl}/update/${id}`, recurso , { headers: this.header});
    }

}