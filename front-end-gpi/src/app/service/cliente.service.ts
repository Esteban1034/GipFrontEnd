import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cliente } from '../model/cliente';
import { HttpHeaderApp } from 'src/app/service/header';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private baseUrl = environment.baseUrl + "/clientes";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

  private header = this.headers.headerPrivate();

  getClientesList(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.baseUrl}`, { headers: this.header});
  }

  createCliente(cliente: any): Observable<Object> {
    cliente.fechaCreacion = new Date();
    return this.httpClient.post(`${this.baseUrl}`, cliente, { headers: this.header});
  } 

  getClienteById(id: number): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  updateCliente(id: number, cliente: Cliente): Observable<Object> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, cliente, { headers: this.header});
  }

  deleteCliente(id:number): Observable<Object> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.header});
  }

  findBySector(idSector: number): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.baseUrl}/reportes/find-by-sector/${idSector}`, { headers: this.header});
  }

  findByGerenteCuenta(idGerente: number): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.baseUrl}/reportes/find-by-gerente/${idGerente}`, { headers: this.header});
  }

  findBySectorAndGerenteCuenta(idSector: number, idGerente: number): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.baseUrl}/reportes/find-by-sector-gerente/${idSector}/${idGerente}`, { headers: this.header});
  }

  findByBeetweenFechas(fechaInicio: Date, fechaFin: Date): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.baseUrl}/reportes/find-by-fechas/${fechaInicio}/${fechaFin}`);
  }

}
