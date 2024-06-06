import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
//////////////////

import { ModeloService } from 'src/app/service/modelo.service';
import { Modelo } from 'src/app/model/modelo';

import { ProyectoService } from 'src/app/service/proyecto.service';
import { Proyecto } from 'src/app/Model/proyecto';

import { Empleado } from 'src/app/model/empleado';
import { EmpleadoService } from 'src/app/service/empleado.service';


import { EstadoProyecto } from 'src/app/Model/estado-proyecto';
import { EstadoProyectoService } from 'src/app/service/estado-proyecto.service';

import { TipoProyecto } from 'src/app/Model/tipo-proyecto';
import { TipoProyectoService } from 'src/app/service/tipo-proyecto.service';

import { EstimacionTiempos } from 'src/app/model/estimacion-ufs';
import { EstimacionTiempoService } from 'src/app/service/estimacion-tiempos.service';
import { Ufs } from 'src/app/model/ufs';
import { ActividadesComplementarias } from 'src/app/model/actividades-complementarias';

@Component({
    selector: 'app-crear-estimacion',
    templateUrl: './crear-estimacion.component.html',
    styleUrls: ['./crear-estimacion.component.scss'],
    providers: [NgbModalConfig, NgbModal]
})
export class crear_estimacion  implements OnInit {

    modelos: Modelo[]=[];
    TiEs:Modelo;

    Directores: Empleado[]=[];
    TiEsDi: Empleado;

    proyectos: Proyecto[]=[];
    TiEsP:Proyecto;
    

    EstadoProyectos: EstadoProyecto[]=[];
    TiEsEst:EstadoProyecto;


    TipoProyecto : TipoProyecto []=[];
    TiEsTi:TipoProyecto;

    estimacionTiempos: EstimacionTiempos = new EstimacionTiempos();

    formCreaEstimacion:FormGroup;
    submittedP: boolean = false;

    formDatosIniciales:FormGroup;
    submittedPp: boolean = false;

    constructor(
        config: NgbModalConfig,
        private toastr: ToastrService,
        /////////////////////////////

        private modeloService: ModeloService,
        private empleadoService: EmpleadoService,
        private ProyectoService: ProyectoService,
        private estadoService: EstadoProyectoService,
        private tipoService: TipoProyectoService,
        private estimacionTiempoService: EstimacionTiempoService,

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
       this.getModelos();
       this.getDirectoresPEstimacion();
       this.getProyectoList();
       this.getEstadosProyecto();
       this.getTipoProyecto();
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

    getModelos() {
        this.modeloService.getAllModelos().subscribe(data => {
            this.modelos = data;
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    getProyectoList(){
        this.ProyectoService.findByEtapa(1).subscribe(data => {
            this.proyectos = data;
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    getDirectoresPEstimacion(){
        this.empleadoService.getDirectoresPEstimacion().subscribe(data => {
            this.Directores = data;
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    getEstadosProyecto(){
        this.estadoService.getEstadosList().subscribe(data => {
            this.EstadoProyectos = data;
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    getTipoProyecto(){
        this.tipoService.getTiposList().subscribe(data => {
            this.TipoProyecto = data;
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    saveProyecto() {
        let estimacion: EstimacionTiempos = new EstimacionTiempos();
        estimacion.ufs = new Ufs();
        estimacion.recurso = this.TiEsDi;
        estimacion.modelo = this.TiEs;
        estimacion.proyecto = this.TiEsP;
        estimacion.actividadesComplementarias = new ActividadesComplementarias();
        console.log(estimacion);
        this.estimacionTiempoService.createEstimacionTiempoList(estimacion).subscribe(data => {
            this.toastr.success('Proyecto guardado correctamente!');
            this.hideSpinner();
        }, error => {
            setTimeout(() => {
                this.hideSpinner();
            }, 4000);
            console.log(error);
            this.toastr.error(error.error);
        });
    }


    
    onSubmit(): void {
        console.log('Form ->', this.formCreaEstimacion.value)
        console.log('Form ->', this.formDatosIniciales.value)
        this.submittedP = true;
        this.submittedPp = true;

        if (this.formDatosIniciales.invalid ) {
            return;
        }

        this.showSpinner();
        this.saveProyecto();
    }

    
    EstimacionE: boolean = false;

    EstimacionElejida(){
    this.EstimacionE = true;
    }


    showSpinner() {
        document.getElementById('con_spinner').style.display = 'block';
        document.getElementById('con_spinner').style.opacity = '100';
        document.getElementById('occ').style.display = 'none';
    }

    hideSpinner() {
        document.getElementById('con_spinner').style.display = 'none';
        document.getElementById('con_spinner').style.opacity = '0';
        document.getElementById('occ').style.display = 'block';
    }

  }


