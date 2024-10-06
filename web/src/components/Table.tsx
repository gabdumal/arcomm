import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { cx } from "class-variance-authority";
import { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";

interface TableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  emptyMessage?: string;
}

export default function Table<T>({ columns, data }: TableProps<T>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const {
    getHeaderGroups,
    getRowModel,
    firstPage,
    getCanPreviousPage,
    previousPage,
    getCanNextPage,
    nextPage,
    lastPage,
    getState,
    getPageCount,
    setPageIndex,
    setPageSize,
    getRowCount,
  } = useReactTable({
    columns: columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div className="gap-2">
      <table>
        <thead>
          {getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-faint-dark">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="bg-opacity-0 text-start text-xl">
                  {typeof header.column.columnDef.header === "function"
                    ? header.column.columnDef.header(header.getContext())
                    : header.column.columnDef.header}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {getRowModel().rows.map((row) => {
            return (
              <tr key={row.id} className={tableRow}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} className={tableData}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="items-center justify-between gap-2 sm:flex-row">
        <div className="flex-row gap-2">
          <Button
            type="button"
            text="<<"
            onClick={() => {
              firstPage();
            }}
            disabled={!getCanPreviousPage()}
            className={paginationButton}
            intent="secondary"
          />
          <Button
            type="button"
            text="<"
            onClick={() => {
              previousPage();
            }}
            disabled={!getCanPreviousPage()}
            className={paginationButton}
            intent="secondary"
          />
          <Button
            type="button"
            text=">"
            onClick={() => {
              nextPage();
            }}
            disabled={!getCanNextPage()}
            className={paginationButton}
            intent="secondary"
          />
          <Button
            type="button"
            text=">>"
            onClick={() => {
              lastPage();
            }}
            disabled={!getCanNextPage()}
            className={paginationButton}
            intent="secondary"
          />
        </div>
        <div className="items-center gap-2 sm:flex-row">
          <div className="flex-row">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <div>Page</div>
              <strong>
                {getState().pagination.pageIndex + 1} of{" "}
                {getPageCount().toLocaleString()}
              </strong>
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              &nbsp;|&nbsp;Go to page:
            </span>
          </div>
          <div className="flex-row gap-2">
            <Input
              inputId="pagination-page-input"
              name="paginationPage"
              type="number"
              step={1}
              min={1}
              max={getPageCount()}
              defaultValue={getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                if (page < 0) {
                  setPageIndex(0);
                  return;
                }
                if (page >= getPageCount()) {
                  setPageIndex(getPageCount() - 1);
                  return;
                }
                setPageIndex(page);
              }}
            />
            <Select
              value={getState().pagination.pageSize}
              options={[5, 10, 20, 30].map((pageSize) => ({
                key: pageSize.toString(),
                value: pageSize.toString(),
                label: `Show ${pageSize.toString()}`,
              }))}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            />
          </div>
        </div>
      </div>
      <div>
        Showing {getRowModel().rows.length.toLocaleString()} of&nbsp;
        {getRowCount().toLocaleString()} Rows
      </div>
    </div>
  );
}

const tableRow = cx(["odd:bg-faint-common", "even:bg-faint-light"]);
const tableData = cx(["bg-opacity-0", "break-all px-2 py-1"]);
const paginationButton = cx(["w-16"]);
