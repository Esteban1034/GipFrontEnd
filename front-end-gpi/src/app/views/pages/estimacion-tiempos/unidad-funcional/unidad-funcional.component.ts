
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContenidoUfs } from 'src/app/model/contenido-ufs';
import { Esfuerzo } from 'src/app/model/esfuerzo';
import { Funcion } from 'src/app/model/funcion';
import { MantenimientoPesoHora } from 'src/app/model/mantenimiento-peso-hora';
import { MantenimientoUnidad } from 'src/app/model/mantenimiento-unidad';
import { Ufs } from 'src/app/model/ufs';
import { ContenidoUfsService } from 'src/app/service/contenidoufs.service';
import { EsfuerzoService } from 'src/app/service/esfuerzo.service';
import { FuncionService } from 'src/app/service/funcion.Service';
import { MantenimientoUnidadService } from 'src/app/service/mantenimiento-unidad-service';

@Component({
  selector: 'app-unidad-funcional',
  templateUrl: './unidad-funcional.component.html',
  styleUrls: ['./unidad-funcional.component.scss']
})
export class formularioUnidadFuncional implements OnInit {
  formCreaContenidoUfs: FormGroup;
  formCreaFuncion: FormGroup;
  ufs: Ufs[] = []; // Variable para almacenar la lista de Ufs

  esfuerzos: Esfuerzo[] = [];
  funciones: Funcion[] = [];
  mantenimientos: MantenimientoUnidad[] = [];
  contenidoUfsList: ContenidoUfs[] = [];
  submitted: boolean = false;
  horasDiseno: number = 0;
  horasConstruccion: number = 0;
  horasPruebas: number = 0;

  totalAjusteDiseno: number = 0;
  totalAjusteConstruccion: number = 0;
  totalAjustePruebas: number = 0;
  showCreateFunctionForm: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private mantenimientoUnidadService: MantenimientoUnidadService,
    private contenidoUfsService: ContenidoUfsService,
    private esfuerzoService: EsfuerzoService,
    private funcionService: FuncionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getFuncionData();
    this.buildFuncionForm();
    this.getMantenimiento();
    this.getContenidoUfs();
  }

  buildFuncionForm() {
    this.formCreaFuncion = this.formBuilder.group({
      funcion: ['', Validators.required],
    });
  }

  buildForm() {
    this.formCreaContenidoUfs = this.formBuilder.group({
      nombreCaso: ['', Validators.required],
      porcentajeConstruccion: ['', Validators.required],
      porcentajeDiseno: ['', Validators.required],
      porcentajePruebas: ['', Validators.required],
      funcionSeleccionada: [''],
      funcion: [''],
      mantenimientoUnidad: ['', Validators.required],
       });
  }

  get fc() { return this.formCreaContenidoUfs.controls; }

  getContenidoUfs() {
    this.contenidoUfsService.getContenidoUfs().subscribe(
      (data: ContenidoUfs[]) => {
        this.contenidoUfsList = data;
      },
      error => {
        console.error(error);
        this.toastr.error('Error al obtener los datos de contenido de unidades funcionales');
      }
    );
  }

  obtenerHoras(peso: number) {
    this.contenidoUfsService.obtenerHoras(peso).subscribe(
      (resultado: any) => {
        console.log('Resultado de obtenerHoras:', resultado);
        this.horasConstruccion = resultado.hora; // Asignar las horas obtenidas
        this.horasDiseno = resultado.hora;
        this.horasPruebas = resultado.hora;
        // Actualizar los valores en el formulario si es necesario
        this.actualizarValoresFormulario();
        this.calcularTotales(); // Llamar a calcularTotales para actualizar los totales
      },
      (error) => {
        console.error('Error al obtener horas:', error);
        this.toastr.error('Error al obtener las horas del mantenimiento');
      }
    );
  }

  actualizarValoresFormulario() {
    if (this.fc.mantenimientoUnidad.value) {
      this.fc.horaDiseno.setValue(this.horasDiseno); // Actualizar valor de diseño
      this.fc.horaConstruccion.setValue(this.horasConstruccion); // Actualizar valor de construcción
      this.fc.horaPruebas.setValue(this.horasPruebas); // Actualizar valor de pruebas
    }
  }

  calcularTotales() {
    const porcentajeConstruccion = parseFloat(this.fc.porcentajeConstruccion.value) || 0;
    const porcentajeDiseno = parseFloat(this.fc.porcentajeDiseno.value) || 0;
    const porcentajePruebas = parseFloat(this.fc.porcentajePruebas.value) || 0;

    this.totalAjusteConstruccion = this.horasConstruccion * (porcentajeConstruccion/100) + this.horasConstruccion;
    this.totalAjusteDiseno = this.horasDiseno * (porcentajeDiseno/100) + this.horasDiseno;
    this.totalAjustePruebas = this.horasPruebas * (porcentajePruebas/100) + this.horasPruebas;
  }

  getFuncionData() {
    this.funcionService.getFuncions().subscribe(
      (data: Funcion[]) => {
        this.funciones = data;
      },
      error => {
        console.error(error);
        this.toastr.error('Error al obtener los datos de función');
      }
    );
  }

  cancelCreateFunction() {
    this.showCreateFunctionForm = false;
  }

  getMantenimiento() {
    this.mantenimientoUnidadService.getMantenimientos().subscribe(
      (data: MantenimientoUnidad[]) => {
        this.mantenimientos = data;
      },
      error => {
        console.error(error);
        this.toastr.error('Error al obtener los datos de mantenimiento de unidad');
      }
    );
  }

  onMantenimientoChange(event: any) {
    const mantenimientoId = event.target.value; // Extract the selected maintenance ID from the event
    const selectedMantenimiento = this.mantenimientos.find(m => m.id === parseInt(mantenimientoId)); // Find the selected maintenance object

    if (selectedMantenimiento) {
      // If a maintenance object is found with the selected ID
      this.obtenerHoras(selectedMantenimiento.peso); // Call obtenerHoras with the weight of the selected maintenance
      this.horasConstruccion = 0; // Initialize or reset construction hours
      this.horasDiseno = 0; // Initialize or reset design hours
      this.horasPruebas = 0; // Initialize or reset testing hours
    } else {
      // If no maintenance object is found with the selected ID
      console.error('No se encontró el mantenimiento seleccionado');
      // Here you could show a message to the user or reset related variables
      this.resetFormFields();
    }
  }

  saveContenidoUfs() {
    this.submitted = true;
    if (this.formCreaContenidoUfs.valid) {
      const contenidoUfsData = {
        id: 0,
        nombreCaso: this.fc.nombreCaso.value,
        porcentajeConstruccion: this.fc.porcentajeConstruccion.value,
        porcentajeDiseno: this.fc.porcentajeDiseno.value,
        porcentajePruebas: this.fc.porcentajePruebas.value,
        totalDiseno: null, // Asignar total ajustado
        totalConstruccion: null, // Asignar total ajustado
        totalPruebas: null, // Asignar total ajustado
        esfuerzo: null,
        funcion: this.fc.funcionSeleccionada.value ? this.fc.funcionSeleccionada.value : this.fc.funcion.value,
        mantenimientoUnidad: this.fc.mantenimientoUnidad.value,
        horaConstruccion: this.horasConstruccion,
        horaDiseno: this.horasDiseno,
        horaPruebas: this.horasPruebas,
        ufs:null
      };

      this.contenidoUfsService.saveContenidoUfs(contenidoUfsData).subscribe(
        response => {
          console.log(response);
          this.toastr.success('Contenido de UFS creado exitosamente.');
          this.resetForm();
        },
        error => {
          console.error(error);
          this.toastr.error('Error al crear el contenido de UFS');
        }
      );
    } else {
      this.toastr.error('Por favor completa los campos requeridos.');
    }
  }

  saveFuncion() {
    this.submitted = true;
    if (this.formCreaFuncion.valid) {
      const funcionData = {
        id: 0,
        funcion: this.formCreaFuncion.get('funcion').value,
      };

      this.funcionService.saveFuncion(funcionData).subscribe(
        response => {
          console.log(response);
          this.toastr.success('Función creada exitosamente.');
          this.formCreaFuncion.reset();
          this.getFuncionData();
          this.showCreateFunctionForm = false; // Ocultar el formulario de creación después de guardar
        },
        error => {
          console.error(error);
          this.toastr.error('Error al crear la función');
        }
      );
    } else {
      this.toastr.error('Por favor completa los campos requeridos.');
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.formCreaContenidoUfs.valid) {
      this.saveContenidoUfs();
    } else {
      this.toastr.error('Por favor, complete el formulario correctamente');
    }
  }

  resetForm() {
    this.submitted = false;
    this.formCreaContenidoUfs.reset();
    this.horasConstruccion = 0;
    this.horasDiseno = 0;
    this.horasPruebas = 0;
    this.totalAjusteDiseno = 0;
    this.totalAjusteConstruccion = 0;
    this.totalAjustePruebas = 0;
  }

  resetFormFields() {
    // Reset the values of specific form controls
    this.fc.porcentajeDiseno.setValue('');
    this.fc.porcentajeConstruccion.setValue('');
    this.fc.porcentajePruebas.setValue('');
    this.horasDiseno = 0;
    this.horasConstruccion = 0;
    this.horasPruebas = 0;
    this.totalAjusteDiseno = 0;
    this.totalAjusteConstruccion = 0;
    this.totalAjustePruebas = 0;
  }
}
