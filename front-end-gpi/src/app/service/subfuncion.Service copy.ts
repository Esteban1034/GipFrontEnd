import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Funcion } from '../model/funcion';


@Injectable({
  providedIn: 'root'
})
export class SubFuncionService {
  private baseUrl = `${environment.baseUrl}/Subfuncion`;

  constructor(private httpClient: HttpClient) { }

 

  getAllSubfunciones(): Observable<Funcion[]> {
    return this.httpClient.get<Funcion[]>(`${this.baseUrl}`);
  }

    // Método para guardar un nuevo esfuerzo
    createSubfuncion(funcion: Funcion): Observable<Funcion> {
      return this.httpClient.post<Funcion>(`${this.baseUrl}`,funcion);
    }
 
  

}
