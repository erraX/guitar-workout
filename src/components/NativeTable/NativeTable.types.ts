import type { ReactNode } from "react";

export interface TableProps<TableRow> {
  columns: TableColumn<TableRow>[];
  rows: TableRow[];
  className?: string;
}

export interface TableColumn<TableRow> {
  key: string;
  label: string;
  width?: number;
  renderCell?: (row: TableRow, index: number) => ReactNode;
}
