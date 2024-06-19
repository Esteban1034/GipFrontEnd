
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatInput } from "@angular/material/input";
import { MatSelectChange } from "@angular/material/select";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { EstadoPropuesta } from "src/app/Model/estado-propuesta";
import { Proyecto } from "src/app/Model/proyecto";
import { Cliente } from "src/app/model/cliente";
import { EstimacionTiempos } from "src/app/model/estimacion-ufs";
import { EstimacionTiempoService } from "src/app/service/estimacion-tiempos.service";

@Component({
  selector: "app-estimaciones",
  templateUrl: "./estimaciones.component.html",
  styleUrls: ["./estimaciones.component.scss"],
})
export class EstimacionesTiempoComponent implements OnInit {
 
  estimaciones: EstimacionTiempos[] = [];
  proyectos: Proyecto[] = [];
  client: Cliente[] = [];
  estadoPropues: EstadoPropuesta[] = [];
  dataSource = new MatTableDataSource(this.castListObjectToStringList(this.estimaciones));
  estimacionesTexto: EstimacionesString[] = [];
  idToDelete: number;
  checked: boolean = false;
  clientesProyectos: Cliente[] = [];
  pro: Proyecto[] = [];
  estadoChecked: boolean = false;
  clienteChecked: boolean = false;
  filtroEstadoPropuesta: string = '';
  filtroClienteProyecto: string = '';
  limpiarFiltroEstado = '';
  limpiarFiltroCliente = '';
  
  constructor(private estimacionTiempoService: EstimacionTiempoService, 
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService) { }

    
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ["id", "proyecto", "cliente", "estadoPropuesta", "ver", "editar", "eliminar"];

    session = localStorage.getItem('session');

  ngOnInit(): void {
    this.session = JSON.parse(this.session);
    this.dataSource.sort = this.sort;

    if (this.session['rol'] != 'ROL_ADMIN' && this.session['rol'] != 'ROL_LP' && this.session['rol'] != 'ROL_GP' && this.session['rol'] != 'ROL_DP') {
        this.router.navigate(['/error']);
        return;
    }

    this.getEstimaciones();
}

getEstimaciones() {
  let estadoPropues = new Map();
  let clienteProy = new Map();

  this.estimacionTiempoService.getEstimacionTiempoList().subscribe(
    (data) => {
      console.log('Datos recibidos:', data);
      this.estimaciones = data;

      this.client = [];
      this.estadoPropues = [];

      this.estimaciones.forEach(estimacion => {
        estadoPropues.set(estimacion.id, estimacion.proyecto.estadoPropuesta);
        clienteProy.set(estimacion.id, estimacion.proyecto.cliente);
      });

      clienteProy.forEach(cliente => {
        if (!this.client.some(c => c.id === cliente.id)) {
          this.client.push(cliente);
        }
      });
      estadoPropues.forEach(estado => {
        if (!this.estadoPropues.some(e => e.id === estado.id)) {
          this.estadoPropues.push(estado);
        }
      });

      this.estimacionesTexto = this.castListObjectToStringList(data);
      this.dataSource = new MatTableDataSource(this.estimacionesTexto);
      this.dataSource.sort = this.sort;
    },
    (error) => console.log(error)
  );
}

onSelectEstado(event: MatSelectChange) {
  switch (event.source.id) {
      case "estadPropues":
          for (const value of Object.values(this.estadoPropues)) {
              if (value.id == event.value) this.filtroEstadoPropuesta = value.estado;
          }
          break;
      case "clienteProyec":
          for (const value of Object.values(this.client)) {
              if (value.id == event.value) this.filtroClienteProyecto = value.nombre;
          }
          break;
                 
  }
  
  let valoresValidos: EstimacionesString[] = [];
  this.estimacionesTexto.forEach(row => {
      let estadoPropuestaValido = this.estadoChecked ? row.estadoPropuesta == this.filtroEstadoPropuesta : true;
      let clienteValido = this.clienteChecked ? row.cliente == this.filtroClienteProyecto : true;

      if (estadoPropuestaValido && clienteValido) {
          valoresValidos.push(row);
      }
  });
  
  this.dataSource.data = valoresValidos;
}




  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
}
  clearFiltro(event: MatCheckboxChange) {
    if (!event.checked) this.dataSource.data = this.estimacionesTexto;
    this.filtroEstadoPropuesta = '';
    this.filtroClienteProyecto = '';
    this.estadoChecked = false;
    this.clienteChecked = false;
    this.resetSelect();
}
  clearFiltroEstado(event: MatCheckboxChange) {
    if (!event.checked) this.limpiarFiltroEstado = '';
}
clearFiltroCliente(event: MatCheckboxChange) {
    if (!event.checked) this.limpiarFiltroCliente = '';
}


resetSelect() {
this.limpiarFiltroEstado = '';
this.limpiarFiltroCliente = '';
}

ver(row: any) {
  this.router.navigate(['/estimaciones/ver-detalle', row.id]);
}

editar(row: any) {
  this.router.navigate(['/estimaciones/editar-estimacion', row.id]);
}

eliminar(row: any) {
  const confirmacion = confirm('¿Estás seguro de que deseas eliminar este elemento?');
  if (confirmacion) {
    console.log('Eliminar:', row);
    this.dataSource.data = this.dataSource.data.filter(item => item.id !== row.id);
    this.estimacionTiempoService.deleteEstimacionTiempoList(row.id).subscribe(response => {
      console.log(response, 'respuesta al eliminar');
    });
  }
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
return a.toString().localeCompare(b.toString(), undefined, { numeric: true }) * (isAsc ? 1 : -1);
}

onCondition(activo: string, orden: boolean, a: EstimacionesString, b: EstimacionesString) {
switch (activo) {
case 'cliente':
return this.compare(a.cliente, b.cliente, orden);
case 'estadopropuesta':
return this.compare(a.estadoPropuesta, b.estadoPropuesta, orden);
default:
return 0;
}
}

castListObjectToStringList(listObject: EstimacionTiempos[]) {
  let listString: EstimacionesString[] = [];
  listObject.forEach((obj) => {
    let string: EstimacionesString = new EstimacionesString();
    string.id = obj.id;

    // Validación de las propiedades antes de usarlas
    string.proyecto = (obj.proyecto.nombre || 'Nombre no disponible') + "-" + (obj.proyecto.descripcion || 'Descripción no disponible');
    string.cliente = obj.proyecto.cliente.nombre || 'Nombre de cliente no disponible';
    string.estadoPropuesta = obj.proyecto.estadoPropuesta.estado || 'Estado no disponible';

    listString.push(string);
  });
  return listString;
}
}

export class EstimacionesString {
  id: number;
  proyecto: string;
  cliente: string;
  estadoPropuesta: string;
}