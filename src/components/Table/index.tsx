import React from "react";
import classNames from "classnames";
import { useTable, useSortBy, Column } from "react-table";

interface Props<T extends object> {
  className?: string;
  columns: Column<T>[];
  data: T[];
}
function Table<T extends object>({ className, columns, data }: Props<T>) {
  const { getTableProps, getTableBodyProps, rows, prepareRow } = useTable<T>(
    {
      columns,
      data,
    },
    useSortBy
  );

  return (
    <div className={classNames("table-control", className)}>
      <table {...getTableProps()}>
        <thead>
          {/* {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? " >" : " <") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))} */}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export { Table };
