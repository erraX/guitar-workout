import { memo, isValidElement } from "react";

import type { TableProps } from "./NativeTable.types";

export const NativeTable = memo(function NativeTable<
  TableRow extends Record<string, any>
>({ columns, rows, className }: TableProps<TableRow>) {
  return (
    <table className="table-fixed border-separate border-spacing-2">
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              className="font-medium text-sm"
              style={{ width: column.width }}
              key={column.key}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td className="text-sm" key={column.key}>
                {isValidElement(row[column.key])
                  ? row[column.key]
                  : column.renderCell
                  ? column.renderCell(row, index)
                  : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});
