import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs/operators';
import { GeneracionMatrizTiempoService } from 'src/app/service/generacion-matriz-tiempos-service';
import { MatrizTiempo } from 'src/app/model/matriz-tiempo';
import { GeneracionMatrizTiempo } from 'src/app/model/generacion-matriz-tiempos';
import { VersionMatriz } from 'src/app/model/version-matriz';
import { ParametriaGeneralMatrizTiempo } from 'src/app/model/parametria-general-matriz-tiempo';
import { ParametriaGeneralMatrizTiempoService } from 'src/app/service/matriz-tiempos-parametria-general.service';
import { ParametriaRecursosMatrizTiempoService } from 'src/app/service/matriz-tiempos-parametria-recursos.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-infomes-historicos',
    templateUrl: './generacion-infromes-historicos.component.html',
    styleUrls: ['./generacion-informes-historicos.component.scss']
})
export class GenracionInfotmesHistoricos implements OnInit {

    dataSource = null;
    modalEliminar: NgbModalRef;
    matrizTiempoList: MatrizTiempo[] = [];
    matrizDelete: MatrizTiempo;
    idMatrizdelte: number;
    //----------------
    parametriaTiempoList: ParametriaGeneralMatrizTiempo = new ParametriaGeneralMatrizTiempo();
    versionesInforme: VersionMatriz[] = new Array();
    matrizGeneral: GeneracionMatrizTiempo[] = [];
    dataHistoricos: any[] = [];
    costoTotalSprint: any[] = [];
    RecursosHora: any[] = [];
    RecursosHoraTotal: any[] = [];
    totalPlaneacion: number = 0;
    listaRecursos: any[] = [];
    SprintPorcentaje: any[] = [];
    nombreMatriz: string = "";

    @ViewChild(MatSort) sort: MatSort

    constructor(private parametriaGeneralMatrizTiempoService: ParametriaGeneralMatrizTiempoService,
        private modalService: NgbModal,
        private router: Router,
        private parametriaRecursosMatrizTiempoService: ParametriaRecursosMatrizTiempoService,
        private generacionMatrizTiempoService: GeneracionMatrizTiempoService,
        private toastr: ToastrService) { }


    columnas: string[] = ['nombreMatriz', 'fechaCreacionMatriz', 'opciones', 'eliminar'];
    session = localStorage.getItem('session');

    ngOnInit(): void {
        this.session = JSON.parse(this.session);
        this.getMatricesHistorico();
        this.getParametriaGeneral();
    }


    getMatricesHistorico() {
        this.generacionMatrizTiempoService.getMatricesHistoricas().subscribe(data => {
            this.matrizTiempoList = data;
            this.dataSource = new MatTableDataSource(this.castListObjectToStringList(this.matrizTiempoList));
        }, error => console.log(error));
    }


    getParametriaGeneral() {
        this.parametriaGeneralMatrizTiempoService.getParametriaGeneral().subscribe(data => {
            this.parametriaTiempoList = data;
        }, error => console.log(error));
    }

    getParametrosGeneralesInformeByMatriz(idMatriz) {
        this.generacionMatrizTiempoService.getParametrosGeneralesInformeByMatriz(idMatriz).pipe(finalize(() => this.getParametrosRecursosInformeByMatriz(idMatriz))
        ).subscribe(data => {
            this.matrizGeneral = data;
        }, error => console.log(error));
    }

    getParametrosRecursosInformeByMatriz(idMatriz) {

        this.versionesInforme = [];
        const versionesUnicas = new Set<string>();
        const versionesUnicasArray: VersionMatriz[] = [];
        this.matrizGeneral.forEach(matrizGeneral => {
            if (!versionesUnicas.has(matrizGeneral.version.version)) {
                versionesUnicas.add(matrizGeneral.version.version);
                versionesUnicasArray.push(matrizGeneral.version);
            }
        });

        this.versionesInforme = versionesUnicasArray;

        this.generacionMatrizTiempoService.getParametrosRecursosInformeByMatriz(idMatriz).pipe(finalize(() => this.calculosGeneral())
        ).subscribe(data => {
            this.dataHistoricos = data;
        }, error => console.log(error));
    }

    PorcentajeSprint() {
        this.SprintPorcentaje.length = 0;

        for (const matriz of this.matrizGeneral) {
            let porcentaje = 0;
            for (const item of this.dataHistoricos) {
                if (matriz.sprint === item.generacionMatrizTiempo.sprint && matriz.version.version === item.generacionMatrizTiempo.version.version) {
                    porcentaje += item.porcentajesAsignados;
                }
            }

            this.SprintPorcentaje.push({
                version: matriz.version.version,
                sprint: matriz.sprint,
                porcentaje: porcentaje / 100
            });
        }
    }

    calculosGeneral() {
        this.PorcentajeSprint();
        this.resetearArrays();
        this.obtenerRecursosUnicos();
        this.calcularRecursosHora();
        this.calcularRecursosHoraTotal();
        this.calcularCostoTotalSprint();
    }
    
    resetearArrays() {
        this.RecursosHora.length = 0;
        this.RecursosHoraTotal.length = 0;
        this.costoTotalSprint.length = 0;
        this.listaRecursos.length = 0;
        this.totalPlaneacion = 0;
    }
    
    obtenerRecursosUnicos() {
        const recursosSet = new Set();
        for (const asignacionRecurso of this.dataHistoricos) {
            const clave = `${asignacionRecurso.perfil}_${asignacionRecurso.especialidad}`;
            if (!recursosSet.has(clave)) {
                this.listaRecursos.push({ Cargo: asignacionRecurso.perfil, Especialidad: asignacionRecurso.especialidad });
                recursosSet.add(clave);
            }
        }
    }
    
    calcularRecursosHora() {
        for (const matriz of this.matrizGeneral) {
            for (const recurso of this.listaRecursos) {
                let porcentajeAcumulado = 0;
                let horas = 0;
                let tarifa = 0;
                for (const asignacion of this.dataHistoricos) {
                    if (this.esMismoRecurso(asignacion, matriz, recurso)) {
                        porcentajeAcumulado += asignacion.porcentajesAsignados;
                        horas = Math.ceil(this.parametriaTiempoList.numeroHoras * asignacion.generacionMatrizTiempo.duracionDiasSprint * porcentajeAcumulado / 100);
                        tarifa = asignacion.tarifaHora * horas;
                    }
                }
                this.RecursosHora.push({
                    Sprint: matriz.sprint,
                    Version: matriz.version.version,
                    Porcentaje: porcentajeAcumulado / 100,
                    Cargo: recurso.Cargo,
                    Especialidad: recurso.Especialidad,
                    tarifaHora: tarifa,
                    Horas: horas
                });
            }
        }
    }
    
    esMismoRecurso(asignacion, matriz, recurso) {
        return matriz.sprint === asignacion.generacionMatrizTiempo.sprint &&
            matriz.version.version === asignacion.generacionMatrizTiempo.version.version &&
            recurso.Cargo === asignacion.perfil &&
            recurso.Especialidad === asignacion.especialidad;
    }
    
    calcularRecursosHoraTotal() {
        for (const recurso of this.listaRecursos) {
            let total = 0;
            let totalHoras = 0;
            let totalTarifa = 0;
            for (const recursoHora of this.RecursosHora) {
                if (recurso.Cargo === recursoHora.Cargo && recurso.Especialidad === recursoHora.Especialidad) {
                    total += recursoHora.Porcentaje;
                    totalHoras += recursoHora.Horas;
                    totalTarifa += recursoHora.tarifaHora;
                }
            }
            this.RecursosHoraTotal.push({
                Cargo: recurso.Cargo,
                Especialidad: recurso.Especialidad,
                Total: total.toFixed(2),
                TotalHoras: totalHoras,
                TotalTarifa: totalTarifa
            });
        }
    }
    
    calcularCostoTotalSprint() {
        for (const matriz of this.matrizGeneral) {
            let costoSprint = 0;
            let costoVersion = 0;
            for (const recursoHora of this.RecursosHora) {
                if (matriz.sprint === recursoHora.Sprint && matriz.version.version === recursoHora.Version) {
                    costoSprint += recursoHora.tarifaHora;
                }
                if (matriz.version.version === recursoHora.Version) {
                    costoVersion += recursoHora.tarifaHora;
                }
            }
            this.costoTotalSprint.push({
                Version: matriz.version.version,
                Sprint: matriz.sprint,
                Costo: costoSprint,
                CostoVersion: costoVersion
            });
            this.totalPlaneacion += costoSprint;
        }
    }    

    calcularTotalVersion(v: string) {
        for (const costo of this.costoTotalSprint) {
            if (costo.Version === v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()) {
                return costo.CostoVersion.toLocaleString();
            }
        }
    }

    sumaData() {
        let dias = 0;
        this.matrizGeneral.forEach(item => {
            if (item.duracionDiasSprint !== undefined) {
                dias += item.duracionDiasSprint;
            }
        });
        return dias;
    }
    

    mesesVersion(version?: number | undefined) {
        let dias = 0;
        if (version == undefined) {
            this.matrizGeneral.forEach(matriz => {
                dias = dias + matriz.duracionDiasSprint;
            });
        } else {
            this.matrizGeneral.forEach(matriz => {
                if (matriz.version.id == version) {
                    dias = dias + matriz.duracionDiasSprint;
                }
            });
        }
        return dias;
    }

    sumaDataHora() {
        let horasSprint = 0;
        this.matrizGeneral.forEach(item => {
            if (this.dataHistoricos && this.dataHistoricos.length > 1 && this.dataHistoricos[1]?.horasLaborales) {
                horasSprint += item.duracionDiasSprint * this.dataHistoricos[1]?.horasLaborales;
            }
        });
        return horasSprint;
    }
    

    sumaDataHoraRecurso() {
        let horasSprintRecurso = 0;
        let iteracion = Math.min(this.matrizGeneral.length, this.SprintPorcentaje.length);
    
        for (let i = 0; i < iteracion; i++) {
            if (this.SprintPorcentaje[i]?.porcentaje !== undefined && this.matrizGeneral[i]?.duracionDiasSprint !== undefined) {
                horasSprintRecurso += Math.ceil(this.matrizGeneral[i].duracionDiasSprint * this.parametriaTiempoList.numeroHoras * this.SprintPorcentaje[i].porcentaje);
            }
        }
    
        return horasSprintRecurso;
    }    

    openXlModal(content: TemplateRef<any>, idMatriz, nombreMatriz) {
        this.modalService.open(content, { size: 'xl' }).result.then((result) => {
            console.log("Modal closed" + result);
        }).catch((res) => { });

        this.getParametrosGeneralesInformeByMatriz(idMatriz);
        this.nombreMatriz = nombreMatriz;
        this.idMatrizdelte = idMatriz;
    }

    filtrar(event: Event) {
        const filtro = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filtro.trim().toLowerCase();
    }

    getToday(): string {
        return new Date().toISOString().split('T')[0]
    }

    castListObjectToStringList(listaObj: MatrizTiempo[]) {
        let listString: MatrizTiempoString[] = [];

        listaObj.forEach(obj => {
            let string: MatrizTiempoString = new MatrizTiempoString();
            string.id = obj.id;
            string.nombreMatriz = obj.nombreMatriz;
            string.fechaCreacionMatriz = obj.fechaCreacionMatriz.toString();
            listString.push(string);
        });
        return listString;
    }

    redondearTiempo(porcentaje: number, itemMatrizGeneral: number, numHoras: number) {
        return Math.ceil(itemMatrizGeneral * numHoras * porcentaje)
    }

    defineStyles() {
        return {
            title: {
                fontSize: 14,
                bold: true,
                margin: [0, 0, 0, 10],
                color: '#000'
            },
            tableHeader: {
                fillColor: '#f2f2f2',
                alignment: 'center',
                verticalAlignment: 'middle'
            },
            tableCell: {
                alignment: 'center'
            },
            tableCellBold: {
                alignment: 'center',
                bold: 'true'
            },
            subtitle: {
                fontSize: 12,
                bold: true,
                margin: [0, 2, 0, 10],
                color: '#000'
            },
        };
    }

    generatePDF() {
        const styles = this.defineStyles();
        const title = { text: 'Informe Consolidado', style: 'title' };
        const versionesContent = this.generarTablaVersiones(this.versionesInforme);
        const planeacionContent = this.generarTablaPlaneacion();
        const costoSprintContent = this.generarTablaCostoSprint(this.matrizGeneral, this.costoTotalSprint);
        const resumenGeneralContent = this.generarTablaResumenGeneral(this.matrizGeneral, this.parametriaTiempoList, this.SprintPorcentaje);
        const recursosPorSprintContent = this.generarTablasRecursosPorSprint(this.matrizGeneral, this.listaRecursos, this.RecursosHora, this.RecursosHoraTotal);
        const horasPorRecursosPorSprint = this.generarTablasHorasPorRecursoPorSprint(this.matrizGeneral, this.listaRecursos, this.RecursosHora, this.RecursosHoraTotal);
        const costoTotalPorEspecialidad = this.generarTablasCostoTotalPorEspecialidad(this.matrizGeneral,this.listaRecursos,this.RecursosHora, this.RecursosHoraTotal);

        const documentDefinition = {
            content: [
                title,
                ...versionesContent,
                ...planeacionContent,
                ...costoSprintContent,
                ...resumenGeneralContent,
                ...recursosPorSprintContent,
                ...horasPorRecursosPorSprint,
                ...costoTotalPorEspecialidad
            ],
            styles: styles
        };

        pdfMake.createPdf(documentDefinition).download("Informe Consolidado de la Matriz " + this.nombreMatriz);
    }

    generarTablaVersiones(versionesInforme) {
        const documentContent = [];

        versionesInforme.forEach(version => {
            const headerRow = [
                { text: 'Meses', style: 'tableHeader' },
                { text: 'Costo Total Sprints', style: 'tableHeader' }
            ];

            const bodyRow = [
                { text: (this.mesesVersion(version.id) / 30).toFixed(1), style: 'tableCell' },
                { text: `$ ${this.calcularTotalVersion(version.version).toLocaleString()}`, style: 'tableCell' }
            ];

            documentContent.push(
                { text: 'Versión ' + version.version, style: 'subtitle' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*'],
                        body: [headerRow, bodyRow]
                    },
                    layout: 'lightHorizontalLines'
                },
                { text: '\n' }
            );
        });

        documentContent.push({ text: '\n' });

        return documentContent;
    }

    generarTablaPlaneacion() {
        const documentContent = [];
        const meses = (this.mesesVersion() / 30).toFixed(1);
        const totalPlaneacion = this.totalPlaneacion.toLocaleString();

        const headerRow = [
            { text: 'Meses', style: 'tableHeader' },
            { text: 'Costo Total Sprints', style: 'tableHeader' }
        ];

        const bodyRows = [[meses, `$${totalPlaneacion}`]].map(row => row.map(cell => ({ text: cell, style: 'tableCell' })));

        documentContent.push({
            text: 'Total Planeación',
            style: 'subtitle'
        });

        documentContent.push({
            table: {
                headerRows: 1,
                widths: ['*', '*'],
                body: [headerRow, ...bodyRows]
            },
            layout: 'lightHorizontalLines'
        });

        documentContent.push({ text: '\n' });

        return documentContent;
    }

    generarTablaCostoSprint(matrizGeneral, costoTotalSprint) {
        const documentContent = [];

        const headerRow = [
            { text: 'Sprint', style: 'tableHeader' },
            { text: 'Versión', style: 'tableHeader' },
            { text: 'Costo', style: 'tableHeader' }
        ];

        const bodyRows = matrizGeneral.map((vs, i) => {
            return [
                { text: vs.sprint, style: 'tableCell' },
                { text: vs.version.version, style: 'tableCell' },
                { text: `$ ${costoTotalSprint[i].Costo.toLocaleString()}`, style: 'tableCell' }
            ];
        });

        documentContent.push({
            text: 'Costo por Sprint',
            style: 'subtitle'
        });

        documentContent.push({
            table: {
                widths: ['*', '*', '*'],
                headerRows: 1,
                body: [headerRow, ...bodyRows]
            },
            layout: 'lightHorizontalLines'
        });

        documentContent.push({ text: '\n' });

        return documentContent;
    }

    generarTablaResumenGeneral(matrizGeneral, parametriaTiempoList, SprintPorcentaje) {
        const documentContent = [];

        const headerRow = [
            { text: 'Sprints', style: 'tableHeader' },
            { text: 'Versión', style: 'tableHeader' },
            { text: 'Duración días', style: 'tableHeader' },
            { text: 'Duración horas sprints', style: 'tableHeader' },
            { text: 'Duración horas recursos', style: 'tableHeader' }
        ];

        const bodyRows = matrizGeneral.map((matriz, i) => {
            return [
                { text: matriz.sprint, style: 'tableCell' },
                { text: matriz.version.version, style: 'tableCell' },
                { text: `${matriz.duracionDiasSprint} días`, style: 'tableCell' },
                { text: `${matriz.duracionDiasSprint * parametriaTiempoList.numeroHoras} horas`, style: 'tableCell' },
                { text: `${this.redondearTiempo(SprintPorcentaje[i].porcentaje, matriz.duracionDiasSprint, parametriaTiempoList.numeroHoras)} horas`, style: 'tableCell' }
            ];
        });

        const totalRow = [
            { text: 'Totales', style: 'tableCellBold' },
            { text: '', style: 'tableCellBold' },
            { text: `${this.sumaData()} Días`, style: 'tableCellBold' },
            { text: `${this.sumaDataHora()} Horas`, style: 'tableCellBold' },
            { text: `${this.sumaDataHoraRecurso()} Horas`, style: 'tableCellBold' }
        ];

        documentContent.push({
            text: 'Resumen General',
            style: 'subtitle'
        });

        documentContent.push({
            table: {
                widths: ['*', '*', '*', '*', '*'],
                headerRows: 1,
                body: [headerRow, ...bodyRows, totalRow]
            },
            layout: 'lightHorizontalLines'
        });

        documentContent.push({ text: '\n' });

        return documentContent;
    }

    generarTablasRecursosPorSprint(matrizGeneral, listaRecursos, RecursosHora, RecursosHoraTotal) {
        const documentContent = [];
        const listaRecursosTemp = listaRecursos.slice();

        documentContent.push({
            text: 'Cantidad de recursos por perfil por Sprint',
            style: 'subtitle'
        });

        const gruposRecursos = [];
        for (let i = 0; i < listaRecursosTemp.length; i += 3) {
            gruposRecursos.push(listaRecursosTemp.slice(i, i + 3));
        }

        gruposRecursos.forEach(grupo => {
            const tableContent = [];

            const headerRow = [
                { text: 'Sprint', style: 'tableHeader' },
                { text: 'Versión', style: 'tableHeader' },
                ...grupo.map(cargo => ({ text: `${cargo.Especialidad}\n${cargo.Cargo}`, style: 'tableHeader' }))
            ];
            tableContent.push(headerRow);

            matrizGeneral.forEach(vs => {
                const bodyRow = [
                    { text: vs.sprint, style: 'tableCell' },
                    { text: vs.version.version, style: 'tableCell' },
                    ...grupo.map(cargo => {
                        const recurso = RecursosHora.find(p => p.Sprint === vs.sprint && vs.version.version === p.Version && cargo.Cargo === p.Cargo && p.Especialidad === cargo.Especialidad);
                        return { text: recurso ? recurso.Porcentaje : '', style: 'tableCell' };
                    })
                ];
                tableContent.push(bodyRow);
            });

            const totalRow = [
                { text: 'Total', style: 'tableCellBold' },
                { text: '', style: 'tableCellBold' },
                ...grupo.map(cargo => {
                    const total = RecursosHoraTotal.find(p => p.Cargo === cargo.Cargo && p.Especialidad === cargo.Especialidad);
                    return { text: total ? total.Total.toLocaleString() : '', style: 'tableCellBold' };
                })
            ];
            tableContent.push(totalRow);

            documentContent.push({
                table: {
                    widths: Array(grupo.length + 2).fill('*'),
                    headerRows: 1,
                    body: tableContent
                },
                layout: 'lightHorizontalLines'
            });

            documentContent.push({ text: '\n' });
        });

        return documentContent;
    }

    generarTablasHorasPorRecursoPorSprint(matrizGeneral, listaRecursos, RecursosHora, RecursosHoraTotal) {
        const documentContent = [];
        const listaRecursosTemp = listaRecursos.slice();

        documentContent.push({
            text: 'Cantidad de horas por recurso por Sprint',
            style: 'subtitle'
        });

        const gruposRecursos = [];
        for (let i = 0; i < listaRecursosTemp.length; i += 3) {
            gruposRecursos.push(listaRecursosTemp.slice(i, i + 3));
        }

        gruposRecursos.forEach(grupo => {
            const tableContent = [];

            const headerRow = [
                { text: 'Sprint', style: 'tableHeader' },
                { text: 'Versión', style: 'tableHeader' },
                ...grupo.map(cargo => ({ text: `${cargo.Especialidad}\n${cargo.Cargo}`, style: 'tableHeader' }))
            ];
            tableContent.push(headerRow);

            matrizGeneral.forEach(vs => {
                const bodyRow = [
                    { text: vs.sprint, style: 'tableCell' },
                    { text: vs.version.version, style: 'tableCell' },
                    ...grupo.map(cargo => {
                        const recurso = RecursosHora.find(p => p.Sprint === vs.sprint && vs.version.version === p.Version && cargo.Cargo === p.Cargo && p.Especialidad === cargo.Especialidad);
                        return { text: recurso ? recurso.Horas + ' Horas' : '', style: 'tableCell' };
                    })
                ];
                tableContent.push(bodyRow);
            });

            const totalRow = [
                { text: 'Total', style: 'tableCellBold' },
                { text: '', style: 'tableCellBold' },
                ...grupo.map(cargo => {
                    const total = RecursosHoraTotal.find(p => p.Cargo === cargo.Cargo && p.Especialidad === cargo.Especialidad);
                    return { text: total ? total.TotalHoras + ' Horas' : '', style: 'tableCellBold' };
                })
            ];
            tableContent.push(totalRow);

            documentContent.push({
                table: {
                    widths: Array(grupo.length + 2).fill('*'),
                    headerRows: 1,
                    body: tableContent
                },
                layout: 'lightHorizontalLines'
            });

            documentContent.push({ text: '\n' });
        });

        return documentContent;
    }

    generarTablasCostoTotalPorEspecialidad(matrizGeneral, listaRecursos, RecursosHora, RecursosHoraTotal) {
        const documentContent = [];
        const listaRecursosTemp = listaRecursos.slice();
        documentContent.push({
            text: 'Costo total por especialidad de recurso',
            style: 'subtitle'
        });
        const gruposRecursos = [];
        for (let i = 0; i < listaRecursosTemp.length; i += 3) {
            gruposRecursos.push(listaRecursosTemp.slice(i, i + 3));
        }
    
        gruposRecursos.forEach(grupo => {
            const tableContent = [];
    
            const headerRow = [
                { text: 'Sprint', style: 'tableHeader' },
                { text: 'Versión', style: 'tableHeader' },
                ...grupo.map(cargo => ({ text: `${cargo.Especialidad}\n${cargo.Cargo}`, style: 'tableHeader' }))
            ];
            tableContent.push(headerRow);
    
            matrizGeneral.forEach(vs => {
                const bodyRow = [
                    { text: vs.sprint, style: 'tableCell' },
                    { text: vs.version.version, style: 'tableCell' },
                    ...grupo.map(cargo => {
                        const recurso = RecursosHora.find(p => p.Sprint === vs.sprint && vs.version.version === p.Version && cargo.Cargo === p.Cargo && p.Especialidad === cargo.Especialidad);
                        return { text: recurso ? '$' + recurso.tarifaHora.toLocaleString() : '', style: 'tableCell' };
                    })
                ];
                tableContent.push(bodyRow);
            });
    
            const totalRow = [
                { text: 'Total', style: 'tableCellBold' },
                { text: '', style: 'tableCellBold' },
                ...grupo.map(cargo => {
                    const total = RecursosHoraTotal.find(p => p.Cargo === cargo.Cargo && p.Especialidad === cargo.Especialidad);
                    return { text: total ? '$' + total.TotalTarifa.toLocaleString() : '', style: 'tableCellBold' };
                })
            ];
            tableContent.push(totalRow);
    
            documentContent.push({
                table: {
                    widths: Array(grupo.length + 2).fill('*'),
                    headerRows: 1,
                    body: tableContent
                },
                layout: 'lightHorizontalLines'
            });

            if(gruposRecursos.length > 1){
                documentContent.push({ text: '\n' });
            }
        });
    
        return documentContent;
    }

    

    deleteMatriz(){
        this.generacionMatrizTiempoService.deleteMatricesHistoricos(this.idMatrizdelte).subscribe(data => {
            this.idMatrizdelte = undefined;
            this.modalService.dismissAll();
            this.getMatricesHistorico();
            this.toastr.warning('Matriz eliminada correctamente!');
        }, error => {
            this.toastr.error(error.error);
            this.modalService.dismissAll();
            console.log(error.error);
        });
    }

}

export class MatrizTiempoString {
    id: number;
    nombreMatriz: string;
    fechaCreacionMatriz: string;
}
