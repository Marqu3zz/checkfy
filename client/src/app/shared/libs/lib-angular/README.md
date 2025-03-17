# Angular Components

Este submódulo consiste em componentes e serviços padrões para serem utilizados em projetos Angular.

## Como utilizar

O primeiro passo é clonar o submódulo para dentro do projeto. Para isso, siga os passos adiante:

1. No Fork, abra o projeto em que deseja utilizar os componentes;
2. No menu lateral, clique com o botão direito em "Submodules";
3. Clique na opção "Add New Submodule...";
4. Em "Repository URL", cole a URL de clone desse projeto;
5. Em "Folder", informe o caminho relativo até uma pasta dentro da pasta "app" do seu projeto Angular (Exemplo: client/src/app/lib/angular-components);
6. Clique em "Add Submodule".

Com o submódulo clonado, basta utilizar os recursos dele normalmente, importando seus componentes, serviços e interfaces.

## Componentes

### Select

Limber Select (\<limber-select\>) é um componente de caixa de seleção dinâmica e flexível, permitindo definir as opções manualmente ou por observable, adicionar filtro, utilizar formControl ou ngModel, entre outras configurações.

> ##### Exemplos:
>
> **Com opções pré-definidas:**
>
> - html:
>
> ```html
> <app-select [control]="form.controls.companyId"
>             [observable]="filter.select.observable"
>             [valueField]="filter.select.valueField"
>             [filterBy]="filter.select.filterBy"
>             [showNullOption]="true"
>             [label]="filter.label">
> </app-select>
> ```

### Table

Limber Table (\<limber-table\>) é um componente de tabela dinâmica e flexível, permitindo definir as colunas, paginação, ações e mais.

> ##### Exemplos:
>
> **Com paginação server-side:**
>
> - html:
>
> ```html
> <limber-table pagination="server-side"
>               (getData)="onGetData($event)"
>               (actionClick)="onActionClick($event)"
>               [columns]="columns"
>               [pageSizeOptions]="[10, 25, 50, 100]"
>               [defaultPageSize]="10"
>               [actions]="['edit']">
> </limber-table>
> ```
>
> - ts:
>
> ```ts
> export class MainComponent {
>     columns: IColumn[] = [
>         {
>             key: "id",
>             title: "ID",
>         },
>         {
>             key: "name",
>             title: "Nome"
>         },
>         {
>             key: "address.city",
>             title: "Cidade",
>         },
>         {
>             key: "active",
>             title: "Ativo",
>             align: "center",
>             enum: {
>                 values: {
>                     "true": "Sim",
>                     "false": "Não"
>                 },
>                 default: "Sim"
>             }
>         },
>         {
>             key: "role",
>             title: "Permissão",
>             align: "center",
>             component: RoleComponent
>         }
>     ];
> 
>     constructor(private companyService: CompanyService,
>                 private tableService: TableService) {
>     }
> 
>     onActionClick(event: {action: Action, row: any}) {
>         // Valida e executa a ação da maneira desejada
>     }
> 
>     onGetData(paginator: IPaginator) {
>         this.tableService.getData(
>             this.companyService.get(paginator.pageSize, paginator.action, paginator.bookmark)
>         )
>     }
> }
> ```
>
> **Com paginação client-side:**
>
> - html:
>
> ```html
> <limber-table pagination="client-side"
>               (getData)="onGetData()"
>               (actionClick)="onActionClick($event)"
>               [columns]="columns"
>               [pageSizeOptions]="[10, 25, 50, 100]"
>               [defaultPageSize]="10"
>               [actions]="['edit']">
> </limber-table>
> ```
>
> - ts:
>
> ```ts
> export class MainComponent {
>     columns: IColumn[] = [
>         {
>             key: "id",
>             title: "ID",
>         },
>         {
>             key: "name",
>             title: "Nome"
>         },
>         {
>             key: "address.city",
>             title: "Cidade",
>         },
>         {
>             key: "active",
>             title: "Ativo",
>             align: "center",
>             enum: {
>                 values: {
>                     "true": "Sim",
>                     "false": "Não"
>                 },
>                 default: "Sim"
>             }
>         },
>         {
>             key: "role",
>             title: "Permissão",
>             align: "center",
>             component: RoleComponent
>         }
>     ];
> 
>     constructor(private companyService: CompanyService,
>                 private tableService: TableService) {
>     }
> 
>     onActionClick(event: {action: Action, row: any}) {
>         // Valida e executa a ação da maneira desejada
>     }
> 
>     onGetData() {
>         this.tableService.getData(this.companyService.get())
>     }
> }
> ```
>
> **Sem paginação:**
>
> - html:
>
> ```html
> <limber-table (getData)="onGetData()"
>               (actionClick)="onActionClick($event)"
>               [columns]="columns"
>               [actions]="['edit']">
> </limber-table>
> ```
>
> - ts:
>
> ```ts
> export class MainComponent {
>     columns: IColumn[] = [
>         {
>             key: "id",
>             title: "ID",
>         },
>         {
>             key: "name",
>             title: "Nome"
>         },
>         {
>             key: "address.city",
>             title: "Cidade",
>         },
>         {
>             key: "active",
>             title: "Ativo",
>             align: "center",
>             enum: {
>                 values: {
>                     "true": "Sim",
>                     "false": "Não"
>                 },
>                 default: "Sim"
>             }
>         },
>         {
>             key: "role",
>             title: "Permissão",
>             align: "center",
>             component: RoleComponent
>         }
>     ];
> 
>     constructor(private companyService: CompanyService,
>                 private tableService: TableService) {
>     }
> 
>     onActionClick(event: {action: Action, row: any}) {
>         // Valida e executa a ação da maneira desejada
>     }
> 
>     onGetData() {
>         this.tableService.getData(this.companyService.get())
>     }
> }
> ```
