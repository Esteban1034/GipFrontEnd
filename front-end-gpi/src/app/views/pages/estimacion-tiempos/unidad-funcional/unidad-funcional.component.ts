import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContenidoUfs } from 'src/app/model/contenido-ufs';
import { Esfuerzo } from 'src/app/model/esfuerzo';
import { Funcion } from 'src/app/model/funcion';
import { MantenimientoUnidad } from 'src/app/model/mantenimiento-unidad';
import { ContenidoUfsService } from 'src/app/service/contenidoufs.service';
import { EsfuerzoService } from 'src/app/service/esfuerzo.service';
import { FuncionService } from 'src/app/service/funcion.Service';
import { MantenimientoUnidadService } from 'src/app/service/mantenimiento-unidad-service';
 // Corregido el nombre del servicio

@Component({
  selector: 'app-unidad-funcional',
  templateUrl: './unidad-funcional.component.html',
  styleUrls: ['./unidad-funcional.component.scss']
})
export class formularioUnidadFuncional implements OnInit { // Corregido el nombre de la clase
  formCreaContenidoUfs: FormGroup;
  esfuerzos: Esfuerzo[] = [];
  funciones: Funcion[] = [];
  mantenimientos: MantenimientoUnidad[] = [];
  contenidoUfsList: ContenidoUfs[] = [];
  submitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private contenidoUfsService: ContenidoUfsService,
    private mantenimientoUnidadService: MantenimientoUnidadService,
    private funcionService: FuncionService,
    private esfuerzoService: EsfuerzoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getEsfuerzos();
    this.getFunciones();
    this.getMantenimiento();
    this.getContenidoUfs();
  }

  get fc() { return this.formCreaContenidoUfs.controls; }

  buildForm() {
    this.formCreaContenidoUfs = this.formBuilder.group({
      nombreCaso: ['', Validators.required],
      porcentajeConstruccion: ['', Validators.required],
      porcentajeDiseno: ['', Validators.required],
      porcentajePruebas: ['', Validators.required],
      totalDiseno:['', Validators.required],
      totalConstruccion: ['', Validators.required],
      totalPruebas: ['', Validators.required],
      esfuerzo: ['', Validators.required],
      funcion:  ['', Validators.required],
      mantenimientoUnidad: ['', Validators.required]
    });
  }


  getContenidoUfs() {
    this.contenidoUfsService.getContenidoUfs().subscribe(
      data => {
        this.contenidoUfsList = data;
      },
      error => {
        console.log(error);
        this.toastr.error('Error al obtener los datos de contenido de unidades funcionales');
      }
    );
  }

  getFunciones() {
    this.funcionService.getFuncions().subscribe( // Corregido el nombre del método
      data => {
        this.funciones = data;
      },
      error => {
        console.log(error);
        this.toastr.error('Error al obtener los datos de funciones');
      }
    );
  }

  getEsfuerzos() {
    this.esfuerzoService.gEsfuerzos().subscribe( // Corregido el nombre del método
      data => {
        this.esfuerzos = data;
      },
      error => {
        console.log(error);
        this.toastr.error('Error al obtener los datos de esfuerzos');
      }
    );
  }

  getMantenimiento() {
    this.mantenimientoUnidadService.getMantenimientos().subscribe(
      data => {
        this.mantenimientos = data;
      },
      error => {
        console.log(error);
        this.toastr.error('Error al obtener los datos de mantenimiento');
      }
    );
  }

  saveContenidoUfs() {
    if (this.formCreaContenidoUfs.invalid) {
      this.toastr.error('Por favor, complete el formulario correctamente');
      return;    }
  
    const contenido: ContenidoUfs = this.formCreaContenidoUfs.value;
    
  
  
    this.contenidoUfsService.saveContenidoUfs(contenido).subscribe(
      data => {
        this.toastr.success('Contenido de unidad funcional creado exitosamente');
        this.formCreaContenidoUfs.reset();
        this.submitted = false;
        this.getContenidoUfs();
      },
      error => {
        console.log(error);
        this.toastr.error('Error al crear el contenido de unidad funcional');
      }
    );
  }
  
  

  onSubmit() {
    this.submitted = true;

    if (this.formCreaContenidoUfs.valid) {
      this.saveContenidoUfs();
    }
  }
}
