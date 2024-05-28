import { Component, OnInit } from '@angular/core';
import { FaseProyecto } from 'src/app/Model/fase-proyecto';
import { FaseProyectoService } from 'src/app/service/fase-proyecto.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
    selector: 'app-fases',
    templateUrl: './fases.component.html',
    styleUrls: ['./fases.component.scss']
})
export class FasesComponent implements OnInit {

    fases: FaseProyecto[] = [];
    faseToEdit: FaseProyecto = new FaseProyecto();

    constructor(private faseService: FaseProyectoService,
        private toastr: ToastrService,
        private router: Router) { }

    session = localStorage.getItem('session');

    ngOnInit(): void {
        this.session = JSON.parse(this.session);

        this.getFases();
    }

    getFases() {
        this.faseService.getFases().subscribe(data => {
            this.fases = data;
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
    }

    loadFase(id: number) {
        this.faseService.getFaseById(id).subscribe(data => {
            this.faseToEdit = data;
        }, error => {
            console.log(error);
            this.toastr.error(error);
        });
    }

    edit() {
        this.faseService.updateFase(this.faseToEdit.id, this.faseToEdit).subscribe(data => {
            this.toastr.info('Fase Actualizada correctamente.');
            this.faseToEdit = new FaseProyecto();
            this.getFases();
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    delete(id: number) {
        this.faseService.deleteFase(id).subscribe(data => {
            this.toastr.warning('Fase eliminada correctamente.');
            this.getFases();
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    cancelar() {
        this.faseToEdit = new FaseProyecto();
    }

}
