

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContenidoUfs } from 'src/app/model/contenido-ufs';
import { Esfuerzo } from 'src/app/model/esfuerzo';
import { Funcion } from 'src/app/model/funcion';
import { MantenimientoUnidad } from 'src/app/model/mantenimiento-unidad';

import { ContenidoUfsService } from 'src/app/service/contenidoufs.service';

@Component({
  selector: 'app-unidad-funcional',
  templateUrl: './unidad-funcional.component.html',
  styleUrls: ['./unidad-funcional.component.scss']
})
export class UnidadFuncionalComponent implements OnInit {
  esfuerzo: Esfuerzo[] = []; 
  funcion: Funcion[] = []; 
  mantenimientoUnidad: MantenimientoUnidad[] = []; 
  contenidoUfsList: ContenidoUfs[] = [];
  contenidoUfsForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private contenidoUfsService: ContenidoUfsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { } 

  ngOnInit(): void {
    this.contenidoUfsForm = this.formBuilder.group({
      nombreCaso: ['', Validators.required],
      porcentajeConstruccion: ['', Validators.required],
      porcentajeDiseno: ['', Validators.required],
      porcentajePruebas: ['', Validators.required],
      totalConstruccion: ['', Validators.required],
      totalDiseno: ['', Validators.required],
      totalPruebas: ['', Validators.required],
      fkEsfuerzo: ['', Validators.required],
      fkFuncion: ['', Validators.required],
      fkMantenimientoUnidad: ['', Validators.required]
    });

    this.getEsfuerzoData();
    this.getFuncionData();
    this.getMantenimiento();
    this.getContenidoUfsList();    
  }

  getEsfuerzoData() {
    this.contenidoUfsService.getEsfuerzoData().subscribe(
      data => {
        this.esfuerzo = data;
      },
      error => {
        console.error('Error obteniendo datos de esfuerzo', error);
      }
    );
  }

  getFuncionData() {
    this.contenidoUfsService.getFuncionData().subscribe(
      data => {
        this.funcion = data;
      },
      error => {
        console.error('Error obteniendo datos de función', error);
      }
    );
  }

  getMantenimiento() {
    this.contenidoUfsService.getMantenimiento().subscribe(
      data => {
        this.mantenimientoUnidad = data;
      },
      error => {
        console.error('Error obteniendo datos de mantenimientoUnidad', error);
      }
    );
  }
  

  getContenidoUfsList() {
    this.contenidoUfsService.getContenidoUfs().subscribe(
      data => {
        this.contenidoUfsList = data;
      },
      error => {
        console.error('Error obteniendo lista de ContenidoUfs', error);
      }
    );
  }

  onSubmit() {
    if (this.contenidoUfsForm.valid) {
      const newContenidoUfs: ContenidoUfs = this.contenidoUfsForm.value;
      this.contenidoUfsService.saveContenidoUfs(newContenidoUfs).subscribe(
        response => {
          console.log('ContenidoUfs creado', response);
          this.router.navigate(['/ruta-deseada']);  
        },
        error => {
          console.error('Error creando ContenidoUfs', error);
        }
      );
    }
  }
}
