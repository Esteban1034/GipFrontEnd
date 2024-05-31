import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaderApp } from './header';
import { EstimacionTiempos } from '../model/estimacion-ufs';

@Injectable({
    providedIn: 'root'
})
export class EstimacionTiempoService {
/* falta cambiar  por el enpoint que me de jair */

    private baseUrl = environment.baseUrl + "/estimaciones";

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    private header = this.headers.headerPrivate();

    getEstimacionTiempoList(): Observable<EstimacionTiempos[]> {
        return this.httpClient.get<EstimacionTiempos[]>(`${this.baseUrl}`, { headers: this.header });
    }

}