import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Funcion } from '../model/funcion';


@Injectable({
  providedIn: 'root'
})
export class FuncionService {
  private baseUrl = `${environment.baseUrl}/funciones`;

  constructor(private httpClient: HttpClient) { }

 

  getFuncions(): Observable<Funcion[]> {
    return this.httpClient.get<Funcion[]>(`${this.baseUrl}`);
  }

    // Método para guardar un nuevo esfuerzo
    saveFuncion(funcion: Funcion): Observable<Funcion> {
      return this.httpClient.post<Funcion>(`${this.baseUrl}`,funcion);
    }
 
  

}
