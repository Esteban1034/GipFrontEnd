import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaderApp } from './header';
import { EstimacionTiempos } from '../model/estimacion-ufs';
import { EstimacionUfsDTO } from '../model/estimacion-ufsDTO';

@Injectable({
    providedIn: 'root'
})
export class EstimacionTiempoService {

    private baseUrl = environment.baseUrl + "/estimaciones";
    private header = this.headers.headerPrivate();
    

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    //Funciones del servicio Estimacion tiempo

    getEstimacionTiempoList(): Observable<EstimacionTiempos[]> {
        return this.httpClient.get<EstimacionTiempos[]>(`${this.baseUrl}`, { headers: this.header });
    }

    getDetailEstimacionTiempo(id:string): Observable<EstimacionTiempos> {
        return this.httpClient.get<EstimacionTiempos>(`${this.baseUrl}/${id}`, { headers: this.header });
    }

    createEstimacionTiempoList(EstimacionDto: EstimacionUfsDTO): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}`,EstimacionDto, { headers: this.header });
    }

    deleteEstimacionTiempoList(id:string): Observable<EstimacionTiempos> {
        return this.httpClient.delete<EstimacionTiempos>(`${this.baseUrl}/${id}`, { headers: this.header });
    }

    updateEstimacionTiempoList(id:string): Observable<EstimacionTiempos> {
        return this.httpClient.put<EstimacionTiempos>(`${this.baseUrl}/${id}`, { headers: this.header });
    }

}