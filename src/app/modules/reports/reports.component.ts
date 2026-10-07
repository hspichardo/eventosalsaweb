import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observer } from 'rxjs';
import { BreadcrumbService } from '../../app.breadcrumb.service';
import { ResponseData } from 'src/app/demo/interfaces/ResponseData';
import { EventEntity } from 'src/app/demo/interfaces/eventEntity';
import { EventEntitiesService } from 'src/app/demo/service/EventEntityService';
import { ReportService } from 'src/app/demo/service/reportService';
import * as XLSX from 'xlsx';

@Component({
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    providers: [MessageService, ReportService, EventEntitiesService]
})
export class ReportsComponent implements OnInit {

    eventEntities: EventEntity[] = [];

    selectedEvent: EventEntity;

    rows: any[] = [];

    cols: { field: string, header: string }[] = [];

    globalFilterFields: string[] = [];

    loading: boolean = false;

    loaded: boolean = false;

    constructor(
        private messageService: MessageService,
        private reportService: ReportService,
        private eventEntityService: EventEntitiesService,
        private breadcrumbService: BreadcrumbService) {

        this.breadcrumbService.setItems([
            { label: 'Reportes' }
        ]);
    }

    ngOnInit() {
        const getEventEntitiesObserver: Observer<any> = {
            next: (response: ResponseData) => {
                this.eventEntities = response.data as EventEntity[];
            },
            error: (error: any) => {
                console.error(error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los eventos', life: 3000 });
                return 1;
            },
            complete: () => {
                return 0;
            }
        };

        this.eventEntityService.getEventEntities().subscribe(getEventEntitiesObserver);
    }

    loadReport() {
        this.rows = [];
        this.cols = [];
        this.globalFilterFields = [];
        this.loaded = false;

        if (!this.selectedEvent || !this.selectedEvent.id) {
            return;
        }

        this.loading = true;

        const getReportObserver: Observer<any> = {
            next: (response: ResponseData) => {
                if (response.status) {
                    this.rows = response.data || [];
                    this.cols = this.rows.length ? Object.keys(this.rows[0]).map(key => ({ field: key, header: key })) : [];
                    this.globalFilterFields = this.cols.map(col => col.field);

                    if (!this.rows.length) {
                        this.messageService.add({ severity: 'info', summary: 'Reporte', detail: 'Sin registros para el evento seleccionado', life: 3000 });
                    }
                }
                else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message, life: 3000 });
                }
                this.loading = false;
                this.loaded = true;
            },
            error: (error: any) => {
                console.error(error);
                this.loading = false;
                this.loaded = true;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener el reporte. Verifique que el servicio esté disponible.', life: 4000 });
                return 1;
            },
            complete: () => {
                return 0;
            }
        };

        this.reportService.getReportByEvent(this.selectedEvent.id).subscribe(getReportObserver);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    exportXLSX() {
        if (!this.rows.length) {
            return;
        }

        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rows);
        worksheet['!cols'] = this.cols.map(col => ({ wch: Math.max(col.header.length + 2, 12) }));

        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

        const eventName = (this.selectedEvent?.name || 'evento')
            .replace(/[^a-zA-Z0-9 áéíóúñÁÉÍÓÚÑ-]/g, '')
            .trim()
            .replace(/\s+/g, '_');

        XLSX.writeFile(workbook, `reporte_${eventName}.xlsx`);

        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Reporte exportado a Excel', life: 3000 });
    }

}
