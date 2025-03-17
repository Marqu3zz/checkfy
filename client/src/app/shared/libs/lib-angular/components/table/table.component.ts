import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRow,
    MatRowDef,
    MatTable,
    MatTableDataSource
} from "@angular/material/table";
import {MatPaginator, MatPaginatorIntl, PageEvent} from "@angular/material/paginator";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {
    Action,
    IColumn,
    IConditionalLineColor,
    IPaginator,
    Paginator,
    TableStatus,
    Type
} from "../../interfaces/table.interface";
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgClass, NgComponentOutlet, NgStyle} from "@angular/common";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {Observable} from "rxjs";
import {HttpResponse} from "@angular/common/http";

@Component({
    selector: "limber-table",
    standalone: true,
    imports: [
        MatCell,
        MatCellDef,
        MatColumnDef,
        MatHeaderCell,
        MatHeaderRow,
        MatHeaderRowDef,
        MatPaginator,
        MatRow,
        MatRowDef,
        MatSort,
        MatSortHeader,
        MatTable,
        MatHeaderCellDef,
        MatNoDataRow,
        MatProgressBar,
        NgComponentOutlet,
        MatIconButton,
        MatIcon,
        MatTooltip,
        NgClass,
        NgStyle
    ],
    templateUrl: "./table.component.html",
    styleUrl: "./table.component.scss"
})
export class TableComponent implements OnInit, AfterViewInit {

    //************************************************************************************************************//
    //************************************************** Inputs **************************************************//
    //************************************************************************************************************//

    // Colunas da tabela
    @Input() columns: IColumn[];

    // Event Emitter do Observable dos dados da tabela (não pode ser usado junto com a propriedade "data")
    @Input() dataEmitter: EventEmitter<Observable<any>>;

    // Two-way binding dos dados da tabela (não pode ser usado junto com a propriedade "dataEmitter")
    @Input()
    set data(value: any[]) {
        this._data = value;
        this.dataSource.data = this._data;
        this.dataChange.emit(this._data);

    }

    get data() {
        return this._data;
    }

    @Output() dataChange: EventEmitter<any> = new EventEmitter();

    // Opções de paginação (none | client-side | server-side)
    @Input() pagination: Paginator = "none";

    // Opções de quantidade de registros por página, caso utilize paginação
    @Input() pageSizeOptions: number[] = [25, 50, 100];

    // Opção padrão da quantidade de registros por página
    @Input() defaultPageSize: number = 25;

    // Botões de ações da tabela (edit | visualize | delete)
    @Input() actions: Action[] = null;

    // Event Emitter para identificar quando um filtro foi aplicado para resetar a paginação
    @Input() applyFilter: EventEmitter<any>;

    // Chamar a ação de edição ao clicar em um registro na tabela
    @Input() editOnRowClick: boolean = true;

    // Dados adicionais que serão passados para os componentes nas colunas da tabela
    @Input() componentExtraData: any = null;

    // Mensagem que aparecerá quando não há nenhum registro na tabela
    @Input() emptyMessage: string = "Nenhum registro encontrado.";

    // Colore a linha conforme determinada condição
    @Input() conditionalLineColor: IConditionalLineColor[] = [];

    //************************************************************************************************************//
    //************************************************** Outputs *************************************************//
    //************************************************************************************************************//

    // Evento de clique em um registro da tabela
    @Output() rowClick: EventEmitter<any> = new EventEmitter();

    // Evento de clique em alguma ação da tabela
    @Output() actionClick: EventEmitter<{ action: Action, row: any }> = new EventEmitter();

    // Evento de troca de página
    @Output() pageChange: EventEmitter<{ filters: any, paginator: IPaginator }> = new EventEmitter();

    //************************************************************************************************************//
    //************************************************ Attributes ************************************************//
    //************************************************************************************************************//

    @ViewChild(MatSort) tableSort: MatSort;
    @ViewChild(MatPaginator) tablePaginator: MatPaginator;

    displayedColumns: string[] = [];
    dataSource = new MatTableDataSource<any>();
    cachedData: [][] = [];
    paginator: IPaginator = {
        length: 999999,
        pageIndex: 0,
        pageSize: 25,
        action: "",
        bookmark: ""
    };
    filters: any = {};
    _data: any[] = [];

    private changingPage: boolean = false;
    private actionClicked: boolean = false;
    private _status: TableStatus = "LOADING";

    get status(): TableStatus {
        return this._status;
    }

    set status(value: TableStatus) {
        this._status = value;

        if (this._status === "ERROR") {
            this.dataSource.data = [];
            this.paginator.length = 0;
            this.paginator.pageIndex = 0;
        }
    }

    //************************************************************************************************************//
    //************************************************** Methods *************************************************//
    //************************************************************************************************************//

    constructor(matPaginator: MatPaginatorIntl) {
        matPaginator.itemsPerPageLabel = "Itens por página:";

        matPaginator.getRangeLabel = (page: number, pageSize: number, length: number): string => {
            const start: number = (length > 0) ? (page * pageSize + 1) : 0;
            let end: number = (page + 1) * pageSize;

            if (length !== 999999 && end > length) {
                end = length;
            }

            const lengthText: string = (length === 999999) ? "vários" : length.toString();

            return `${start} - ${end} de ${lengthText}`
        }
    }

    ngOnInit() {
        if (this.data?.length && this.pagination === "server-side") {
            throw new Error("Pagination cannot be server-side when using setDataEmitter input.");
        }

        if (this.data?.length && this.dataEmitter) {
            throw new Error("It is not allowed to use data and dataEmitter inputs together.");
        }

        this.displayedColumns = this.columns.map((column: IColumn) => column.key);
        this.paginator.pageSize = this.defaultPageSize;

        if (this.actions?.length) {
            this.actions = this.actions.reverse();
            this.displayedColumns.push("_actions");
        }

        if (this.dataEmitter) {
            this.dataEmitter.subscribe((observable) => {
                this.getData(observable);
            });
        } else if (this.data) {
            this.status = 'LOADING';
            this.dataSource.data = this.data;
            this.status = 'LOADED';
        }

        if (this.applyFilter) {
            this.applyFilter.subscribe((filters) => {
                this.paginator = {
                    length: 999999,
                    pageIndex: 0,
                    pageSize: 25,
                    action: "",
                    bookmark: ""
                };
                this.filters = filters;
                this.cachedData = [];

                this.pageChange.emit({filters: this.filters, paginator: this.paginator});
            })
        }

        if (this.pagination === 'server-side') {
            this.pageChange.emit({filters: null, paginator: this.paginator});
        }
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.tableSort;

        if (this.pagination === "client-side") {
            this.dataSource.paginator = this.tablePaginator;
        }
    }

    onPageChange($event: PageEvent) {
        this.paginatorChange($event);
        this.pageChange.emit({filters: this.filters, paginator: this.paginator});
    }

    onRowClick(row: any) {
        this.rowClick.emit(row);

        if (!this.actionClicked) {
            if (this.actions && this.actions.includes("edit")) {
                this.onActionClick("edit", row, true);
            } else if (this.actions && this.actions.includes("visualize")) {
                this.onActionClick("visualize", row, true);
            }
        } else {
            this.actionClicked = false;
        }
    }

    onActionClick(action: Action, row: any, rowClick: boolean = false) {
        if (!rowClick) {
            this.actionClicked = true;
        }

        this.actionClick.emit({action, row});
    }

    getData(observable: Observable<any>) {
        this.status = "LOADING";

        if (this.changingPage && this.cachedData[this.tablePaginator.pageIndex]) {
            this.dataSource.data = this.cachedData[this.tablePaginator.pageIndex];
            this.status = "LOADED";
        } else {
            observable.subscribe({
                next: (response: HttpResponse<any>) => {
                    this.updateData(response);
                    this.status = "LOADED";
                },
                error: () => {
                    this.status = "ERROR";
                }
            });
        }

        this.changingPage = false;
    }

    updateData(response: HttpResponse<any> | any[]) {
        if (this.pagination === "server-side") {
            if (response instanceof HttpResponse) {
                if (response.headers.get("x-last-page") === "true") {
                    this.paginator.length = this.paginator.pageIndex * this.paginator.pageSize + response.body.length;
                }
                this.cachedData.push(response.body);
                this.dataSource.data = response.body;
            } else {
                this.cachedData.push(...response);
                this.dataSource.data = response;
            }
        } else {
            if (response instanceof HttpResponse) {
                this.dataSource.data = response.body;
            } else {
                this.dataSource.data = response;
            }
        }
    }

    paginatorChange($event: PageEvent) {
        this.changingPage = true;

        let changedPageSize: boolean = false;

        this.paginator.pageIndex = $event.pageIndex;

        if (this.paginator.pageSize !== $event.pageSize) {
            this.paginator.pageSize = $event.pageSize;
            changedPageSize = true;
        }

        if (changedPageSize) {
            this.paginator.pageIndex = 0;
            this.paginator.action = "";
            this.paginator.bookmark = "";
            this.cachedData = [];
        } else if ($event.pageIndex > $event.previousPageIndex) {
            this.paginator.action = "NEXT";
            this.paginator.bookmark = this.dataSource.data[this.dataSource.data.length - 1].id;
        } else if ($event.pageIndex < $event.previousPageIndex) {
            this.paginator.action = "PREV";
            this.paginator.bookmark = this.dataSource.data[0].id;
        }
    }

    getCellData(element: Object, key: string, type?: Type) {
        const keys: string[] = key.split(".");

        let value: any = null;

        if (keys.length == 1) {
            value = element[key];
        } else if (keys.length > 1) {
            value = element;

            for (let i = 0; i < keys.length; i++) {
                value = value[keys[i]];
                if (!value) {
                    break;
                }
            }
        }

        if (!value) {
            return "-";
        }

        if (type) {
            switch (type) {
                case "currency":
                    return this.formatCurrency(value);
                case "date":
                    return this.formatDate(value);
                case "document":
                    return this.formatDocument(value);
                case "phoneNumber":
                    return this.formatPhoneNumber(value);
            }
        } else {
            return value;
        }
    }

    formatCurrency(value: any) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    formatDate(value: any) {
        const date = new Date(value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} às ${hours}:${minutes}:${seconds}`;
    }

    formatDocument(value: any) {
        value = value.replace(/\D/g, '');  // Remove todos os caracteres não numéricos

        if (value.length === 11) {
            // CPF
            return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (value.length === 14) {
            // CNPJ
            return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        } else {
            return value;
        }
    }

    formatPhoneNumber(value: any) {
        if (value.length !== 13) {
            return value;
        }

        const countryCode = value.slice(0, 2);
        const areaCode = value.slice(2, 4);
        const firstPart = value.slice(4, 9);
        const secondPart = value.slice(9);

        return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}`;
    }

    getActionsMinWidth(): string {
        switch (this.actions.length) {
            case 2:
                return "actions-2"
            case 3:
                return "actions-3"
            default:
                return ""
        }
    }

    getBackgroundColor(element: any) {
        for (let condition of this.conditionalLineColor) {
            if (element[condition.field] === condition.value) {
                return condition.color;
            }
        }

        return '#FFFFFF'
    }
}


