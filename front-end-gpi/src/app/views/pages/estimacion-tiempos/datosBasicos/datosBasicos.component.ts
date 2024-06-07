import { ProyectoService } from './../../../../service/proyecto.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Proyecto } from 'src/app/Model/proyecto';
import { Cargo } from 'src/app/model/cargo';
import { CargoService } from 'src/app/service/cargo.service';


    @Component({
    selector: 'app-datosBasicos',
    templateUrl: './datosBasicos.component.html',
    styleUrls: ['./datosBasicos.component.scss']
})
export class formularioDatosBasicos implements OnInit {

    /*
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }
    */

    cargos: Cargo[] = [];
    proyectos: Proyecto[] = [];

    constructor(
        private cargoService: CargoService,
        private proyectoService: ProyectoService,
    ){}

    datosBasicosForm: FormGroup;
    submitted: boolean = false;
    router: any;

    session = localStorage.getItem('session');



    ngOnInit(): void {
        this.getCargoList();
        this.getProyectoList();
    }

    getCargoList(){
        this.cargoService.getCargosList().subscribe(data => {
            this.cargos = data;
        }, error => console.log(error));
    }

    getProyectoList(){
        this.proyectoService.getProyectosList().subscribe(data => {
            this.proyectos = data;
        }, error => console.log(error));
    }



    get rf() { return this.datosBasicosForm.controls; }

    onSubmit() {
        this.submitted = true;
    }

}
