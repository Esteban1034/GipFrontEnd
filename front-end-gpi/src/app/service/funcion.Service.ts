import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Funcion } from '../model/funcion';


@Injectable({
  providedIn: 'root'
})
export class FuncionService {
  private baseUrl = `${environment.baseUrl}/funcion`;

  constructor(private httpClient: HttpClient) { }

 

  getFuncions(): Observable<Funcion[]> {
    return this.httpClient.get<Funcion[]>(`${this.baseUrl}`);
  }


}
