import { Component, OnInit, ViewChild } from "@angular/core";
import { MatInput } from "@angular/material/input";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { EstimacionTiempos } from "src/app/model/estimacion-ufs";
import { EstimacionTiempoService } from "src/app/service/estimacion-tiempos.service";

@Component({
  selector: "app-estimaciones",
  templateUrl: "./estimaciones.component.html",
  styleUrls: ["./estimaciones.component.scss"],
})
export class EstimacionesTiempoComponent implements OnInit {
  estimaciones: EstimacionTiempos[] = [];
  dataSource: MatTableDataSource<EstimacionTiempos>;
  estimacionesTexto: EstimacionesString[] = [];

  filtroProyecto: boolean = false;
  filtroCliente: boolean = false;
  filtroEstado: boolean = false;
  mostrarFiltros: boolean = false;
  @ViewChild('input', { static: false }) input: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private estimacionTiempoService: EstimacionTiempoService, private router: Router) {}

  ngOnInit(): void {
    this.getEstimaciones();
  }

  displayedColumns: string[] = ["id", "proyecto", "cliente", "estadopropuesta", "ver", "editar", "eliminar"];

  getEstimaciones() {
    this.estimacionTiempoService.getEstimacionTiempoList().subscribe(
      (data) => {
        this.estimaciones = data;
        this.estimacionesTexto = this.castListObject(data);
        this.dataSource = new MatTableDataSource(this.estimaciones);
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.createFilter();
      },
      (error) => console.log(error)
    );
  }

  createFilter(): (data: EstimacionTiempos, filter: string) => boolean {
    return (data: EstimacionTiempos, filter: string): boolean => {
      const transformedFilter = filter.trim().toLowerCase();
      const filtroProyecto = data.proyecto.nombre.toLowerCase().includes(transformedFilter);
      const filtroCliente = data.proyecto.cliente.nombre.toLowerCase().includes(transformedFilter);
      const filtroEstado = data.proyecto.estadoPropuesta.estado.toLowerCase().includes(transformedFilter);
      return filtroProyecto || filtroCliente || filtroEstado;
    };
  }

  filtrar() {
    const filtro = this.input.nativeElement.value.trim().toLowerCase();
    this.dataSource.filter = filtro;
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
    data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.onCondition(sort.active, isAsc, a, b);
    });
    this.dataSource.data = data;
  }

  compare(a: string | number, b: string | number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  onCondition(activo: string, orden: boolean, a: EstimacionTiempos, b: EstimacionTiempos) {
    switch (activo) {
      case 'proyecto': return this.compare(a.proyecto.nombre, b.proyecto.nombre, orden);
      case 'cliente': return this.compare(a.proyecto.cliente.nombre, b.proyecto.cliente.nombre, orden);
      case 'estadopropuesta': return this.compare(a.proyecto.estadoPropuesta.estado, b.proyecto.estadoPropuesta.estado, orden);
      default: return 0;
    }
  }

  castListObject(listObject: EstimacionTiempos[]): EstimacionesString[] {
      let listString: EstimacionesString[] = [];
      listObject.forEach((obj) => {
        let string: EstimacionesString = new EstimacionesString();
        string.id = obj.id;     
        string.proyecto = obj.proyecto.nombre + "-" + obj.proyecto.descripcion;
        string.cliente = obj.proyecto.cliente.nombre;
        string.estadopropuesta = obj.proyecto.estadoPropuesta.estado;
        listString.push(string);
      });
      return listString;
  }
}

export class EstimacionesString {
  id: number;
  proyecto: string;
  cliente: string;
  estadopropuesta: string;
}
