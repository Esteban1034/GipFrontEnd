import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../../service/cliente.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/model/cliente';
import { Proyecto } from 'src/app/Model/proyecto';

@Component({
    selector: 'app-list-clientes',
    templateUrl: './list-clientes.component.html',
    styleUrls: ['./list-clientes.component.scss']
})
export class ListClientesComponent implements OnInit {

    clientes: Cliente[] = [];
    dataSource = new MatTableDataSource();
    idToDelete: number;

    session = localStorage.getItem("session");

    constructor(private clienteService: ClienteService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService) { }


    columnas: string[] = ['nomenclatura', 'nombre', 'sector', 'estado', 'editar', 'eliminar'];

    ngOnInit(): void {
        this.session = JSON.parse(this.session);

        if (this.session["rol"] != "ROL_GP" && this.session["rol"] != "ROL_ADMIN" && this.session["rol"] != "ROL_LP" && this.session["rol"] != "ROL_DP") {
            this.router.navigate(['/error']);
            return;
        }

        this.getClientes();
    }

    filtrar(event: Event) {
        const filtro = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filtro.trim().toLowerCase();
    }

    getClientes() {
        this.clienteService.getClientesList().subscribe(data => {
            this.clientes = data;
            this.dataSource = new MatTableDataSource(this.castListObjectToStringList(this.clientes));
        }, error => console.log(error));
    }

    updateCliente(id: number) {
        this.router.navigate(['clientes/editar/', id]);
    }

    deleteModal(content, id: number) {
        this.modalService.open(content);
        this.idToDelete = id;
    }

    
    deleteCliente() {
        this.clienteService.deleteCliente(this.idToDelete).subscribe(data => {
            this.idToDelete = undefined;
            this.modalService.dismissAll();
            this.getClientes();
            this.toastr.warning('Cliente eliminado correctamente!');
        }, error => {
            this.toastr.error(error.error);
            this.modalService.dismissAll();
            console.log(error.error);
        });
    }

    castListObjectToStringList(listaObj: Cliente[]) {
        let listString: ClienteString[] = [];

        listaObj.forEach(obj => {
            let string: ClienteString = new ClienteString();
            string.id = obj.id;
            string.nomenclatura = obj.nomenclatura;
            string.nombre = obj.nombre;
            string.fechaCreacion = obj.fechaCreacion.toString();
            string.estado = obj.estado.estado;
            string.sector = obj.sector.sector;
            string.gerenteCuenta = obj.gerenteCuenta.nombre;

            listString.push(string);
        });

        return listString;
    }

}

export class ClienteString {
    id: number;
    codigo: string;
    nit: string;
    nomenclatura: string;
    nombre: string;
    fechaCreacion: string;
    estado: string;
    sector: string;
    gerenteCuenta: string;
}
