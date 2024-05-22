import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaderApp } from './header';
import { GeneracionMatrizTiempo } from '../model/generacion-matriz-tiempos';
import { ParametriaGeneralMatrizTiempo } from '../model/parametria-general-matriz-tiempo';
import { VersionMatriz } from '../model/version-matriz';
import { MatrizTiempo } from '../model/matriz-tiempo';
import { guardadoGeneral } from '../model/guardado-matriz-tiempos';


@Injectable({
    providedIn: 'root'
})
export class GeneracionMatrizTiempoService {

    private baseUrl = environment.baseUrl + "/generacionMatrizTiempo";

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    private header = this.headers.headerPrivate();

    getGeneracionTiempos(): Observable<GeneracionMatrizTiempo[]> {
        return this.httpClient.get<GeneracionMatrizTiempo[]>(`${this.baseUrl}`, { headers: this.header });
    }

    getVersionesMatriz(): Observable<VersionMatriz[]> {
        return this.httpClient.get<VersionMatriz[]>(`${this.baseUrl}/getVersiones`, { headers: this.header });
    }

    getMatricesHistoricas(): Observable<MatrizTiempo[]> {
        return this.httpClient.get<MatrizTiempo[]>(`${this.baseUrl}/getMatrices`, { headers: this.header });
    }

    deleteMatricesHistoricos(id: number): Observable<Object> {
       return this.httpClient.delete(`${this.baseUrl}/matriz/${id}`, { headers: this.header });
    }

    getParametrosGeneralesInformeByMatriz(idMatriz:number): Observable<GeneracionMatrizTiempo[]> {
        return this.httpClient.get<GeneracionMatrizTiempo[]>(`${this.baseUrl}/getParametrosGeneralesByIdMatriz/${idMatriz}`, { headers: this.header });
    }
    
    getParametrosRecursosInformeByMatriz(idMatriz:number): Observable<GeneracionMatrizTiempo[]> {
        return this.httpClient.get<GeneracionMatrizTiempo[]>(`${this.baseUrl}/getParametrosRecursosByIdMatriz/${idMatriz}`, { headers: this.header });
    }
    
    saveGeneracionTiempos(configMatriz: guardadoGeneral, nombreMatriz:string ): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}/${nombreMatriz}`, configMatriz, { headers: this.header });
    }

    deleteGeneracionTiempos(id: number): Observable<Object> {
        return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header });
    }


}