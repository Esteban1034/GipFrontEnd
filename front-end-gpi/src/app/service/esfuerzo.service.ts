import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Esfuerzo } from '../model/esfuerzo';

@Injectable({
  providedIn: 'root'
})
export class EsfuerzoService {
  private baseUrl = `${environment.baseUrl}/esfuerzo`;

  constructor(private httpClient: HttpClient) { }

  // Método para guardar un nuevo esfuerzo
  savEsfuerzos(esfuerzo: Esfuerzo): Observable<Esfuerzo> {
    return this.httpClient.post<Esfuerzo>(`${this.baseUrl}`, esfuerzo);
  }

  // Método para obtener todos los esfuerzos
  gEsfuerzos(): Observable<Esfuerzo[]> {
    return this.httpClient.get<Esfuerzo[]>(`${this.baseUrl}`);
  }
}
