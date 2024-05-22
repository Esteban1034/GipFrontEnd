import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EtapaProyecto } from '../model/etapa-proyecto';
import { HttpHeaderApp } from './header';

@Injectable({
    providedIn: 'root'
})
export class EtapaProyetoService {

    private baseUrl = environment.baseUrl + "/proyectos/etapas";

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    private header = this.headers.headerPrivate();

    getEtapasList(): Observable<EtapaProyecto[]> {
        return this.httpClient.get<any[]>(`${this.baseUrl}`, { headers: this.header });
    }

    getEtapaById(idEtapa: number): Observable<EtapaProyecto> {
        return this.httpClient.get<EtapaProyecto>(`${this.baseUrl}/${idEtapa}`, { headers: this.header });
    }

}