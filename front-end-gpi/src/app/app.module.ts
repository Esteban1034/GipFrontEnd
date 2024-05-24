import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { LayoutModule } from './views/layout/layout.module';
import { AuthGuard } from './core/guard/auth.guard';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { AppComponent } from './app.component';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListClientesComponent } from './views/pages/clientes/list-clientes/list-clientes.component';
import { FormClientesComponent } from './views/pages/clientes/form-clientes/form-clientes.component';
import { ListRecursosComponent } from './views/pages/recursos/list-recursos/list-recursos.component';
import { FormRecursosComponent } from './views/pages/recursos/form-recursos/form-recursos.component';
import { HorasReportadasComponent } from './views/pages/reporte-tiempos/horas-reportadas/horas-reportadas.component';
import { AprobarTiempoComponent } from './views/pages/reporte-tiempos/aprobar-tiempo/aprobar-tiempo.component';
import { UpdateClientesComponent } from './views/pages/clientes/update-clientes/update-clientes.component';
import { ProgramarFacturacionComponent } from './views/pages/facturacion/programar-facturacion/programar-facturacion.component';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ToastrModule } from 'ngx-toastr';
import { ListProyectoComponent } from './views/pages/proyectos/list-proyectos/list-proyectos.component';
import { FormProyectoComponent } from './views/pages/proyectos/form-proyecto/form-proyecto.component';
import { UpdateProyectoComponent } from './views/pages/proyectos/update-proyecto/update-proyecto.component';
import { FormReporteComponent } from './views/pages/reporte-tiempos/form-reporte/form-reporte.component';
import { PlaneacionComponent } from './views/pages/planeacion/planeacion.component';
import { NovedadesComponent } from './views/pages/novedades/novedades.component';
import { UpdateRecursoComponent } from './views/pages/recursos/update-recurso/update-recurso.component';
import { DetalleAprobarTiempoComponent } from './views/pages/reporte-tiempos/detalle-aprobar-tiempo/detalle-aprobar-tiempo.component';
import { NgxDailyGanttChartModule } from 'ngx-daily-gantt-chart';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FasesComponent } from './views/pages/planeacion/fases/fases.component';
import { ActividadesComponent } from './views/pages/planeacion/actividades/actividades.component';
import { ReportesPendientesDevueltosComponent } from './views/pages/reporte-tiempos/reportes-pendientes-devueltos/reportes-pendientes-devueltos.component';
import { GanttChartAngularModule } from 'gantt-chart-angular';
import { GanttModule } from '@syncfusion/ej2-angular-gantt';
import { NgxBootstrapMultiselectModule } from 'ngx-bootstrap-multiselect';
import { ReporteTiemposReportadosEmpleadoComponent } from './views/pages/reportes-consultas/reporte-tiempos-reportados-empleado/reporte-tiempos-reportados-empleado.component';
import { ReporteFacturacionClienteComponent } from './views/pages/reportes-consultas/reporte-facturacion-cliente/reporte-facturacion-cliente.component';
import { ReporteTiempoClienteComponent } from './views/pages/reportes-consultas/reporte-tiempo-cliente/reporte-tiempo-cliente.component';
import { ReporteProyectoRecursoComponent } from './views/pages/reportes-consultas/reporte-proyecto-recurso/reporte-proyecto-recurso.component';
import { MisReportesComponent } from './views/pages/reporte-tiempos/mis-reportes/mis-reportes.component';
import { FormProyectoIntComponent } from './views/pages/proyectos/proyectos-internos/form-proyecto-int/form-proyecto-int.component';
import { ListProyectosIntComponent } from './views/pages/proyectos/proyectos-internos/list-proyectos-int/list-proyectos-int.component';
import { UpdateProyectoIntComponent } from './views/pages/proyectos/proyectos-internos/update-proyecto-int/update-proyecto-int.component';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ReporteTiemposPendientesEmpleadosComponent } from './views/pages/reportes-consultas/reporte-tiempos-pendientes-empleados/reporte-tiempos-pendientes-empleados.component';
// import { NgScrollbarModule, NG_SCROLLBAR_OPTIONS } from 'ngx-scrollbar';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { CrearPsrComponent } from './views/pages/project-status-report/crear-psr/crear-psr.component';
import { ListPsrComponent } from './views/pages/project-status-report/list-psr/list-psr.component';
import { ChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from "ng-apexcharts";
import { InformePsrComponent } from './views/pages/informes/informe-psr/informe-psr.component';
import { ParametriaMatrizTiempos } from './views/pages/parametria-matriz-tiempos/parametria-matriz-tiempos.component';
import { GeneracionMatrizTiempos } from './views/pages/parametria-matriz-tiempos/generacion-matriz-tiempos/generacion-matriz-tiempos.component';
import { GenracionInfotmesHistoricos } from './views/pages/parametria-matriz-tiempos/infomes-historicos/generacion-informes-historicos.component';
import { estimaciones } from './views/pages/estimacion-tiempos/estimaciones/estimaciones.component';

registerLocaleData(localeEs, 'es');

@NgModule({
    declarations: [
        AppComponent,
        ErrorPageComponent,
        ListClientesComponent,
        FormClientesComponent,
        ListRecursosComponent,
        FormRecursosComponent,
        HorasReportadasComponent,
        AprobarTiempoComponent,
        UpdateClientesComponent,
        ProgramarFacturacionComponent,
        ListProyectoComponent,
        FormProyectoComponent,
        UpdateProyectoComponent,
        FormReporteComponent,
        PlaneacionComponent,
        NovedadesComponent,
        UpdateRecursoComponent,
        DetalleAprobarTiempoComponent,
        FasesComponent,
        ActividadesComponent,
        ReportesPendientesDevueltosComponent,
        ReporteTiemposReportadosEmpleadoComponent,
        ReporteFacturacionClienteComponent,
        ReporteTiempoClienteComponent,
        ReporteProyectoRecursoComponent,
        MisReportesComponent,
        FormProyectoIntComponent,
        ListProyectosIntComponent,
        UpdateProyectoIntComponent,
        ReporteTiemposPendientesEmpleadosComponent,
        CrearPsrComponent,
        ListPsrComponent,
        InformePsrComponent,
        ParametriaMatrizTiempos,
        GeneracionMatrizTiempos,
        GenracionInfotmesHistoricos,
        estimaciones
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        LayoutModule,
        NgbModule,
        HttpClientModule,
        FormsModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        MatGridListModule,
        MatSelectModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        // NgxDailyGanttChartModule,
        // NgxMaskModule.forRoot({ validation: true }), // Ngx-mask
        // PerfectScrollbarModule,
        // GanttChartAngularModule,
        GanttModule,
        NgxBootstrapMultiselectModule,
        // NgScrollbarModule
        ChartsModule,
        NgApexchartsModule
    ],
    providers: [
        AuthGuard,
        {
            provide: {
                HIGHLIGHT_OPTIONS, // https://www.npmjs.com/package/ngx-highlightjs
            },
            useValue: {
                coreLibraryLoader: () => import('highlight.js/lib/core'),
                languages: {
                    xml: () => import('highlight.js/lib/languages/xml'),
                    typescript: () => import('highlight.js/lib/languages/typescript'),
                    scss: () => import('highlight.js/lib/languages/scss')
                }
            }
        },
        {
            provide: LOCALE_ID, useValue: 'es'
        }
    ],
    bootstrap: [AppComponent],

})
export class AppModule { }
