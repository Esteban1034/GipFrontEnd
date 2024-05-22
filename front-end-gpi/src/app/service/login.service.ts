import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { isNullOrUndefined } from 'util'
import { environment } from 'src/environments/environment';
import { HttpHeaderApp } from './header';


@Injectable({
    providedIn: 'root'
})
export class LoginService {

    private baseUrl = environment.baseUrl + "/auth/login";

    constructor(private httpClient: HttpClient, private headers: HttpHeaderApp) { }

    private header = this.headers.headerPublic;

    loginUser(nombreUsuario: string, password: string): Observable<any> {
        return this.httpClient.post(this.baseUrl, { nombreUsuario, password }, { headers: this.header });
    }
}
