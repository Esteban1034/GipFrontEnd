import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Empleado } from 'src/app/model/empleado';
import { LoginService } from 'src/app/service/login.service';
import { ReporteTiempoService } from 'src/app/service/reporte-tiempo.service';
import { ToastrService } from 'ngx-toastr';
import { ReporteTiempo } from 'src/app/Model/reporte-tiempo';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    isLoggedin: boolean;
    returnUrl: any;
    url = window.location.href;
    private empleado = {
        correo: (this.url.split('/')[5]).toUpperCase()
    }

    constructor(private router: Router,
        private route: ActivatedRoute,
        private loginService: LoginService,
        private reporteTiempoService: ReporteTiempoService,
        private toastr: ToastrService) { }

    ngOnInit(): void {
        // get return url from route parameters or default to '/'
        //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.onLogin().then(() => {
            this.router.navigate(["/dashboard"]);
        }).catch((error) => {
            console.log('Usuario o correo incorrecto', error);
            window.location.href = "https://itssolutions.co/#"
        })
    }

    onLogin() {
        console.log("LOG IN");
        return this.loginService.loginUser(this.empleado.correo, this.empleado.correo).toPromise()
            .then((response) => {
                localStorage.setItem('session', JSON.stringify(this.castListObjectToStringList(response)));
                localStorage.setItem('isLoggedin', 'true');

                let session = localStorage.getItem('session');
                session = JSON.parse(session);

                this.reporteTiempoService.findPendingReportes(parseInt(session["id"])).subscribe(data => {
                    let dateNow: Date = new Date();
                    let reportesVencidos: ReporteTiempo[] = [];
                    data.forEach(reporte => {
                        console.log(reporte);
                        reporte.fecha = new Date(reporte.fecha);
                        if (reporte.fecha.getTime() < dateNow.getTime()) {
                            reportesVencidos.push(reporte);
                        }
                    });

                    if (reportesVencidos.length > 0) {
                        return this.toastr.warning("TIENE REPORTE DE TIEMPOS VENCIDOS");
                    }
                });

            })
    }

    onLoggedin(e) {
        e.preventDefault();
        localStorage.setItem('isLoggedin', 'true');
        if (localStorage.getItem('isLoggedin')) {
            this.router.navigate([this.returnUrl]);
        }
    }

    castListObjectToStringList(listaObj: any[]) {
        // let listString: EmpleadoString;
        let string: EmpleadoString = new EmpleadoString();
        try {
            string.id = listaObj["empleado"]["id"];
            string.email = listaObj["empleado"]["email"];
            string.nombre = listaObj["empleado"]["nombre"];
            string.rol = listaObj["authorities"][0]["authority"];
            // listString = string;
        } catch (error) {
            console.error(error);
        }
        return string;
    }
}

export class EmpleadoString {
    id: number;
    nombre: string;
    email: string;
    rol: string;
}
