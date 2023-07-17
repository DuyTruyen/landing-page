export interface Column {
    field: string;
    header: string;
    width: string;
    sortField: string;
  }

  export interface UserGrid {
    type: number;
    columns: Column[];
  }
