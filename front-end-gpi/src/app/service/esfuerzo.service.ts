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

 
  gEsfuerzos(): Observable<Esfuerzo[]> {
    return this.httpClient.get<Esfuerzo[]>(`${this.baseUrl}`);
  }
}
