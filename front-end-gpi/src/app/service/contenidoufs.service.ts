import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpHeaderApp } from './header';
import { ContenidoUfs } from '../model/contenido-ufs';

@Injectable({
  providedIn: 'root'
})
export class NovedadService {

  private baseUrl = environment.baseUrl + "/contenido-ufs";

  constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
  private header = this.headers.headerPrivate();

  getContenidoUfs(): Observable<ContenidoUfs[]> {
    return this.httpClient.get<ContenidoUfs[]>(`${this.baseUrl}`, { headers: this.header });
}

getContenidoUfsById(id:string): Observable<ContenidoUfs> {
    return this.httpClient.get<ContenidoUfs>(`${this.baseUrl}/${id}`, { headers: this.header });
}

saveContenidoUfs(): Observable<ContenidoUfs[]> {
    return this.httpClient.post<ContenidoUfs[]>(`${this.baseUrl}`, { headers: this.header });
}

deleteContenidoUfs(id:string): Observable<ContenidoUfs> {
    return this.httpClient.delete<ContenidoUfs>(`${this.baseUrl}/${id}`, { headers: this.header });
}

updateContenidoUfs(id:string): Observable<ContenidoUfs> {
    return this.httpClient.put<ContenidoUfs>(`${this.baseUrl}/${id}`, { headers: this.header });
}



}