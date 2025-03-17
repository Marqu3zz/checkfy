import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BehaviorSubject, combineLatestWith, map, Observable, of, shareReplay, startWith} from "rxjs";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {AsyncPipe} from "@angular/common";
import {MatProgressBar} from "@angular/material/progress-bar";
import {HttpResponse} from "@angular/common/http";
import {MatOptionSelectionChange} from "@angular/material/core";

@Component({
    selector: 'limber-select',
    standalone: true,
    imports: [
        NgxMatSelectSearchModule,
        MatFormField,
        MatLabel,
        MatSelect,
        ReactiveFormsModule,
        AsyncPipe,
        MatOption,
        MatProgressBar,
        FormsModule
    ],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss'
})
export class SelectComponent implements OnInit {

    //------------------------------------------------------------------------------------------------------------//
    //-------------------------------------------------- INPUTS --------------------------------------------------//
    //------------------------------------------------------------------------------------------------------------//

    // Model que receberá o valor do campo
    @Input()
    set model(value: any) {
        if (value !== this._model) {
            this._model = value;
            this.modelChange.emit(this._model);
        }
    }

    get model() {
        return this._model;
    }

    // Opções que aparecerão no select (não pode ser utilizado com o input "observable")
    @Input()
    set options(value: any[]) {
        this._options = value;
        if (value) {
            this.observable = of<any[]>(value);
            this.setOptionsObservable(this.observable);
        }
    };

    get options() {
        return this._options;
    }

    // FormControl que receberá o valor do campo
    @Input() control: FormControl;

    // Adiciona um campo de texto para buscar um valor dentre as opções
    @Input() withFilter: boolean = true;

    // Permite selecionar múltiplas opções
    @Input() multiple: boolean = false;

    // Campo que será filtrado
    @Input() optionsField: string;

    // Campo que passará o valor para o control. Se não informado, o select passará o valor do objeto inteiro para o control.
    @Input() valueField: string;

    // Observable do método de busca dos dados (não pode ser utilizado com o input "options")
    @Input() observable: Observable<any>;

    // BehaviorSubject que passará o Observable atualizado
    @Input() behaviorSubject: BehaviorSubject<Observable<any>>;

    // Exibir opção nula
    @Input() showNullOption: boolean = false;

    // Nome do campo
    @Input() label: string;

    // Texto descritivo que aparecerá ao clicar sobre o campo.
    @Input() placeholder: string = "";

    // Texto descritivo que aparecerá na caixa de pesquisa
    @Input() searchPlaceholder: string = "";

    //------------------------------------------------------------------------------------------------------------//
    //------------------------------------------------- OUTPUTS --------------------------------------------------//
    //------------------------------------------------------------------------------------------------------------//

    // Retorno do two-way binding do input "model"
    @Output() modelChange: EventEmitter<any> = new EventEmitter();

    // Retorna o objeto completo do valor selecionado
    @Output() selectionChange: EventEmitter<any> = new EventEmitter();


    //------------------------------------------------------------------------------------------------------------//
    //------------------------------------------------ PROPERTIES ------------------------------------------------//
    //------------------------------------------------------------------------------------------------------------//

    _fullValue: any;
    _model: any;
    _options: any[];

    public filter: FormControl<string> = new FormControl("");
    public options$: Observable<any[]>;
    public filteredOptions$: Observable<any[]>;

    //------------------------------------------------------------------------------------------------------------//
    //------------------------------------------------- METHODS --------------------------------------------------//
    //------------------------------------------------------------------------------------------------------------//

    ngOnInit() {
        if (this.behaviorSubject) {
            this.behaviorSubject.subscribe(async (observable) => {
                if (!observable) {
                    observable = of<any[]>([]);
                }

                this.setOptionsObservable(observable);
            });
        } else {
            this.setOptionsObservable(this.observable);
        }
    }

    setOptionsObservable(observable: Observable<any[]>) {
        this.options$ = observable.pipe(
            map(response => {
                if (response instanceof HttpResponse) {
                    return response.body;
                }
                return response;
            }),
            shareReplay()
        );

        if (this.withFilter) {
            this.filteredOptions$ = this.filter.valueChanges.pipe(
                startWith(""),
                combineLatestWith(this.options$),
                map(([filter, options]) => {
                    return options.filter(option => option[this.optionsField].toLowerCase().includes(filter));
                })
            );
        }
    }

    onSelectionChange(event: MatOptionSelectionChange, value: any) {
        if (this.multiple) {
            if (event.source.selected) {
                this._fullValue.push(value);
            } else {
                let index = this._fullValue.findIndex((option: any) => option[this.valueField] === value[this.valueField]);
                if (index >= 0) {
                    this._fullValue.splice(index, 1);
                }
            }

            this.selectionChange.emit(this._fullValue);
        } else {
            if (event.source.selected) {
                if (value !== this._fullValue) {
                    this._fullValue = value;
                    this.selectionChange.emit(this._fullValue);
                }
            }
        }
    }
}
