import { Component, OnInit, ViewChild } from "@angular/core";
import { MatInput } from "@angular/material/input";
import { MatTableDataSource } from "@angular/material/table";
import { EstimacionTiempos } from "src/app/model/estimacionTiempos";
import { EstimacionTiempoService } from "src/app/service/estimacion-tiempos.service";


@Component({
  selector: "app-estimaciones",
  templateUrl: "./estimaciones.component.html",
  styleUrls: ["./estimaciones.component.scss"],
})
export class EstimacionesTiempoComponent implements OnInit {
  estimaciones: EstimacionTiempos[] = [];
  dataSource = null;
  router: any;

  constructor(private estimacionTiempoService: EstimacionTiempoService) {}

  ngOnInit(): void {
    this.getEstimaciones();
  }

  displayedColumns: string[] = ["id", "proyecto", "cliente", "estadopropuesta","ver", "eliminar"];
  /* me falta verificar estimaciontiempos */

  getEstimaciones() {
    this.estimacionTiempoService.getEstimacionTiempoList().subscribe(
      (data) => {
        this.estimaciones = data;
        console.log(this.estimaciones);
        this.dataSource = new MatTableDataSource(this.castListObject(this.estimaciones))
      },
      (error) => console.log(error)
    );
  }

  castListObject(listObject: EstimacionTiempos[]) {
    let listString: EstimacionesString[] = [];

    listObject.forEach((obj) => {
      let string: EstimacionesString = new EstimacionesString();
      string.id = obj.id;
      string.cliente = obj.cliente.nombre;
      string.proyecto = obj.proyecto.nombre;
      string.estadopropuesta = obj.estadoPropuesta.estado;
      listString.push(string);
    });

    return listString;
  }
  @ViewChild('input') input: MatInput;

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
}
  
ver(row: any) {
  // me falta definir el enrutamiento real...
  this.router.navigate(['/estimaciones/detalle', row.id]);
}

  eliminar(row: any) {
    console.log('Eliminar:', row);
    this.dataSource.data = this.dataSource.data.filter(item => item.id !== row.id);
  }
}



export class EstimacionesString {
  id: number;
  cliente: string;
  proyecto: string;
  estadopropuesta: string;
}
