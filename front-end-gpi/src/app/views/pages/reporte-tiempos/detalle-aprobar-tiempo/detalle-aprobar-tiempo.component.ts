import { Component, OnInit, ɵsetDocument } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReporteTiempo } from 'src/app/Model/reporte-tiempo';
import { ReporteTiempoService } from 'src/app/service/reporte-tiempo.service';
import { ToastrService } from 'ngx-toastr';
import { EstadoReporteTiempo } from 'src/app/Model/estado-reporte-tiempo';
import { EstadoReporteTiempoService } from 'src/app/service/estado-reporte-tiempo.service';

@Component({
    selector: 'app-detalle-aprobar-tiempo',
    templateUrl: './detalle-aprobar-tiempo.component.html',
    styleUrls: ['./detalle-aprobar-tiempo.component.scss']
})
export class DetalleAprobarTiempoComponent implements OnInit {

    id: number = undefined;
    reporte: ReporteTiempo = new ReporteTiempo();
    estado: EstadoReporteTiempo = new EstadoReporteTiempo();

    constructor(private route: ActivatedRoute,
        private router: Router,
        private reporteService: ReporteTiempoService,
        private toastr: ToastrService,
        private estadoService: EstadoReporteTiempoService) { }


    session = localStorage.getItem('session');

    ngOnInit(): void {
        this.session = JSON.parse(this.session);

        if (this.session['rol'] != 'ROL_ADMIN' && this.session['rol'] != 'ROL_LP' && this.session['rol'] != 'ROL_GP' && this.session['rol'] != 'ROL_DP') {
            this.router.navigate(['/error']);
            return;
        }

        this.id = this.route.snapshot.params['id'];
        this.getReporte();
    }

    getReporte() {
        this.reporteService.getReporteTiempoById(this.id).subscribe(data => {
            this.reporte = data;
        }, error => {
            console.log(error);
            this.toastr.error(error.error.message);
            if (!this.reporte.hasOwnProperty('id')) {
                console.log('Está vacio');
                this.router.navigate(['reporte-tiempo/nuevo']);
            }
        });
    }

    goToAprobarTiempoList() {
        this.router.navigate(['reporte-tiempo/aprobar-tiempo-list']);
    }

    aprobar() {

        document.getElementById('con_spinner').style.display = 'block';
        document.getElementById('con_spinner').style.opacity = '100';
        document.getElementById('occ').style.display = 'none';

        var hoy = Date.now();
        var f = new Date(hoy);

        this.reporteService.aprobar(this.id, f, this.session["id"]).subscribe(data => {
            this.toastr.success('Reporte aprobado correctamente');
            console.log(this.session);
            this.goToAprobarTiempoList();
        }, error => {
            console.log(error);
        });

    }

    devolver() {
        this.reporteService.devolver(this.id, this.reporte).subscribe(data => {
            this.toastr.info('Reporte devuelto correctamente');
            this.goToAprobarTiempoList();
        }, error => {
            console.log(error);
        });
    }

}
