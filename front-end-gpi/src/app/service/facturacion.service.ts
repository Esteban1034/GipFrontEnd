import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Facturacion } from '../Model/facturacion';
import { HttpHeaderApp } from './header';

@Injectable({
    providedIn: 'root'
})
export class FacturacionService {

    private baseUrl = environment.baseUrl + '/proyectos/facturacion';

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    private header = this.headers.headerPrivate();

    cobrar(facturacion: Facturacion): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}/cobrar`, facturacion, { headers: this.header });
    }

    pagar(facturacion: Facturacion): Observable<Object> {
        return this.httpClient.put(`${this.baseUrl}/pagar`, facturacion, { headers: this.header });
    }

    getFacturacionesList(): Observable<Facturacion[]> {
        return this.httpClient.get<Facturacion[]>(`${this.baseUrl}`, { headers: this.header });
    }

    createFacturacion(facturacion: Facturacion): Observable<Object> {
        return this.httpClient.post(`${this.baseUrl}`, facturacion, { headers: this.header });
    }

    getFacturacionById(id: number): Observable<Facturacion> {
        return this.httpClient.get<Facturacion>(`${this.baseUrl}/${id}`, { headers: this.header });
    }

    updateFacturacion(id: number, facturacion: Facturacion): Observable<Object> {
        return this.httpClient.put(`${this.baseUrl}/${id}`, facturacion, { headers: this.header });
    }

    deleteFacturacion(id: number): Observable<Object> {
        return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header });
    }

    getCobrosByProyecto(id: number): Observable<Facturacion[]> {
        return this.httpClient.get<Facturacion[]>(`${this.baseUrl}/proyectos/${id}`, { headers: this.header });
    }
}







