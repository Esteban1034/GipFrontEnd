import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";


@Component({
    selector: 'app-mantenimiento_peso-hora',
    templateUrl: './mantenimiento-peso-hora.component.html',
    styleUrls: ['./mantenimiento-peso-hora.component.scss']
})
export class mantenimiento_peso implements OnInit {
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
}


