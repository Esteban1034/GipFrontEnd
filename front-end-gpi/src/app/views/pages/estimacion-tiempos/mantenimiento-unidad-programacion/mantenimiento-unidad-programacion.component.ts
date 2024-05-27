import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";


@Component({
    selector: 'app-mantenimiento-unidad-programacion',
    templateUrl: './mantenimiento-unidad-programacion.component.html',
    styleUrls: ['./mantenimiento-unidad-programacion.component.scss']
})
export class Mantenimiento_unidadprogramacion implements OnInit {
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}


