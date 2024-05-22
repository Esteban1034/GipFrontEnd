import { Component, OnInit } from '@angular/core';
import { ReporteTiempo } from 'src/app/Model/reporte-tiempo';
import { ProyectoService } from 'src/app/service/proyecto.service';
import { ReporteTiempoService } from 'src/app/service/reporte-tiempo.service';
import { ToastrService } from 'ngx-toastr';
import { ActividadAsignadaService } from 'src/app/service/actividad-asignada.service';
import { EmpleadoService } from 'src/app/service/empleado.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActividadAsignada } from 'src/app/Model/actividad-asignada';
import { Proyecto } from 'src/app/Model/proyecto';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-form-reporte',
    templateUrl: './form-reporte.component.html',
    styleUrls: ['./form-reporte.component.scss']
})
export class FormReporteComponent implements OnInit {

    mostrarValidacion : boolean = false;
    defaultNavActiveId = 1;
    horasReportadasDia : number;
    tiemposReportados: ReporteTiempo[] = [];
    reporte: ReporteTiempo = new ReporteTiempo();
    reportesPendientes: ReporteTiempo[] = [];
    actividades: ActividadAsignada[] = [];
    proyectos: Proyecto[] = new Array();
    proyecto: Proyecto = new Proyecto();
    existReport: boolean = false;
    idEmpleado: number = undefined;
    formProyecto: FormGroup;
    submittedP: boolean = false;
    formReporte: FormGroup;
    submittedR: boolean = false;
    mesAnioActual: string;
    mesesEnLetras = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio","Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    constructor(private proyectoService: ProyectoService,
        private reporteService: ReporteTiempoService,
        private actividadService: ActividadAsignadaService,
        private empleadoService: EmpleadoService,
        private toastr: ToastrService,
        private formBuilder: FormBuilder) {

    }

    ngOnInit(): void {
        let session = localStorage.getItem("session");
        session = JSON.parse(session);
        this.idEmpleado = session["id"];

        this.getProyectos();
        this.getReportesPendientes();
        this.getTiemposReportados()

        this.buildFormProyecto();
        this.buildFormReporte();
        this.hideFormReporte();
    }

    get fp() { return this.formProyecto.controls; }

    buildFormProyecto() {
        this.formProyecto = this.formBuilder.group({
            proyecto: [null, [
                Validators.required
            ]],
        });
    }

    get fr() { return this.formReporte.controls; }

    buildFormReporte() {
        this.formReporte = this.formBuilder.group({
            actividad: ['', [
                Validators.required
            ]],
            fecha: ['', [
                Validators.required
            ]],
            horas: ['', [
                Validators.required,
                Validators.pattern('[0-99]{1,2}')
            ]]
        });
    }

    getTiemposReportados() {
        console.log("ENTRA A EXTRAER TIEMPOS REPORTADOS");
        this.reporteService.findByMesActualAndEmpleado(this.idEmpleado).subscribe(data => {
            data.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
            this.tiemposReportados = data;
            console.log(data);
        }, error => {
            console.log(error);
        });
    }

    validarHorasDiaReporte() {
        this.reporteService.findHorasDiaByFechaAndEmpleado(this.idEmpleado,this.reporte.fecha.toString()).subscribe(data => {
            this.horasReportadasDia = data;
        }, error => {
            console.log(error);
        });
    }

    getReportesPendientes() {
        this.reporteService.findPendingReportes(this.idEmpleado).subscribe(data => {
            if (data) this.reportesPendientes = [];
            data.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));

            let today = new Date(Date.now());
            this.mesAnioActual = this.mesesEnLetras[today.getMonth()] + " " + today.getFullYear();

            data.forEach(repor => {
                let reportDate = new Date(repor.fecha + "T00:00:00");
                if (reportDate.getFullYear() >= today.getFullYear() &&
                    reportDate.getMonth() >= today.getMonth()) this.reportesPendientes.push(repor);
            });
        }, error => {
            console.log(error);
        });
    }
    

    selectProyecto() {
        this.submittedP = true;

        if (this.formProyecto.invalid) {
            return;
        }

        this.hideSelectProyecto();
        this.showFormReporte();

        if (this.proyectos.length > 0 && this.proyecto.interno) {
            this.actividadService.findByProyectoInt(this.proyecto.id).subscribe(data => {
                data.sort((a, b) => (a.actividad.actividad > b.actividad.actividad ? 1 : -1));
                this.actividades = data;
            });
        } else {
            this.actividadService.findByProyecto(this.proyecto.id).subscribe(data => {
                data.sort((a, b) => (a.actividad.actividad > b.actividad.actividad ? 1 : -1));
                this.actividades = data;
            });
        }
    }

    saveReporte() {
        this.submittedR = true;

        if (this.formReporte.invalid) {
            return;
        }

        this.showSpinner();
        this.reporte.proyecto = this.proyecto;

        this.empleadoService.getEmpleadoById(this.idEmpleado).subscribe(data => {
            this.reporte.empleado = data;
            if (this.proyecto.interno) {
                this.reporteService.enviarProyectoInt(this.reporte).pipe(finalize(() => this.getTiemposReportados())
                ).subscribe(data => {
                    this.toastr.success('Reporte enviado correctamente!');
                    this.hideSpinner();
                    this.cancelReporte();
                    this.getReportesPendientes();
                }, error => {
                    this.toastr.error(error.error);
                    this.hideSpinner();
                    console.log(error);
                });
            } else {
                this.reporteService.enviar(this.reporte).pipe(finalize(() => this.getTiemposReportados())
                ).subscribe(data => {
                    this.toastr.success('Reporte enviado correctamente!');
                    this.hideSpinner();
                    this.cancelReporte();
                    this.getReportesPendientes();
                }, error => {
                    this.toastr.error(error.error);
                    this.hideSpinner();
                    console.log(error);
                });
            }
        }, error => {
            this.hideSpinner();
            console.log(error)
            this.toastr.error(error.error);
        });
    }

    getProyectos() {
        this.proyectoService.findProyectosForReporteTiempo(this.idEmpleado).subscribe(data => {
            data.sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
            this.proyectos = data;
            if (data.length > 0 && this.proyecto.interno) {
                this.actividadService.findByProyectoInt(this.proyecto.id).subscribe(dataa => {
                    dataa.sort((a, b) => (a.actividad.actividad > b.actividad.actividad ? 1 : -1));
                    this.actividades = dataa;
                });
            }
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
    }

    showSelectProyecto() {
        document.getElementById('selectProyecto').classList.remove('d-none');
    }

    hideSelectProyecto() {
        document.getElementById('selectProyecto').classList.add('d-none');
    }

    showFormReporte() {
        document.getElementById('formReporte').classList.remove('d-none');
    }

    hideFormReporte() {
        document.getElementById('formReporte').classList.add('d-none');
    }

    cancelReporte() {
        this.reporte = new ReporteTiempo();
        this.proyecto = new Proyecto();
        this.actividades = [];
        this.hideFormReporte();
        this.showSelectProyecto();
    }

    completeForm(reporte: ReporteTiempo) {
        this.proyecto = reporte.proyecto;
        this.reporte = reporte;
        this.reporte.horas = 8;

        if (this.proyecto.interno) {
            this.actividadService.findByProyectoInt(this.proyecto.id).subscribe(data => {
                data.sort((a, b) => (a.actividad.actividad > b.actividad.actividad ? 1 : -1));
                this.actividades = data;
            });
        } else {
            this.actividadService.findByProyecto(this.proyecto.id).subscribe(data => {
                data.sort((a, b) => (a.actividad.actividad > b.actividad.actividad ? 1 : -1));
                this.actividades = data;
            });
        }
        this.hideSelectProyecto();
        this.showFormReporte();
    }

    showSpinner() {
        document.getElementById('con_spinner').style.display = 'block';
        document.getElementById('con_spinner').style.opacity = '100';
        document.getElementById('occ').style.display = 'none';
    }

    hideSpinner() {
        document.getElementById('con_spinner').style.display = 'none';
        document.getElementById('con_spinner').style.opacity = '0';
        document.getElementById('occ').style.display = 'block';
    }

}
