import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProyectoService } from '../../../../service/proyecto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PSRService } from 'src/app/service/project-status-report.service';
import { ProyectoStatusReport } from 'src/app/model/project-status.-report';
import { EtapaProyecto } from 'src/app/Model/etapa-proyecto';
import { EtapaProyetoService } from 'src/app/service/etapa-proyecto.service';
import { PSRStatusService } from 'src/app/service/PSRStatus.service';
import { PSRStatus } from 'src/app/model/PSRStatus';
import { Empleado } from 'src/app/model/empleado';
import { finalize } from 'rxjs/operators';
import { NotasSemanaPSR } from 'src/app/model/notas-semana-psr';

@Component({
    selector: 'app-list-psr',
    templateUrl: './list-psr.component.html',
    styleUrls: ['./list-psr.component.scss']
})
export class ListPsrComponent implements OnInit {

    projectStatusReports: ProyectoStatusReport[] = [];
    psrStatus: PSRStatus[] = [];
    psrStatusHist: PSRStatus[] = [];
    psrStatusHistLastTwo: PSRStatus[] = [];
    dataSource = null;
    modalNotas: NgbModalRef;
    modalEliminar: NgbModalRef;
    modalNotasSemanales: NgbModalRef;
    fechaInicioFiltro: string = '';
    fechaFinFiltro: string = '';
    fechaHoy: string = '';
    idProjectStatus: number;
    nombreProjectStatus: number;
    comentario: string = '';
    nuevoComentario: boolean = false;
    esComentarioMismoDia: boolean = false;
    idToDelete: number;
    idToUpdate: number;
    idPsrSeleccionado: number;
    psrValidadas: number[] = [];
    notasSemanales: NotasSemanaPSR[] = [];
    mostrarHoras: boolean = false;
    tituloBoton: string = "Ver Horas"
    nuevoComentarioSemanal: boolean = false;
    observacionNotaSemanal: string = '';
    observacionNotaSemanalObje: NotasSemanaPSR = new NotasSemanaPSR();
    NotaSemanalSeleccionada: NotasSemanaPSR = new NotasSemanaPSR();

    @ViewChild(MatSort) sort: MatSort

    constructor(private proyectoService: ProyectoService,
        private modalService: NgbModal,
        private router: Router,
        private etapaService: EtapaProyetoService,
        private psrService: PSRService,
        private psrStatusService: PSRStatusService,
        private toastr: ToastrService) { }


    columnas: string[] = ['opciones1', 'nombreCliente', 'nombre', 'fecha_creacion_psr', 'avance_esperado', 'avance_real', 'desviacion', 'opciones'];
    columnas2: string[] = ['opciones1', 'nombreCliente', 'nombre', 'fecha_creacion_psr', 'horas_aprobadas', 'horas_reales', 'opciones'];

    session = localStorage.getItem('session');

    ngOnInit(): void {
        this.getPsrList();
        this.getNotasSemanales();
        this.session = JSON.parse(this.session);
    }

    actualizarTabla() {
        if (!this.mostrarHoras) {
            this.mostrarHoras = true;
            this.tituloBoton = "Ver Avances"
        } else if (this.mostrarHoras) {
            this.mostrarHoras = false;
            this.tituloBoton = "Ver Horas"
        }
    }

    convertirSaltosDeLinea(texto: string): string {
        return texto.replace(/\n/g, '<br>');
      }

    crearObservacion(Notaseleccionada: NotasSemanaPSR) {
        this.nuevoComentarioSemanal = true;
        this.NotaSemanalSeleccionada = Notaseleccionada;
    }

    guardarObservacionNotaSemanal() {

        this.observacionNotaSemanalObje.comentario = this.observacionNotaSemanal;
        this.observacionNotaSemanalObje.empleado = new Empleado(this.session['id']);
        this.observacionNotaSemanalObje.esObservacion = true;
        this.observacionNotaSemanalObje.fechaCreacion = this.NotaSemanalSeleccionada.fechaCreacion;

        this.psrService.createObservacionNotaSemanal(this.observacionNotaSemanalObje).pipe(finalize(() => {
            this.observacionNotaSemanal = "";
            this.nuevoComentarioSemanal = false;
            this.observacionNotaSemanalObje = new NotasSemanaPSR();
        })
        ).subscribe(data => {
            if (this.fechaInicioFiltro.length > 0 && this.fechaFinFiltro.length > 0) {
                this.getNotasSemanalesFechaIFechaF();
            } else {
                this.getNotasSemanales();
            }
        }, error => {
            console.log(error);
            this.toastr.error(error.message);
        });

    }




    getPsrList() {
        this.psrService.getPsrList()
            .pipe(finalize(() => this.validarPsrVisualizada())
            ).subscribe(data => {
                this.projectStatusReports = data;
                console.log("PSRSSSSSSS");
                console.log(this.projectStatusReports);
                this.dataSource = new MatTableDataSource(this.castListObjectToStringList(this.projectStatusReports));
                this.dataSource.sort = this.sort;
            }, error => console.log(error));
    }

    getNotasSemanales() {
        this.psrService.getNotasSemanales()
            //.pipe(finalize(() => this.validarPsrVisualizada()))
            .subscribe(data => {
                this.notasSemanales = data;
                console.log(this.notasSemanales);
            }, error => console.log(error));
    }


    getNotasSemanalesFechaIFechaF() {
        this.psrService.getNotasSemanalesFechaIFechaF(this.fechaInicioFiltro, this.fechaFinFiltro)
            //.pipe(finalize(() => this.validarPsrVisualizada()))
            .subscribe(data => {
                this.notasSemanales = data;
                console.log(this.notasSemanales);
            }, error => console.log(error));
    }

    showNotaSemanalModal(content) {
        this.modalNotasSemanales = this.modalService.open(content);
    }


    filtrar(event: Event) {
        const filtro = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filtro.trim().toLowerCase();
    }

    getComentariosPSR(id: number) {

        let hoy = new Date();
        this.fechaHoy = hoy.toString();
        this.idPsrSeleccionado = id;
        this.psrStatusService.getPSRStatusByProjectStatusReport(id).subscribe(data => {
            this.psrStatus = data;
            this.psrStatus.forEach(psr => {
                if (psr.comentarioGerencia && (new Date(psr.fechaCreacionStatus).toISOString().split('T')[0] == hoy.toISOString().split('T')[0])) {
                    this.esComentarioMismoDia = true;
                    psr.esComentarioMismoDia = true;
                } else {
                    this.esComentarioMismoDia = false;
                }
            });
        }, error => console.log(error));
    }


    getCommentHist(idPsr: number, codigoProyecto: string) {
        this.psrStatusService.ProjectStatusReportByCodigoProyecto(codigoProyecto)
            .pipe(finalize(() => this.filtrarComentarios(idPsr))
            ).subscribe(data => {
                this.psrStatusHist = data;
                this.psrStatusHistLastTwo = [];
            }, error => console.log(error));

    }

    guardarComentario() {

        if (this.idToUpdate != null) {
            this.updateComentario();
        } else {

            let addpsrStatus = {
                "psrproyecto": {
                    "id": this.idProjectStatus
                },
                "empleado": {
                    "id": this.session['id']
                },
                "comentario": this.comentario,
                "comentarioGerencia": true
            }

            this.psrStatusService.createPsrComentario(addpsrStatus)
                .pipe(finalize(() => this.getComentariosPSR(this.idProjectStatus))
                ).subscribe(data => {
                    this.comentario = null;
                    this.nuevoComentario = false;
                }, error => console.log(error));
        }
    }

    updateComentario() {

        let addpsrStatus = {

            "id": this.idToUpdate,
            "psrproyecto": {
                "id": this.idProjectStatus
            },
            "empleado": {
                "id": this.session['id']
            },
            "comentario": this.comentario,
            "comentarioGerencia": true
        }

        this.psrStatusService.createPsrComentario(addpsrStatus)
            .pipe(finalize(() => this.getComentariosPSR(this.idProjectStatus))
            ).subscribe(data => {
                this.comentario = null;
                this.nuevoComentario = false;
            }, error => console.log(error));
    }

    editarNota(id: number) {
        this.idToUpdate = id;
        this.comentario = this.psrStatus.find(x => x.id === id).comentario;
        this.nuevoComentario = true;
    }

    deleteModal(content, id: number) {
        this.modalEliminar = this.modalService.open(content);
        this.idToDelete = id;
    }

    deleteNota() {
        this.psrStatusService.deletePsrComentario(this.idToDelete).subscribe(data => {
            this.modalEliminar.close();
            this.idToDelete = undefined;
            this.getComentariosPSR(this.idPsrSeleccionado);
            this.toastr.warning('Comentario eliminado correctamente!');
        }, error => {
            this.modalService.dismissAll();
            console.log(error.error);
        });
    }


    showNotasModal(content, psr) {
        this.comentario = '';
        this.idPsrSeleccionado = undefined;
        this.esComentarioMismoDia = false;
        this.modalNotas = this.modalService.open(content);
        this.idProjectStatus = psr.id;
        this.nombreProjectStatus = psr.nombre + psr.descripcion;
        this.getComentariosPSR(psr.id);
        this.getCommentHist(psr.id, psr.codigo);

        this.dataSource.data.forEach(proyectoCheck => {
            if (proyectoCheck.id == psr.id) {
                this.psrValidadas.push(psr.id);
                proyectoCheck.checked = true;
            }
        });
    }

    FiltrarPsr() {

        let fechaI: Date = new Date(this.fechaInicioFiltro);
        let fechaF: Date = new Date(this.fechaFinFiltro);
        fechaI.setDate(fechaI.getDate() + 1);
        fechaF.setDate(fechaF.getDate() + 1);

        if (fechaI.getTime() > fechaF.getTime()) {
            return this.toastr.error('La fecha inicio debe ser menor a la fecha de fin.');
        }

        this.psrService.getPsrListBetweenFechaInicioAndFechaFin(this.fechaInicioFiltro, this.fechaFinFiltro)
            .pipe(finalize(() => { this.validarPsrVisualizada(); this.getNotasSemanalesFechaIFechaF(); })
            ).subscribe(data => {
                this.projectStatusReports = data;
                this.dataSource = new MatTableDataSource(this.castListObjectToStringList(this.projectStatusReports));
                this.dataSource.sort = this.sort;
            }, error => console.log(error));
    }

    cancelBotton() {
        this.comentario = null;
        this.nuevoComentario = false;
    }

    getToday(): string {
        return new Date().toISOString().split('T')[0]
    }

    limpiarFiltros() {
        this.fechaInicioFiltro = null;
        this.fechaFinFiltro = null;
        this.getPsrList();
        this.getNotasSemanales();
    }

    validarPsrVisualizada() {
        this.dataSource.data.forEach(proyectoCheck => {
            this.psrValidadas.forEach(psrCheck => {
                if (proyectoCheck.id == psrCheck) {
                    proyectoCheck.checked = true;
                }
            });
        });
    }

    filtrarComentarios(idPsr: number) {
        let contador = 0;
        this.psrStatusHist.reverse().forEach(historico => {
            if (historico.psrproyecto.id < idPsr && contador <= 1) {
                this.psrStatusHistLastTwo.push(historico);
                contador++;
            }
        });
    }

    castListObjectToStringList(listaObj: ProyectoStatusReport[]) {
        let listString: ProyectoStatusReportString[] = [];

        listaObj.forEach(obj => {
            let string: ProyectoStatusReportString = new ProyectoStatusReportString();
            string.id = obj.id;
            string.codigo = obj.codigo;
            string.nombre = obj.proyecto.nombre;
            string.descripcion = obj.descripcion;
            string.fechaCreacionPsr = obj.fechaCreacionPsr.toString();
            string.nombreCliente = obj.nombreCliente;
            string.estado = obj.estado;
            string.porcentajeAvanceEsperado = obj.porcentajeAvanceEsperado;
            string.porcentajeAvanceReal = obj.porcentajeAvanceReal;
            string.porcentajeDesviacion = obj.porcentajeDesviacion;
            string.horasAprobadas = obj.horasAprobadas;
            string.horasEjecutadas = obj.horasEjecutadas;
            string.horasReales = obj.horasReales;
            string.tipoProyecto = obj.proyecto.etapa.etapa;
            listString.push(string);
        });
        return listString;
    }

    VerInforme() {
        this.router.navigate(['/psr/informe-psr'])
    }
}

export class ProyectoStatusReportString {
    id: number;
    codigo: string;
    descripcion: string;
    nombre: string;
    fechaCreacionPsr: string;
    nombreCliente: string;
    estado: string;
    porcentajeAvanceEsperado: number;
    porcentajeAvanceReal: number;
    porcentajeDesviacion: number;
    horasAprobadas: number;
    horasEjecutadas: number;
    horasReales: number;
    tipoProyecto: string;
    checked: boolean;
}