import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';

@Component({
    selector: 'app-error-page',
    templateUrl: './error-page.component.html',
    styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit, OnDestroy {

    type: any;
    title: any;
    desc: any;
    private sub: Subscription;

    constructor(private route: ActivatedRoute,
        private loginService: LoginService) { }

    ngOnInit(): void {
        this.type = this.route.snapshot.paramMap.get('type');
        console.log(this.type);

        this.sub = this.route.data.subscribe(param => {
            if (param.type) {
                this.type = param.type;
            }
            if (param.title) {
                this.title = param.title;
            }
            if (param.desc) {
                this.desc = param.desc
            }
        });

        switch (this.type) {
            case '404':
                if (!this.title) {
                    this.title = 'Page Not Found'
                }
                if (!this.desc) {
                    this.desc = 'Oopps!! The page you were looking for doesn\'t exist.'
                }
                break;
            case '500':
                if (!this.title) {
                    this.title = 'Internal server error'
                }
                if (!this.desc) {
                    this.desc = 'Oopps!! There wan an error. Please try agin later.'
                }
                break;
            default:
                // if (!this.type) {
                this.type = 'Ooops..';
                // }
                if (!this.title) {
                    this.title = 'Something went wrong';
                }
                if (!this.desc) {
                    this.desc = 'Looks like something went wrong.<br>' + 'We\'re working on it';
                }
        }
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    castListObjectToStringList(listaObj: any[]) {
        let listString: EmpleadoString;
        let string: EmpleadoString = new EmpleadoString();
        string.id = listaObj["empleado"]["id"];
        string.email = listaObj["empleado"]["email"];
        string.nombre = listaObj["empleado"]["nombre"];
        string.rol = listaObj["authorities"][0]["authority"];
        listString = string;
        return listString;
    }
}

export class EmpleadoString {
    id: number;
    nombre: string;
    email: string;
    rol: string;
}
