import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Novedad } from 'src/app/Model/novedad';
import { NovedadService } from 'src/app/service/novedad.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-novedades',
    templateUrl: './novedades.component.html',
    styleUrls: ['./novedades.component.scss']
})
export class NovedadesComponent implements OnInit {

    novedades: Novedad[];
    columnas: string[] = ['novedad', 'fecha inicio', 'fecha fin', 'empleado', 'eliminar'];
    dataSource = new MatTableDataSource();
    idToDelete: number = undefined;

    constructor(private novedadService: NovedadService,
        private modalService: NgbModal,
        private toastr: ToastrService) { }

    ngOnInit(): void {
        this.getNovedades();
    }

    getNovedades() {
        this.novedadService.getNovedadesList().subscribe(data => {
            this.novedades = data;
            this.dataSource = new MatTableDataSource(this.castListObjectToStringList(this.novedades));
        }, error => console.log(error));
    }

    filtrar(event: Event) {
        const filtro = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filtro.trim().toLowerCase();
    }

    deleteModal(content, id: number) {
        this.modalService.open(content);
        this.idToDelete = id;
    }

    deleteNovedad() {
        this.novedadService.deleteNovedad(this.idToDelete).subscribe(data => {
            this.idToDelete = undefined;
            this.modalService.dismissAll();
            this.getNovedades();
            this.toastr.warning('Novedad eliminada correctamente!');
        }, error => console.log(error));
    }

    castListObjectToStringList(listaObj: Novedad[]) {
        let listString: NovedadString[] = [];

        listaObj.forEach(obj => {
            let string: NovedadString = new NovedadString();
            string.id = obj.id;
            string.fechaInicio = obj.fechaInicio.toString();
            string.fechaFin = obj.fechaFin.toString();
            string.empleado = obj.empleado.nombre.toString();
            string.causa = obj.causa.causas.toString();

            listString.push(string);
        });

        return listString;
    }

}

export class NovedadString {
    id: number;
    fechaInicio: string;
    fechaFin: string;
    empleado: string;
    causa: string;
}
