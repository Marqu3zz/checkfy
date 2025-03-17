export interface IPaginator {
    length: number;
    pageIndex: number;
    pageSize: number;
    action: string;
    bookmark: string;
}

export interface IColumn {
    key: string;
    title: string;
    align?: Align;
    component?: any;
    enum?: IEnum;
    type?: Type;
}

export interface IEnum {
    values: { [K in string]: string };
    default?: string;
}

export interface IConditionalLineColor {
    field: string;
    value: any;
    color: string;
}

export type Paginator = "client-side" | "server-side" | "none";
export type Action = "edit" | "visualize" | "delete";
export type Align = "left" | "center" | "right"
export type Type = "date" | "currency" | "document" | "phoneNumber";
export type TableStatus = "LOADING" | "LOADED" | "ERROR";
