import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProyectoStatusReport } from '../model/project-status.-report';
import { HttpHeaderApp } from './header';
import { PSRStatus } from '../model/PSRStatus';

@Injectable({
    providedIn: 'root'
})
export class PSRStatusService {

    private baseUrl = environment.baseUrl + "/psrstatus";

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    private header = this.headers.headerPrivate();

    getPSRStatusByProjectStatusReport(id: number): Observable<PSRStatus[]> {
        return this.httpClient.get<PSRStatus[]>(`${this.baseUrl}/ProjectStatusReportById/${id}`, { headers: this.header });
    }

    
    ProjectStatusReportByCodigoProyecto(codigo: string): Observable<PSRStatus[]> {
        return this.httpClient.get<PSRStatus[]>(`${this.baseUrl}/ProjectStatusReportByCodigoProyecto/${codigo}`, { headers: this.header });
    }

    createPsrComentario(psrStatus: any): Observable<Object> {

        return this.httpClient.post(`${this.baseUrl}`, psrStatus, { headers: this.header });
    }

    deletePsrComentario(id: number): Observable<Object> {
        return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header });
    }


}