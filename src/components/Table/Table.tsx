import { isValidElement } from "react";
import {
  Table as NTable,
  TableBody as NTableBody,
  TableCell as NTableCell,
  TableColumn as NTableColumn,
  TableHeader as NTableHeader,
  TableRow as NTableRow,
} from "@nextui-org/react";

import type { TableProps } from "./Table.types";

export function Table<TableRow extends Record<string, any>>({
  columns,
  rows,
  className,
}: TableProps<TableRow>) {
  return (
    <NTable aria-label="table" className={className}>
      <NTableHeader>
        {columns.map((column) => (
          <NTableColumn key={column.key} width={column.width}>
            {column.label}
          </NTableColumn>
        ))}
      </NTableHeader>
      <NTableBody>
        {rows.map((row, index) => (
          <NTableRow key={index}>
            {columns.map((column) => (
              <NTableCell key={column.key}>
                {isValidElement(row[column.key])
                  ? row[column.key]
                  : column.renderCell
                  ? column.renderCell(row, index)
                  : row[column.key]}
              </NTableCell>
            ))}
          </NTableRow>
        ))}
      </NTableBody>
    </NTable>
  );
}
