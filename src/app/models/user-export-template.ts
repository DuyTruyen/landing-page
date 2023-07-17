export interface Column {
    field: string;
    header: string;
}

export interface NameTemplate {
    name: string
    type: number;
    columns: Column[];
}
