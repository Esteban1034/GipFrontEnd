import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProyectoService } from '../../../../service/proyecto.service';
import { Proyecto } from 'src/app/model/proyecto';
import { Router, UrlTree } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EtapaProyecto } from 'src/app/model/etapa-proyecto';
import { EtapaProyetoService } from 'src/app/service/etapa-proyecto.service';
import { PSRService } from 'src/app/service/project-status-report.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from 'src/app/model/cliente';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { FaseProyecto } from "src/app/model/fase-proyecto";
import { ActividadAsignada } from "src/app/model/actividad-asignada";
import { ActividadAsignadaService } from "src/app/service/actividad-asignada.service";
import { RecursoActividadService } from "src/app/service/recurso-actividad.service";
import { FaseProyectoService } from "src/app/service/fase-proyecto.service";
import { Empleado } from "src/app/model/empleado";
import { RecursoActividad } from "src/app/model/recurso-actividad";
import { EmpleadoService } from "src/app/service/empleado.service";

import { OnExit } from '../exit.guard';
import { Observable } from 'rxjs';
import { ReporteTiempo } from 'src/app/model/reporte-tiempo';
import { ReporteTiempoService } from 'src/app/service/reporte-tiempo.service';
import { PSRStatusService } from 'src/app/service/PSRStatus.service';
import { PSRStatus } from 'src/app/model/PSRStatus';
import { finalize } from 'rxjs/operators';
import { ProjectStatusReportComentarios } from 'src/app/model/ProjectStatusReportComentarios';
import { NotasSemanaPSR } from 'src/app/model/notas-semana-psr';
import { RolSeg } from 'src/app/model/rol-seg';
import { GestionUsuariosRoles } from 'src/app/service/gestion-usuario-roles.service';


@Component({
    selector: 'app-crear-psr',
    templateUrl: './crear-psr.component.html',
    styleUrls: ['./crear-psr.component.scss']
})

export class CrearPsrComponent implements OnInit, OnExit {

    proyectos: Proyecto[] = [];
    psrStatusHist: PSRStatus[] = [];
    psrStatusHistLastTwo: PSRStatus[] = [];
    dataSource = null;
    idToDelete: number;
    permissionP: boolean = true;
    permissionF: boolean = true;
    etapaSelect: any = 1
    etapas: EtapaProyecto[] = []
    psr: any[] = []
    submittedFEA: boolean = false
    //fechaPsr: Date;
    fechaPsr: string = '';
    formPsr: FormGroup;
    form: FormGroup;
    proyectoTexto: ProyectoString[] = new Array();
    client: Cliente[] = new Array();
    etap: EtapaProyecto[] = new Array();

    checked: boolean = false;
    estadoChecked: boolean = false;
    clienteChecked: boolean = false;
    etapaChecked: boolean = false;
    limpiarFiltroEstado = '';
    limpiarFiltroCliente = '';
    limpiarFiltroEtapa = '';
    filtroEstadoProyecto: string = '';
    filtroClienteProyecto: string = '';
    filtroEtapaProyecto: string = '';
    modalPlaneacion: NgbModalRef;
    fechaInicioFiltro: string = '';
    fechaFinFiltro: string = '';

    proyectoModal: Proyecto;
    porcentajeAvanceEsperado: number;
    porcentajeRealFecha: number;
    porcentajeDesviacion: number;
    horasPlaneadas: number;
    horasPropuestas: number;
    totalHoras: number = 0;
    totalHorasReales: number = 0;

    formSearchByFase: FormGroup;
    faseSearch: FaseProyecto = new FaseProyecto();
    actividadesAsig: ActividadAsignada[] = [];
    submittedFSBF: boolean = false;
    fases: FaseProyecto[] = [];
    proyectoFases: Proyecto = new Proyecto();
    empleadosAsig: Empleado[] = [];
    empAsignaciones: Empleado = new Empleado();
    fechasAsigEmp: RecursoActividad[] = [];
    idActividad: number = undefined;
    actividadAsig: ActividadAsignada = new ActividadAsignada();
    psrStatus: PSRStatus[] = [];
    fechaHoy: string = '';
    idProjectStatus: number;
    comentario: string = '';
    comentarioNotaSemanal: string = '';
    modalNotas: NgbModalRef;
    modalNotaSemanal: NgbModalRef;
    proyectStatusComentarios: ProjectStatusReportComentarios = new ProjectStatusReportComentarios;
    existeComentario: boolean = false;
    psrExiste: boolean = false;
    modalExit: NgbModalRef;
    existeComentarioNotaSemanal: boolean = false;
    validaComentarioDia: boolean = false;
    mostrarAgregarNotaSemanal: boolean = false;
    notaSemanal: NotasSemanaPSR = new NotasSemanaPSR();
    sessionRol: RolSeg = new RolSeg();
    @ViewChild('exitPage') myModal: any;

    @ViewChild(MatSort) sort: MatSort

    constructor(private proyectoService: ProyectoService,
        private modalService: NgbModal,
        private psrStatusService: PSRStatusService,
        private router: Router,
        private toastr: ToastrService,
        private etapaService: EtapaProyetoService,
        private psrService: PSRService,
        private toast: ToastrService,
        private formBuilder: FormBuilder,
        private actividadAsigService: ActividadAsignadaService,
        private recursoActService: RecursoActividadService,
        private faseService: FaseProyectoService,
        private reporteService: ReporteTiempoService,
        private empleadoService: EmpleadoService,
        private gestionUsuariosRolesService: GestionUsuariosRoles) { };

    columnas: string[] = ['opciones1', 'cliente', 'nombre', 'fecha_inicio', 'fecha_fin', 'horas_aprobadas', 'opciones'];
    session = localStorage.getItem('session');

    ngOnInit(): void {
        this.session = JSON.parse(this.session);
        this.gestionUsuariosRolesService.getByRol(parseInt(this.session['id'])).subscribe(data => {
            this.sessionRol = data;
        if (this.sessionRol.rolNombre === "USUARIO ADMINISTRADOR" || this.sessionRol.rolNombre === "LÍDER PROYECTOS" || this.sessionRol.rolNombre === "GERENTE DE PROYECTOS" || this.sessionRol.rolNombre === "DIRECTOR DE PROYECTOS") {
            this.router.navigate(['/error']);
            return;
        }
        });
        this.getEtapas();
        this.getProyectos();
        this.buildForm();
        this.getToday()
    }

    showNotaSemanalModal(content) {

        if (!this.validaComentarioDia) {
            this.psrService.getNotaSemanalesFechaHoy()//.pipe(finalize(() => ))
                .subscribe(data => {
                    if (data != undefined) {
                        if (data.comentario.length > 0) {
                            this.notaSemanal = data;
                            this.comentarioNotaSemanal = data.comentario;
                            this.existeComentarioNotaSemanal = true
                        } }
                    this.validaComentarioDia = true;
                }, error => {
                    console.log(error);
                    this.toast.error(error.message);
                });
        }


        this.modalNotaSemanal = this.modalService.open(content);
    }

    onExit() {
        return this.showExitModal(this.myModal)
    }

    filtrar(event: Event) {
        const filtro = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filtro.trim().toLowerCase();
    }


    convertirSaltosDeLinea(texto: string): string {
        return texto.replace(/\n/g, '<br>');
    }


    private getProyectos() {
        let proyectos: Proyecto[] = [];
        this.gestionUsuariosRolesService.getByRol(parseInt(this.session['id'])).subscribe(data => {
         this.sessionRol = data;
        if (this.sessionRol.rolNombre === "LÍDER PROYECTOS") {
            this.psrService.getProjectsForPsrByLiderAsignado(parseInt(this.session['id'])).subscribe(data => {
                data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1)).forEach(proyecto => {
                    if (!proyecto.interno) {
                        proyectos.push(proyecto);
                    }
                })
                this.proyectos = proyectos;
                this.proyectoTexto = this.castListObjectToStringList(proyectos);
                this.dataSource = new MatTableDataSource(this.castListObjectToStringList(this.proyectos));
                this.dataSource.sort = this.sort;
            }, error => {
                console.log(error);
            });
        } else if (this.sessionRol.rolNombre === "GERENTE DE PROYECTOS" || this.sessionRol.rolNombre === "USUARIO ADMINISTRADOR" || this.sessionRol.rolNombre === "DIRECTOR DE PROYECTOS") {
            this.psrService.getProjectsForPsr().subscribe(data => {
                data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1)).forEach(proyecto => {
                    if (!proyecto.interno) {
                        proyectos.push(proyecto);
                    }
                })
                this.proyectos = proyectos;
                this.proyectoTexto = this.castListObjectToStringList(proyectos);
                this.dataSource = new MatTableDataSource(this.castListObjectToStringList(this.proyectos));
            }, error => console.log(error));

        }
        });
    }

    private getProyectosFiltro() {
        let proyectos: Proyecto[] = [];
        let fechaI: Date = new Date(this.fechaInicioFiltro);
        let fechaF: Date = new Date(this.fechaFinFiltro);
        fechaI.setDate(fechaI.getDate() + 1);
        fechaF.setDate(fechaF.getDate() + 1);

        if (fechaI.getTime() > fechaF.getTime()) {
            return this.toastr.error('La fecha inicio debe ser menor a la fecha de fin.');
        }
        this.gestionUsuariosRolesService.getByRol(parseInt(this.session['id'])).subscribe(data => {
            this.sessionRol = data;
            if (this.sessionRol.rolNombre === "LÍDER PROYECTOS") {
                this.psrService.getProyectosForPsrByLiderFechaInicioFechaFin(this.fechaInicioFiltro, this.fechaFinFiltro, parseInt(this.session['id'])).subscribe(data => {
                    data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1)).forEach(proyecto => {
                        if (!proyecto.interno) {
                            proyectos.push(proyecto);
                        }
                    })
                    this.proyectos = proyectos;
                    this.proyectoTexto = this.castListObjectToStringList(proyectos);
                    this.dataSource = new MatTableDataSource(this.castListObjectToStringList(this.proyectos));
                    this.dataSource.sort = this.sort;
                }, error => {
                    console.log(error);
                });
            } else if (this.sessionRol.rolNombre === "GERENTE DE PROYECTOS" || this.sessionRol.rolNombre === "USUARIO ADMINISTRADOR" || this.sessionRol.rolNombre === "DIRECTOR DE PROYECTOS") {
                this.psrService.getProyectosForPsrByFechaInicioFechaFin(this.fechaInicioFiltro, this.fechaFinFiltro).subscribe(data => {
                    data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1)).forEach(proyecto => {
                        if (!proyecto.interno) {
                            proyectos.push(proyecto);
                        }
                    })
                    this.proyectos = proyectos;
                    this.proyectoTexto = this.castListObjectToStringList(proyectos);
                    this.dataSource = new MatTableDataSource(this.castListObjectToStringList(this.proyectos));
                    this.dataSource.sort = this.sort;
                }, error => console.log(error));
            }
        });
    }


    limpiarFiltros() {
        this.fechaInicioFiltro = null;
        this.fechaFinFiltro = null;
        this.getProyectos();
    }

    FiltrarProyectos() {
        this.getProyectosFiltro();
    }


    crearPsr() {
        if (this.psr.length > 0) {
            this.psrService.createPsrWithComment(this.psr).pipe(finalize(() => { if (this.comentarioNotaSemanal.length > 0) this.guardarNotaSemanal() })
            ).subscribe(data => {
                this.toast.success('Se creo la PSR de manera correcta');
                this.dataSource.data.forEach(proyectoCheck => {
                    proyectoCheck.checked = false;
                });
            }, error => {
                console.log(error);
                this.toast.error(error.message);
            });
        }


        this.psr = [];
    }

    guardarNotaSemanal() {

        this.notaSemanal.comentario = this.comentarioNotaSemanal;
        this.notaSemanal.empleado = new Empleado(this.session['id']);
        this.psrService.createNotasSemanal(this.notaSemanal).pipe(finalize(() => {
            this.comentarioNotaSemanal = "";
            this.existeComentarioNotaSemanal = false;
            this.mostrarAgregarNotaSemanal = false;
            this.notaSemanal = new NotasSemanaPSR();
        })
        ).subscribe(data => {
            this.dataSource.data.forEach(data => {
                console.log(data);
            });
        }, error => {
            console.log(error);
            this.toast.error(error.message);
        });

    }

    GuardarPsrConNota() {

        if (this.existeComentario) {
            let addProyecto = {
                "projectStatusReport": {
                    "empleado": {
                        "id": this.session['id']
                    },
                    "estado": "OK",
                    "proyecto": {
                        "id": this.proyectoModal.id
                    },
                    "codigo": this.proyectoModal.codigo,
                    "nombre": this.proyectoModal.nombre == undefined ? null : this.proyectoModal.nombre,
                    "descripcion": this.proyectoModal.descripcion,
                    "cliente": {
                        "id": this.proyectoModal.cliente.id
                    },
                    "nombreCliente": this.proyectoModal.cliente.nombre == undefined ? null : this.proyectoModal.cliente.nombre,
                    "porcentajeAvanceEsperado": this.porcentajeAvanceEsperado, // Valores calculados
                    "porcentajeAvanceReal": this.porcentajeRealFecha, // Valores calculados
                    "porcentajeDesviacion": this.porcentajeDesviacion, // Valores calculados
                    "horasAprobadas": this.proyectoModal.horasPlaneadas, // Valores calculados
                    "horasEjecutadas": this.proyectoModal.horasPlaneadas - this.proyectoModal.horasPropuesta, // Valores calculados
                    "horasReales": this.totalHorasReales, // Valores calculados
                },
                "psrStatus": {
                    "empleado": {
                        "id": this.session['id']
                    },
                    "comentario": this.comentario,
                    "comentarioGerencia": false
                },
                "psrExiste": this.psrExiste
            }
            this.psr.push(addProyecto);
            this.dataSource.data.forEach(proyectoCheck => {
                if (proyectoCheck.id == this.proyectoModal.id) {
                    proyectoCheck.checked = true
                }
            });
        }

        this.modalPlaneacion.close();
        this.mostrarAgregarNotaSemanal = true;
        this.proyectoModal = new Proyecto();
    }


    getTotalHoras() {
        let reportes: ReporteTiempo[] = [];
        let horas: number = 0;
        this.reporteService.findByProyecto(this.proyectoModal.id).subscribe(data => {
            reportes = data;
            for (let i = 0; i < reportes.length; i++) {
                if (reportes[i].estado.id == 2) {
                    horas += reportes[i].horas;
                }
            }
            this.totalHorasReales = horas;
        }, error => {
            console.log(error);
        });
    }



    getEtapas() {
        this.etapaService.getEtapasList().subscribe(data => {
            this.etapas = data;
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
    }

    deleteModal(content, id: number) {
        this.modalService.open(content);
        this.idToDelete = id;
    }

    castListObjectToStringList(listaObj: Proyecto[]) {
        let listString: ProyectoString[] = [];

        listaObj.forEach(obj => {
            let string: ProyectoString = new ProyectoString();
            string.id = obj.id;
            string.codigo = obj.codigo;
            string.costo = obj.costo;
            string.nombre = obj.nombre;
            string.descripcion = obj.descripcion;

            if (obj.fechaCreacion == null) {
                string.fechaCreacion = '';
            } else {
                obj.fechaCreacion = new Date(obj.fechaCreacion);
                obj.fechaCreacion.setDate(obj.fechaCreacion.getDate() + 1);
                string.fechaCreacion = obj.fechaCreacion.toLocaleDateString();
            }

            if (obj.fechaAprobacion == null) {
                string.fechaAprobacion = '';
            } else {
                string.fechaAprobacion = obj.fechaAprobacion.toString();
            }

            if (obj.fechaInicio == null) {
                string.fechaInicio = '';
            } else {
                string.fechaInicio = obj.fechaInicio.toString();
            }

            if (obj.fechaFin == null) {
                string.fechaFin = '';
            } else {
                string.fechaFin = obj.fechaFin.toString();
            }

            string.horasPlaneadas = obj.horasPlaneadas;
            string.horasPropuesta = obj.horasPropuesta;
            string.tipo = obj.tipo.id.toString();
            string.etapa = obj.etapa.etapa.toString();

            if (obj.componente == null) {
                string.componente = '';
            } else {
                string.componente = obj.componente.componente.toString();
            }

            string.cliente = obj.cliente.nombre;
            string.estadoPropuesta = obj.estadoPropuesta.estado.toString();
            string.estadoProyecto = obj.estadoProyecto.estado.toString();

            if (obj.directorIts == null) {
                string.directorIts = '';
            } else {
                string.directorIts = obj.directorIts.nombre.toString();
            }

            /* if(obj.directorClient == null) {
                string.directorClient = '';
            } else {
                string.directorClient = obj.directorClient.toString();
            } */

            if (obj.lider == null) {
                string.lider = '';
            } else {
                string.lider = obj.lider.nombre.toString();
            }

            string.creador = obj.creador;

            listString.push(string);
        });

        return listString;
    }

    get fea() {
        return this.formPsr.controls;
    }

    buildForm() {
        this.formPsr = this.formBuilder.group({
            fechaPsr: ['', [
                Validators.required
            ]]
        });
    }

    clearFiltro(event: MatCheckboxChange) {
        if (!event.checked) this.dataSource.data = this.proyectoTexto;
        this.filtroEstadoProyecto = '';
        this.filtroClienteProyecto = '';
        this.filtroEtapaProyecto = '';
        this.estadoChecked = false;
        this.clienteChecked = false;
        this.etapaChecked = false;
        this.resetSelect();
    }

    clearFiltroEstado(event: MatCheckboxChange) {
        if (!event.checked) this.limpiarFiltroEstado = '';
    }

    clearFiltroCliente(event: MatCheckboxChange) {
        if (!event.checked) this.limpiarFiltroCliente = '';
    }

    clearFiltroEtapa(event: MatCheckboxChange) {
        if (!event.checked) this.limpiarFiltroEtapa = '';
    }

    resetSelect() {
        this.limpiarFiltroEstado = '';
        this.limpiarFiltroCliente = '';
        this.limpiarFiltroEtapa = '';
    }

    onSelectEstado(event: MatSelectChange) {
        switch (event.source.id) {
            case "clienteProyec":
                for (const value of Object.values(this.client)) {
                    if (value.id == event.value) this.filtroClienteProyecto = value.nombre;
                }
                break;
            case "etapaProyec":
                for (const value of Object.values(this.etap)) {
                    if (value.id == event.value) this.filtroEtapaProyecto = value.etapa;
                }
                break;
        }
        let valoresValidos: ProyectoString[] = new Array();
        this.proyectoTexto.forEach(row => {
            if ((this.clienteChecked ? row.cliente == this.filtroClienteProyecto : true) &&
                (this.etapaChecked ? row.etapa == this.filtroEtapaProyecto : true)) {
                valoresValidos.push(row);
            }
        });
        this.dataSource.data = valoresValidos;
    }

    sortData(sort: Sort) {
        const data = this.dataSource.data.slice();
        if (!sort.active || sort.direction === '') {
            this.dataSource.data = data;
            return;
        }
        console.log(data);
        data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            return this.onCondition(sort.active, isAsc, a, b);
        });
        this.dataSource.data = data;
    }

    compare(a: string | number, b: string | number, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }


    onCondition(activo: string, orden: boolean, a: ProyectoString, b: ProyectoString) {
        switch (activo) {
            case 'nombre': return this.compare(a.nombre, b.nombre, orden);
            case 'codigo': return this.compare(a.codigo, b.codigo, orden);
            case 'estadoProyecto': return this.compare(a.estadoProyecto, b.estadoProyecto, orden);
            case 'cliente': return this.compare(a.cliente, b.cliente, orden);
            case 'etapa': return this.compare(a.etapa, b.etapa, orden);
            case 'creador': return this.compare(a.creador, b.creador, orden);
            case 'fecha_creacion': {
                const dateA = a.fechaCreacion.split('/');
                const dateB = b.fechaCreacion.split('/');
                return this.compare(Number(dateA[2] + dateA[1] + dateA[0]), Number(dateB[2] + dateB[1] + dateB[0]), orden);
            }
            default: return 0;
        }
    }

    openXlModal(content: TemplateRef<any>, id: number) {
        this.limpiarCalculos();
        this.getPlaneacionProyecto(id);
        this.modalPlaneacion = this.modalService
            .open(content, { size: "xl" });

        this.comentario = '';
        this.existeComentario = false;
        this.psrExiste = false;
        this.validarSiPsrYaExiste();
        this.calcularPorcentajeAvanceProyecto();
        this.calcularPorcentajeFecha();
        this.getActividadesAsignadas();
        this.getFases();
        this.getTotalHoras();
    }


    validarSiPsrYaExiste() {

        this.psrService.FindPsrByFeachaCreacionAndCodigoProyecto(this.fechaHoy, this.proyectoModal.codigo).subscribe(data => {
            if (data.psrStatus != null) {
                this.comentario = data.psrStatus.comentario;
                this.psrExiste = true;
            }
        }, error => console.log(error));

    }

    getPlaneacionProyecto(id: number) {
        this.proyectoModal = this.proyectos.filter(
            (proyecto) => proyecto.id == id
        )[0];
    }

    calcularPorcentajeAvanceProyecto() {
        const fechaInicio = new Date(this.proyectoModal.fechaInicio);
        const fechaFin = new Date(this.proyectoModal.fechaFin);
        const hoy = new Date();
        const tiempoTotal = fechaFin.getTime() - fechaInicio.getTime();
        const tiempoTranscurrido = hoy.getTime() - fechaInicio.getTime();
        const porcentajeAvance = (tiempoTranscurrido / tiempoTotal) * 100;
        if (porcentajeAvance >= 100) {
            this.porcentajeAvanceEsperado = 100;
        } else {
            this.porcentajeAvanceEsperado = Math.round(porcentajeAvance);
        }
    }

    calcularPorcentajeAvanceFases(fechaInicioString: any, fechaFinString: any) {
        const fechaInicio = new Date(fechaInicioString);
        const fechaFin = new Date(fechaFinString);
        const hoy = new Date();
        const tiempoTotal = fechaFin.getTime() - fechaInicio.getTime();
        const tiempoTranscurrido = hoy.getTime() - fechaInicio.getTime();
        const porcentajeAvance = (tiempoTranscurrido / tiempoTotal) * 100;
        if (porcentajeAvance >= 100) {
            return 100;
        } else {
            return Math.round(porcentajeAvance);
        }
    }

    calcularPorcentajeFecha() {
        this.getHorasEjecutadas();
    }

    calcularPorcentajeDesviacion() {
        const diferencia =
            ((this.porcentajeAvanceEsperado - this.porcentajeRealFecha) /
                this.porcentajeAvanceEsperado) *
            this.porcentajeAvanceEsperado;
        if (diferencia == 100) {
            this.porcentajeDesviacion = 100;
        } else {
            this.porcentajeDesviacion = Math.min(100, Math.max(-100, diferencia));
        }
    }

    getHorasEjecutadas() {
        let reportes: ReporteTiempo[] = [];
        let horas: number = 0;
        this.reporteService.findByProyecto(this.proyectoModal.id).subscribe(
            (data) => {
                reportes = data;
                for (let i = 0; i < reportes.length; i++) {
                    if (reportes[i].estado.id == 2) {
                        horas += reportes[i].horas;
                    }
                }
                this.totalHoras = horas;

                if (horas <= this.proyectoModal.horasPlaneadas) {
                    this.porcentajeRealFecha = 100;
                }
                const porcentajeFecha =
                    (horas / this.proyectoModal.horasPlaneadas) * 100;
                this.porcentajeRealFecha = Math.min(100, Math.max(0, porcentajeFecha));

                this.calcularPorcentajeDesviacion();
            },
            (error) => {
                console.log(error);
            }
        );
    }

    buildFormSearchByFase() {
        this.formSearchByFase = this.formBuilder.group({
            faseSearch: ["", [Validators.required]],
        });
    }

    searchActividadByFase() {
        if (!this.formSearchByFase) {
            return;
        }
        this.actividadAsigService
            .findByFase(this.proyectoModal.id, this.faseSearch.id)
            .subscribe(
                (data) => {
                    this.actividadesAsig = data;

                    if (this.actividadesAsig.length === 0) {
                        this.clear();
                        return this.toast.warning(
                            "No se han encontrado resultados con la fase seleccionada"
                        );
                    }

                    for (let i = 0; i < this.actividadesAsig.length; i++) {
                        this.recursoActService
                            .existsByActividad(this.actividadesAsig[i].id)
                            .subscribe(
                                (data) => {
                                    this.actividadesAsig[i].recursos = data;
                                },
                                (error) => this.toast.error(error)
                            );
                    }
                },
                (error) => this.toast.error(error)
            );
    }

    clear() {
        this.faseSearch = new FaseProyecto();
        this.getActividadesAsignadas();
    }

    getActividadesAsignadas() {
        this.actividadAsigService.findByProyecto(this.proyectoModal.id).subscribe(
            (data) => {
                this.actividadesAsig = data;
                this.actividadesAsig.forEach(actividad => {
                    actividad.porcentajeAvance = this.calcularPorcentajeAvanceFases(actividad.fechaInicio, actividad.fechaFin);
                });
                for (let i = 0; i < this.actividadesAsig.length; i++) {
                    this.recursoActService
                        .existsByActividad(this.actividadesAsig[i].id)
                        .subscribe(
                            (data) => {
                                this.actividadesAsig[i].recursos = data;
                            },
                            (error) => this.toast.error(error)
                        );
                }
            },
            (error) => {
                this.toast.error(error);
            }
        );
    }

    getFases() {
        this.proyectoService.getProyectoById(this.proyectoModal.id).subscribe(data => {
            this.proyectoFases = data;
            this.fases = [];
            if (this.proyectoFases.etapa.etapa === 'CRN') {
                this.faseService.findByProyectoAndBase(this.proyectoModal.id).subscribe(data => {
                    data.forEach(fase => {
                        if (fase.fase !== 'PROPUESTA') {
                            this.fases.push(fase);
                        }
                    });
                    this.fases = this.fases.sort((a, b) => (a.fase < b.fase ? -1 : 1));
                }, error => {
                    this.toast.error(error);
                });
            } else if (this.proyectoFases.etapa.etapa === 'PRP') {
                this.faseService.getFases().subscribe(data => {
                    data.forEach(fase => {
                        if (fase.fase === 'PROPUESTA') {
                            this.fases.push(fase);
                        }
                    });
                }, error => {
                    console.log(error);
                });
            }
        }, error => {
            console.log(error);
        });
    }

    openRecursoModal(content, id: number) {
        this.empAsignaciones = new Empleado();
        this.idActividad = id;

        this.actividadAsigService.getActividadById(this.idActividad).subscribe(data => {
            this.actividadAsig = data;
        }, error => this.toast.error(error));

        this.getEmpleadoAsignados();

        this.modalService.open(content, { size: 'xl', scrollable: true });
    }

    getCommentHist(codigoProyecto: string) {
        this.psrStatusService.ProjectStatusReportByCodigoProyecto(codigoProyecto)
            .pipe(finalize(() => this.filtrarComentarios())
            ).subscribe(data => {
                this.psrStatusHist = data;
                this.psrStatusHistLastTwo = [];
            }, error => console.log(error));
    }

    filtrarComentarios() {
        let contador = 0;
        this.psrStatusHist.reverse().forEach(historico => {
            if (contador <= 1) {
                this.psrStatusHistLastTwo.push(historico);
                contador++;
            }
        });
    }

    getEmpleadoAsignados() {
        this.recursoActService.findEmpleadosAsignados(this.idActividad).subscribe(data => {
            this.empleadosAsig = data;
        }, error => this.toast.error(error));
    }

    detailsRecursoAsignado(idEmpleado: number) {
        this.showAsignaciones();

        this.empleadoService.getEmpleadoById(idEmpleado).subscribe(data => {
            this.empAsignaciones = data;
        }, error => this.toast.error(error));

        this.recursoActService.findByEmpleadoAndActividad(idEmpleado, this.actividadAsig.id).subscribe(data => {
            data.sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
            this.fechasAsigEmp = data;
        }, error => this.toast.error(error));
    }

    hideAsignaciones() {
        document.getElementById('recursosAsignados').classList.remove('col-7', 'hide');
        document.getElementById('fechasAsignadasRecurso').classList.remove('d-block');
        this.empAsignaciones = new Empleado();
    }

    showAsignaciones() {
        document.getElementById('recursosAsignados').classList.add('col-7', 'hide');
        document.getElementById('fechasAsignadasRecurso').classList.add('d-block');
    }

    cancelBotton() {
        this.modalNotas.close();
        if (!this.existeComentario && !this.psrExiste) {
            this.comentario = null;
        }
    }

    cancelBottonNotaSemanal() {
        this.modalNotaSemanal.close();
        if (!this.existeComentarioNotaSemanal) {
            this.comentarioNotaSemanal = null;
        }
    }

    showNotasModal(content) {
        this.modalNotas = this.modalService.open(content);
        this.getCommentHist(this.proyectoModal.codigo);
    }

    getToday() {
        this.fechaHoy = new Date().toISOString().split('T')[0];
    }

    guardarComentario() {
        if (this.comentario.length > 0) {
            this.existeComentario = true;
        }
    }


    guardarComentarioSemanal() {
        if (this.comentarioNotaSemanal.length > 0) {
            this.existeComentarioNotaSemanal = true;
        }
    }


    limpiarCalculos() {
        this.porcentajeAvanceEsperado = 0;
        this.porcentajeRealFecha = 0;
        this.porcentajeDesviacion = 0;
    }

    cancelBottonExit() {
        this.modalExit.close();
    }

    closeModalPlaneacion(content: TemplateRef<any>) {
        if (this.existeComentario) {
            const result = this.modalService.open(content, { centered: true }).result.then((result) => {
                return result
            }).catch((res) => { });
            return result
        } else {
            this.modalPlaneacion.close();
        }
    }

    closeModalPlaneacionSinGuardar() {
        this.existeComentario = false;
        this.comentario = '';
        this.modalService.dismissAll();
    }

    showExitModal(content) {
        const result = this.modalService.open(content, { centered: true }).result.then((result) => {
            return result
        }).catch((res) => { });
        return result
    }

    editarNota() {
        this.existeComentario = false;
    }

    deleteNota() {
        this.comentario = '';
        this.existeComentario = false;
    }

    editarNotaSemanal() {
        this.existeComentarioNotaSemanal = false;
    }

    deleteNotaSemanal() {
        this.comentarioNotaSemanal = '';
        this.existeComentarioNotaSemanal = false;
    }

}

export class ProyectoString {
    id: number;
    codigo: string;
    costo: number;
    nombre: string;
    descripcion: string;
    fechaCreacion: string;
    fechaAprobacion: string;
    fechaInicio: string;
    fechaFin: string;
    horasPlaneadas: number;
    horasPropuesta: number;
    tipo: string;
    etapa: string;
    componente: string;
    cliente: string;
    estadoPropuesta: string;
    estadoProyecto: string;
    directorIts: string;
    directorClient: string;
    lider: string;
    creador: string;
    checked: boolean
}
