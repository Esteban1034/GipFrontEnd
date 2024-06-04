import { Component, OnInit, ViewChild } from "@angular/core";
import { MatInput } from "@angular/material/input";
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
  dataSource: MatTableDataSource<any>;
  filtroProyecto: boolean = false;
  filtroCliente: boolean = false;
  filtroEstado: boolean = false;
  mostrarFiltros: boolean = false;
  @ViewChild('input', {static:false}) input: any;

  constructor(private estimacionTiempoService: EstimacionTiempoService, private router: Router) {}

  ngOnInit(): void {
    this.getEstimaciones();
  }

  displayedColumns: string[] = ["id", "proyecto", "cliente", "estadopropuesta","ver","editar", "eliminar"];

  getEstimaciones() {
    this.estimacionTiempoService.getEstimacionTiempoList().subscribe(
      (data) => {
        this.estimaciones = data;
        console.log(this.estimaciones);
        this.dataSource = new MatTableDataSource(this.castListObject(this.estimaciones));
      },
      (error) => console.log(error)
    );
  }

  castListObject(listObject: EstimacionTiempos[]) {
    let listString: EstimacionesString[] = [];
    listObject.forEach((obj) => {
      let string: EstimacionesString = new EstimacionesString();
      string.id = obj.id;
      string.cliente = obj.proyecto.cliente.nombre;
      string.proyecto = obj.proyecto.nombre + "-" + obj.proyecto.descripcion;
      string.estadopropuesta = obj.proyecto.estadoPropuesta.estado;
      listString.push(string);
    });
    return listString;
  }

  ocultarFiltros() {
    setTimeout(() => {
      this.mostrarFiltros = false;
    }, 200); // A small delay to ensure checkboxes can be clicked
  }

  filtrar() {
    const filtro = this.input?.nativeElement?.value?.toLowerCase();
    this.dataSource.filterPredicate = (data: EstimacionesString, filter: string) => {
      let filtroProyecto = this.filtroProyecto ? data.proyecto.toLowerCase().includes(filter) : true;
      let filtroCliente = this.filtroCliente ? data.cliente.toLowerCase().includes(filter) : true;
      let filtroEstado = this.filtroEstado ? data.estadopropuesta.toLowerCase().includes(filter) : true;
      return filtroProyecto && filtroCliente && filtroEstado;
    };
    this.dataSource.filter = filtro?.trim().toLowerCase();
  }

  ver(row: any) {
    // me falta definir el enrutamiento real...
    this.router.navigate(['/estimaciones/ver-detalle', row.id]);
  }

  editar(row: any) {
    // me falta definir el enrutamiento real...
    this.router.navigate(['/estimaciones/editar-estimacion', row.id]);
  }

  eliminar(row: any) {
    console.log('Eliminar:', row);
    this.dataSource.data = this.dataSource.data.filter(item => item.id !== row.id);
    this.estimacionTiempoService.deleteEstimacionTiempoList(row.id).subscribe(response=>{
      console.log(response,'respuesta al eliminar');
      
    })
  }
}

export class EstimacionesString {
  id: number;
  cliente: string;
  proyecto: string;
  estadopropuesta: string;
}

