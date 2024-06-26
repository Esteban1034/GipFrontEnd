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


//import { EstadoProyecto } from 'src/app/Model/estado-proyecto';
//import { EstadoProyectoService } from 'src/app/service/estado-proyecto.service';

import { TipoProyecto } from 'src/app/Model/tipo-proyecto';
import { TipoProyectoService } from 'src/app/service/tipo-proyecto.service';


import { EtapaProyecto } from 'src/app/Model/etapa-proyecto';
import { EtapaProyetoService } from 'src/app/service/etapa-proyecto.service';

import { EstimacionTiempos } from 'src/app/model/estimacion-ufs';
import { EstimacionTiempoService } from 'src/app/service/estimacion-tiempos.service';
import { Ufs } from 'src/app/model/ufs';
import { ActividadesComplementarias } from 'src/app/model/actividades-complementarias';
import { EstimacionUfsDTO } from 'src/app/model/estimacion-ufsDTO';
import { Cliente } from 'src/app/model/cliente';
import { ClienteService } from 'src/app/service/cliente.service';


@Component({
    selector: 'app-crear-estimacion',
    templateUrl: './crear-estimacion.component.html',
    styleUrls: ['./crear-estimacion.component.scss'],
    providers: [NgbModalConfig, NgbModal]
})
export class crear_estimacion  implements OnInit {

    modelos: Modelo[]=[];
    TiEs:Modelo;
    selectUfs:Ufs;

    Directores: Empleado[]=[];
    TiEsDi: Empleado;

    clientes: Cliente[]=[];
    proyectos: Proyecto[]=[];
    selectedClienteId: number| null = null;
    TiEsP:Proyecto;

    //
    btnContinue = false;
    //

    //EstadoProyectos: EstadoProyecto[]=[];
    //TiEsEst:EstadoProyecto;

    CicloDeVidaProyecto : TipoProyecto []=[];
    TiEsCV:TipoProyecto;

    TipoProyecto : EtapaProyecto []=[];
    TiEsEt:EtapaProyecto;

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
    //  private estadoService: EstadoProyectoService,
        private CicloVidaService: TipoProyectoService,
        private clienteService: ClienteService,
        private tipoService: EtapaProyetoService,
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
       this.getClientes();
       this.getDirectoresPEstimacion();
       this.getTipoProyecto();
      ///////////////////// 
        //
        this.validatorBtn(this.btnContinue);
        //
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
        Cliente:['', [
            Validators.required,
        ]],
        NombreProyecto:['', [
            Validators.required,
        ]],
        fechaCreacion:['', [
            Validators.required,
        ]],
     })
    }

    //
    validatorBtn(btnContinue: boolean){
        if (this.formDatosIniciales.valid) {
            return btnContinue != true;
        };
    }
    //
    getClientes(){
        this.clienteService.getClientesList().subscribe(data=>{
            this.clientes = data;
        },error=>{
            console.log(error);
            this.toastr.error(error.error)
        })
    }

    onClienteSelected(){
        if(this.selectedClienteId != null){
            this.ProyectoService.findByClienteIdConEtapaPRP(this.selectedClienteId).subscribe(data=>{
                this.proyectos = data,
                error => console.error(error)
            })
        }
    }

    getModelos() {
        this.modeloService.getAllModelos().subscribe(data => {
            this.modelos = data;
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

    getTipoProyecto(){
        this.tipoService.getEtapasList().subscribe(data => {
            this.TipoProyecto = data;
        }, error => {
            console.log(error);
            this.toastr.error(error.error);
        });
    }

    saveProyecto() {
        let estimacionUfsDTO: EstimacionUfsDTO = {
          ufId: null, 
          estimacionUfs: {
            fechaCreacion: this.estimacionTiempos.fechaCreacion,
            recurso: this.TiEsDi,
            modelo: this.TiEs,
            proyecto: this.TiEsP,
            etapaProyecto: this.TiEsEt,
            tipoProyecto: this.TiEsCV,
            actividadesComplementarias: new ActividadesComplementarias()
          }
        };
        console.log(estimacionUfsDTO);
      
        this.estimacionTiempoService.createEstimacionTiempoList(estimacionUfsDTO).subscribe(data => {
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


