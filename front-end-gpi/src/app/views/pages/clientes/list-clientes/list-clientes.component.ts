import { Component, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from '../../../../service/cliente.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Cliente } from 'src/app/model/cliente';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
    selector: 'app-list-clientes',
    templateUrl: './list-clientes.component.html',
    styleUrls: ['./list-clientes.component.scss']
})
export class ListClientesComponent implements OnInit {
    
    clientes: Cliente[] = [];
    dataSource: MatTableDataSource<Cliente>; // Corregido aquí
    idToDelete: number;
    session = localStorage.getItem("session");

    @ViewChild(MatSort) sort: MatSort; // Agregado aquí

    columnas: string[] = ['nomenclatura', 'nombre', 'sector', 'estado', 'editar', 'eliminar'];

    constructor(private clienteService: ClienteService,
        private modalService: NgbModal,
        private router: Router,
        private toastr: ToastrService) { }

    ngOnInit(): void {
        this.session = JSON.parse(this.session);

        this.getClientes();
    }

    filtrar(event: Event) {
        const filtro = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filtro.trim().toLowerCase();
    }

    getClientes() {
        this.clienteService.getClientesList().subscribe(data => {
            this.clientes = data;
            this.dataSource = new MatTableDataSource(this.clientes);
            this.dataSource.sort = this.sort; // Asigna MatSort aquí
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

    sortData(event: Sort) {
        const data = this.clientes.slice(); // Cambiado aquí
        if (!event.active || event.direction === '') {
            this.dataSource.data = data;
            return;
        }

        this.dataSource.data = data.sort((a, b) => {
            const isAsc = event.direction === 'asc';
            switch (event.active) {
                case 'nomenclatura': return this.compare(a.nomenclatura, b.nomenclatura, isAsc);
                case 'nombre': return this.compare(a.nombre, b.nombre, isAsc);
                case 'sector': return this.compare(a.sector.sector, b.sector.sector, isAsc);
                case 'estado': return this.compare(a.estado.estado, b.estado.estado, isAsc);
        
                default: return 0;
            }
        });
    }

    compare(a: string | number, b: string | number, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
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
