import { Component, OnInit } from "@angular/core";
import { ReporteTiempoService } from "../../../../service/reporte-tiempo.service";
import { EstadoReporteTiempo } from "src/app/Model/estado-reporte-tiempo";
import { ProyectoService } from "src/app/service/proyecto.service";
import { EstadoReporteTiempoService } from "src/app/service/estado-reporte-tiempo.service";
import { ToastrService } from "ngx-toastr";
import { Proyecto } from "src/app/Model/proyecto";
import { ReporteTiempo } from "src/app/Model/reporte-tiempo";
import { nullSafeIsEquivalent } from "@angular/compiler/src/output/output_ast";
import { Router } from "@angular/router";
import { RecursoActividadService } from "src/app/service/recurso-actividad.service";
import { EmpleadoService } from "src/app/service/empleado.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Empleado } from "src/app/model/empleado";

@Component({
    selector: "app-horas-reportadas",
    templateUrl: "./horas-reportadas.component.html",
    styleUrls: ["./horas-reportadas.component.scss"],
})
export class HorasReportadasComponent implements OnInit {
    reportes: ReporteTiempo[] = [];
    reportesCache: ReporteTiempo[] = [];
    proyecto: Proyecto = new Proyecto();
    proyectos: Proyecto[] = [];
    estado: EstadoReporteTiempo = new EstadoReporteTiempo();
    estados: EstadoReporteTiempo[] = [];
    recurso: Empleado = new Empleado();
    recursos: Empleado[] = [];
    idRecursoToDelete: number;
    page: number = 0;
    size: number = 300;

    constructor(
        private reporteService: ReporteTiempoService,
        private proyectService: ProyectoService,
        private empleadService: EmpleadoService,
        private estadoService: EstadoReporteTiempoService,
        private toastr: ToastrService,
        private modalService: NgbModal,
        private router: Router
    ) { }

    session = localStorage.getItem("session");

    ngOnInit(): void {
        this.session = JSON.parse(this.session);

        if (
            this.session["rol"] != "ROL_ADMIN" &&
            this.session["rol"] != "ROL_LP" &&
            this.session["rol"] != "ROL_GP" &&
            this.session["rol"] != "ROL_DP" 
        ) {
            this.router.navigate(["/error"]);
            return;
        }

        this.getReportes();
        this.getEstados();
        this.getProyectos();
        this.getRecursos();
    }

    getReportes() {
        this.reportes = [];
        this.reporteService
            .getReportesTiempoListUltimosDosMeses()
            .subscribe(
                (data) => {
                    if (data) this.updateReportesData(data);
                    this.reportesCache = this.reportes;
                },
                (error) => console.log(error)
            );
    }

    getProyectos() {
        this.proyectService.getProyectosList().subscribe(
            (data) => {
                data.sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
                this.proyectos = data;
            },
            (error) => console.log(error)
        );
    }

    getRecursos() {
        this.empleadService.getEmpleadosList().subscribe(
            (data) => {
                data.sort((a, b) => (a.nombre > b.nombre ? 1 : -1));
                this.recursos = data;
            },
            (error) => console.log(error)
        );
    }

    getEstados() {
        this.estadoService.getEstadosList().subscribe(
            (data) => {
                this.estados = data;
            },
            (error) => console.log(error)
        );
    }

    search() {

        let isProyecto = this.proyecto.hasOwnProperty("id");
        let isEstado = this.estado.hasOwnProperty("id");
        let isRecurso = this.recurso.hasOwnProperty("id");

        if (!isProyecto && !isEstado && !isRecurso) {
            return this.toastr.warning("No encontraron criterios de busqueda");
        } else if (isProyecto && !isEstado && !isRecurso) {
            // POR PROYECTO
            this.reporteService
                .findByProyecto(this.proyecto.id)
                .subscribe(
                    (data) => {
                        if (data) this.updateReportesData(data);
                    },
                    (error) => {
                        console.log(error);
                        this.toastr.warning(error.error);
                        this.cancelFilter();
                    }
                );
        } else if (isEstado && !isProyecto && !isRecurso) {
            // POR ESTADO
            this.reporteService
                .findByEstado(this.estado.id)
                .subscribe(
                    (data) => {
                        if (data) this.updateReportesData(data);
                    },
                    (error) => {
                        console.log(error);
                        this.toastr.warning(error.error);
                        this.cancelFilter();
                    }
                );
        } else if (isProyecto && isEstado && !isRecurso) {
            // POR PROYECTO Y ESTADO
            this.reporteService
                .findByProyectoAndEstado(
                    this.proyecto.id,
                    this.estado.id
                )
                .subscribe(
                    (data) => {
                        if (data) this.updateReportesData(data);
                    },
                    (error) => {
                        console.log(error);
                        this.toastr.warning(error.error);
                        this.cancelFilter();
                    }
                );
        } else if (!isProyecto && !isEstado && isRecurso) {
            // POR RECURSO
            this.reporteService
                .findByEmpleado(this.recurso.id)
                .subscribe(
                    (data) => {
                        if (data) this.updateReportesData(data);
                    },
                    (error) => {
                        console.log(error);
                        this.toastr.warning(error.error);
                        this.cancelFilter();
                    }
                );
        } else if (isProyecto && !isEstado && isRecurso) {
            // POR PROYECTO y RECURSO----------------------------------------------------------
            this.reporteService
                .findByProyectoAndRecurso(
                    this.proyecto.id,
                    this.recurso.id
                )
                .subscribe(
                    (data) => {
                        if (data) this.updateReportesData(data);
                    },
                    (error) => {
                        console.log(error);
                        this.toastr.warning(error.error);
                        this.cancelFilter();
                    }
                );
        } else if (!isProyecto && isEstado && isRecurso) {
            // POR ESTADO y RECURSO
            this.reporteService
                .findByEmpleadoAndEstado(
                    this.recurso.id,
                    this.estado.id
                )
                .subscribe(
                    (data) => {
                        if (data) this.updateReportesData(data);
                    },
                    (error) => {
                        console.log(error);
                        this.toastr.warning(error.error);
                        this.cancelFilter();
                    }
                );
        } else if (isProyecto && isEstado && isRecurso) {
            //----------------------POR PROYECTO, RECURSO Y ESTADO------------------------------------------------------
            this.reporteService
                .findByProyectoAndEstadoAndRecurso(
                    this.proyecto.id,
                    this.estado.id,
                    this.recurso.id
                )
                .subscribe(
                    (data) => {
                        if (data) this.updateReportesData(data);
                    },
                    (error) => {
                        console.log(error);
                        this.toastr.warning(error.error);
                        this.cancelFilter();
                    }
                );
        }
    }

    updateReportesData(data: ReporteTiempo[]) {
        this.reportes = [];
        data.sort((a, b) => (a.fecha > b.fecha ? -1 : 1));
        data.forEach((reporte) => {
            if (!reporte.aprobador) {
                reporte.aprobadorName = "SISTEMA";
            } else {
                this.empleadService
                    .getEmpleadoById(reporte.aprobador)
                    .subscribe((empl) => {
                        reporte.aprobadorName = empl.nombre;
                    });
            }
            this.reportes.push(reporte);
        });
    }

    cancelFilter() {
        this.reportes = this.reportesCache;
        this.proyecto = new Proyecto();
        this.estado = new EstadoReporteTiempo();
        this.recurso = new Empleado();
    }

    openDeleteModal(content, reporte: ReporteTiempo) {
        this.modalService.open(content);
        this.idRecursoToDelete = reporte.id;
    }

    refresh() {
        window.location.reload();
    }

    deleteReporte() {
        this.reporteService.deleteReporteTiempo(this.idRecursoToDelete).subscribe(
            (data) => {
                this.toastr.warning("Reporte eliminado correctamente");
                this.refresh();
                this.modalService.dismissAll();
            },
            (error) => {
                this.toastr.error(error.error);
            }
        );
    }
}
