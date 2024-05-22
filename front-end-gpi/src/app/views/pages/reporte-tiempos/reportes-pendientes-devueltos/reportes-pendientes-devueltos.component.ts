import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ReporteTiempo } from 'src/app/Model/reporte-tiempo';
import { ReporteTiempoService } from 'src/app/service/reporte-tiempo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-reportes-pendientes-devueltos',
    templateUrl: './reportes-pendientes-devueltos.component.html',
    styleUrls: ['./reportes-pendientes-devueltos.component.scss']
})
export class ReportesPendientesDevueltosComponent implements OnInit {

    idEmpleado: number = undefined;
    reportesPendientes: ReporteTiempo[] = [];
    reportesDevueltos: ReporteTiempo[] = [];

    modalReenviarReporte: NgbModalRef;
    reporteToReenviar: ReporteTiempo = new ReporteTiempo();

    constructor(private reporteService: ReporteTiempoService,
        private modalService: NgbModal,
        private route: Router,
        private toastr: ToastrService) { }

    ngOnInit(): void {
        this.getSessionEmpleado();
        this.getReportesPendientes();
        this.getReportesDevueltos();
    }

    getSessionEmpleado() {
        let session = localStorage.getItem("session");
        session = JSON.parse(session);

        this.idEmpleado = session["id"];
    }

    getReportesPendientes() {
        this.reporteService.findByEmpleadoAndEstado(this.idEmpleado, 1).subscribe(data => {
            data.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
            this.reportesPendientes = data;
        }, error => {
            console.log(error);
        });
    }

    getReportesDevueltos() {
        this.reporteService.findByEmpleadoAndEstado(this.idEmpleado, 3).subscribe(data => {
            if (data) this.reportesDevueltos = [];

            let today = new Date(Date.now());
            let diff = today.getMonth() - 1;
            let yearLimit = diff < 0 ? today.getFullYear() - 1 : today.getFullYear();
            let monthLimit = diff < 0 ? diff + 12 : diff;
            data.sort((a, b) => (a.fecha > b.fecha ? -1 : 1));
            data.forEach(element => {
                let reportDate = new Date(element.fecha);
                if (reportDate.getFullYear() >= yearLimit &&
                    reportDate.getMonth() >= monthLimit) this.reportesDevueltos.push(element);
            });
        }, error => {
            console.log(error);
        });
    }

    openReenviarReporteModal(content, id: number) {
        this.modalReenviarReporte = this.modalService.open(content);

        this.reporteService.getReporteTiempoById(id).subscribe(data => {
            this.reporteToReenviar = data;
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
    }

    reenviarReporte() {
        this.reporteService.reenviar(this.reporteToReenviar.id, this.reporteToReenviar).subscribe(data => {
            this.closeReenviarReporteModal();
            this.toastr.success('Reporte enviado correctamente.');
            window.location.reload();
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });

    }

    closeReenviarReporteModal() {
        this.modalReenviarReporte.close();
    }

}
