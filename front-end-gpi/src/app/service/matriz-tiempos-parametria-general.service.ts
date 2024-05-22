import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaderApp } from './header';
import { ParametriaGeneralMatrizTiempo } from '../model/parametria-general-matriz-tiempo';
import { TipoRecurso } from '../model/tipo-recurso';
import { rescursoAsignado } from '../model/recurso-asignado';

@Injectable({
    providedIn: 'root'
})
export class ParametriaGeneralMatrizTiempoService {

    private baseUrl = environment.baseUrl + "/parametriaGeneralMatrizTiempo";

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    private header = this.headers.headerPrivate();

    getParametriaGeneral(): Observable<ParametriaGeneralMatrizTiempo> {
        return this.httpClient.get<ParametriaGeneralMatrizTiempo>(`${this.baseUrl}`, { headers: this.header });
    }

    updateParametriaGeneral(parametrosGenerales: ParametriaGeneralMatrizTiempo): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}`, parametrosGenerales, { headers: this.header });
    }

    gettiporecursos(): Observable<TipoRecurso[]>{
        return this.httpClient.get<TipoRecurso[]>(`${this.baseUrl}/tiporecurso`, { headers: this.header});
    }

    createrecursosAsignados(rescursoAsignados: rescursoAsignado[]): Observable<object> {
        return this.httpClient.post(`${this.baseUrl}/saveresursosasgi`,rescursoAsignados, {headers: this.header});
    }



}