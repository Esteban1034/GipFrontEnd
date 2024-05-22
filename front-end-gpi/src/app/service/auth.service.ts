import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaderApp } from './header';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private baseUrl = environment.baseUrl + '/auth';

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }
  
    private header = this.headers.headerPrivate();

}
