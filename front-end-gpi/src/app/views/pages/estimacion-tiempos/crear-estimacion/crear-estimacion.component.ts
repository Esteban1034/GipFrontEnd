import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
//////////////////
import { ClienteService } from 'src/app/service/cliente.service';
import { Cliente } from 'src/app/model/cliente';
/////////////////////
@Component({
    selector: 'app-crear-estimacion',
    templateUrl: './crear-estimacion.component.html',
    styleUrls: ['./crear-estimacion.component.scss'],
    providers: [NgbModalConfig, NgbModal]
})
export class crear_estimacion  implements OnInit {

    ///////////
    clientes: Cliente[]=[];
    /////////////////
    TiEs:Cliente;

    formCreaEstimacion:FormGroup;
    submittedP: boolean = false;

    formDatosIniciales:FormGroup;
    submittedPp: boolean = false;

    constructor(
        config: NgbModalConfig,
        private toastr: ToastrService,
        /////////////////////////////
        private clienteService: ClienteService,
        /////////////////////////////
        private  FBService: FormBuilder){ 
        
        config.backdrop = 'static';
        config.keyboard = false;    
        }

    ngOnInit(): void {
       // throw new Error('Method not implemented.');
    //   this.formCreaEstimacion = this.IForm();

       this.buildIForm();
       this.buildDatosIForm();


      /////////////////////
       this.getClientes();
      ///////////////////// 
    }

    get fp() { return this.formCreaEstimacion.controls; }

    buildIForm() {
        this.formCreaEstimacion = this.FBService.group({
        TipoEstimacion:['', [
            Validators.required,
        ]],
     })
    }
    

    get fpp() { return this.formDatosIniciales.controls; }

    buildDatosIForm() {
        this.formDatosIniciales = this.FBService.group({
        Director:['', [
            Validators.required,
        ]],
        NombreProyecto:['', [
            Validators.required,
        ]],
        fechaEstimacion:['', [
            Validators.required,
        ]],
        TipoProyecto:['', [
            Validators.required,
        ]],
        cicloVida:['', [
            Validators.required,
        ]],
     })
    }

    getClientes() {
        this.clienteService.getClientesList().subscribe(data => {
            this.clientes = data;
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }



    onSubmit(): void {
        console.log('Form ->', this.formCreaEstimacion.value)
        console.log('Form ->', this.formDatosIniciales.value)
        this.submittedP = true;
        this.submittedPp = true;
    }



    ATipoEstimacion= ['Modelo Iseries', 'Modelo de estimación metodologia agil','Modelo de estimación proyecto tradicional']
   
    
    EstimacionE: boolean = false;

    EstimacionElejida(){
    this.EstimacionE = true;
    }


    Proyectos=['Proyecto1','Proyecto2']

    Directores= ['Director 1', 'Director 2']

    tiposProyecto=['propuesta', 'corto','generico']

    ciclos=['cascada','iterativo incremental']

  }


