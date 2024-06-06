import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProyectoService } from '../../../../service/proyecto.service';
import { Proyecto } from 'src/app/model/proyecto';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EstadoProyecto } from 'src/app/model/estado-proyecto';
import { Cliente } from 'src/app/model/cliente';
import { ClienteString } from '../../clientes/list-clientes/list-clientes.component';
import { EtapaProyecto } from 'src/app/model/etapa-proyecto';
import { MatSort, Sort } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { RolService } from 'src/app/service/rol.service';
import { GestionUsuariosRoles } from 'src/app/service/gestion-usuario-roles.service';
import { RolSeg } from 'src/app/model/rol-seg';


@Component({
    selector: 'app-list-proyectos',
    templateUrl: './list-proyectos.component.html',
    styleUrls: ['./list-proyectos.component.scss']
})
export class ListProyectoComponent implements OnInit {

    proyectos: Proyecto[] = new Array();
    estadoProyec: EstadoProyecto[] = new Array();
    client: Cliente[] = new Array();
    etap: EtapaProyecto[] = new Array();
    proyectoFiltro: Proyecto[] = new Array();
    dataSource = new MatTableDataSource(this.castListObjectToStringList(this.proyectos));

    proyectoTexto: ProyectoString[] = new Array();
    estadosProyecto: EstadoProyecto[] = new Array();
    clientesProyectos: Cliente[] = new Array();
    etapasProyecto: EtapaProyecto[] = new Array();
    roles: RolSeg[] = [];
    idToDelete: number;
    permissionP: boolean = true;
    permissionF: boolean = true;

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
    sessionRol: RolSeg = new RolSeg();


    constructor(private proyectoService: ProyectoService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService,
        private gestionUsuariosRolesService: GestionUsuariosRoles) { }

    @ViewChild(MatSort) sort: MatSort;

    columnas: string[] = ['nombre', 'estadoProyecto', 'cliente', 'etapa', 'creador', 'fecha_creacion', 'planeacion', 'facturacion', 'editar', 'eliminar'];

    session = localStorage.getItem('session');

    ngOnInit(): void {
        this.session = JSON.parse(this.session);
        this.dataSource.sort = this.sort;
        this.gestionUsuariosRolesService
        this.getProyectos();
    }

    filtrar(event: Event) {
        const filtro = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filtro.trim().toLowerCase();
    }

    private getProyectos() {
        let proyectos: Proyecto[] = [];
        let estadoProy = new Map();
        let clienteProy = new Map();
        let etapaProy = new Map();

        this.gestionUsuariosRolesService.getByRol(parseInt(this.session['id'])).subscribe(data => {
            this.sessionRol = data;
        
            if (this.sessionRol.rolNombre === "LÍDER PROYECTOS") {
                console.log("entro a lider");
                this.proyectoService.findByLiderAsignado(parseInt(this.session['id'])).subscribe(data => {
                    data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1)).forEach(proyecto => {
                        if (!proyecto.interno) {
                            proyectos.push(proyecto);
                            estadoProy.set(proyecto.estadoProyecto.id, proyecto.estadoProyecto);
                            clienteProy.set(proyecto.cliente.id, proyecto.cliente);
                            etapaProy.set(proyecto.etapa.id, proyecto.etapa);
                        }
                    });

                    estadoProy.forEach(estado => this.estadoProyec.push(estado));
                    clienteProy.forEach(cliente => this.client.push(cliente));
                    etapaProy.forEach(etapa => this.etap.push(etapa));
                    this.proyectos = proyectos;
                    this.proyectoTexto = this.castListObjectToStringList(proyectos);
                    this.dataSource = new MatTableDataSource(this.proyectoTexto);
                }
                    , error => {
                        console.log(error);
                    });
            } else if (this.sessionRol.rolNombre === "GERENTE DE PROYECTOS" || this.sessionRol.rolNombre === "USUARIO ADMINISTRADOR" || this.sessionRol.rolNombre === "DIRECTOR DE PROYECTOS") {
                console.log("entro al otro");
                this.proyectoService.getProyectosList().subscribe(data => {
                    data.sort((a, b) => (a.nombre < b.nombre ? -1 : 1)).forEach(proyecto => {
                        if (!proyecto.interno) {
                            proyectos.push(proyecto);
                            estadoProy.set(proyecto.estadoProyecto.id, proyecto.estadoProyecto);
                            clienteProy.set(proyecto.cliente.id, proyecto.cliente);
                            etapaProy.set(proyecto.etapa.id, proyecto.etapa);
                        }
                    });
                    estadoProy.forEach(estado => this.estadoProyec.push(estado));
                    clienteProy.forEach(cliente => this.client.push(cliente));
                    etapaProy.forEach(etapa => this.etap.push(etapa));
                    this.proyectos = proyectos;
                    this.proyectoTexto = this.castListObjectToStringList(proyectos);
                    this.dataSource = new MatTableDataSource(this.proyectoTexto);
                }, error => console.log(error));
            }
        }, error => console.log(error));

    }

    updateProyecto(id: number) {
        this.router.navigate(['proyectos/editar/', id]);
    }

    deleteModal(content, id: number) {
        this.modalService.open(content);
        this.idToDelete = id;
    }

    deleteProyecto() {
        this.proyectoService.deleteProyecto(this.idToDelete).subscribe(data => {
            this.idToDelete = undefined;
            this.modalService.dismissAll();
            this.getProyectos();
            this.toastr.warning('¡Proyecto eliminado correctamente!');
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
            this.modalService.dismissAll();
        });
    }

    planeacionProyecto(id: number) {
        this.router.navigate(['/proyectos/planeacion/', id]);
    }

    goToFacturacionProyecto(id: number) {
        let p: Proyecto = new Proyecto();

        this.proyectoService.getProyectoById(id).subscribe(data => {
            p = data;

            if (p.etapa.etapa == 'PRP') {
                return this.toastr.error('Acceso denegado, cambie el estado a CRN para añadir una factura');
            } else {
                this.router.navigate(['/proyectos/facturacion/programar/', id]);
            }
        }, error => {
            this.toastr.error(error)
        });

    }

    onSelectEstado(event: MatSelectChange) {
        switch (event.source.id) {
            case "estadProyec":
                for (const value of Object.values(this.estadoProyec)) {
                    if (value.id == event.value) this.filtroEstadoProyecto = value.estado;
                }
                break;
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
            if ((this.estadoChecked ? row.estadoProyecto == this.filtroEstadoProyecto : true) &&
                (this.clienteChecked ? row.cliente == this.filtroClienteProyecto : true) &&
                (this.etapaChecked ? row.etapa == this.filtroEtapaProyecto : true)) {
                valoresValidos.push(row);
            }
        });
        this.dataSource.data = valoresValidos;
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
                const formattedDateA = Number(dateA[2] + dateA[1].padStart(2, '0') + dateA[0].padStart(2, '0'));
                const formattedDateB = Number(dateB[2] + dateB[1].padStart(2, '0') + dateB[0].padStart(2, '0'));
                return this.compare(formattedDateA, formattedDateB, orden);
            }
            default: return 0;
        }
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
}