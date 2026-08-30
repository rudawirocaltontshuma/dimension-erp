"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import type { ColumnDef, ColumnVisibilityState, PaginationState, SortingState } from "@tanstack/react-table";
import { useTable } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  Download,
  Filter,
  Search,
  Settings2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/erp/states";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type DataTableFeatures, dataTableFeatures } from "@/lib/data-table-features";
import { cn } from "@/lib/utils";

/** Row type accepted by TanStack Table v9, which requires an index-signature compatible shape. */
export type ErpRow<T> = T & Record<string, unknown>;

export type ErpColumns<T> = ColumnDef<DataTableFeatures, ErpRow<T>>[];

export interface DataTableFilter<T> {
  id: string;
  label: string;
  options: string[];
  getValue: (row: T) => string;
}

interface DataTableProps<T> {
  readonly data: T[];
  readonly columns: ErpColumns<T>;
  readonly columnLabels?: Record<string, string>;
  readonly getRowId: (row: T) => string;
  readonly getSearchText?: (row: T) => string;
  readonly searchPlaceholder?: string;
  readonly filters?: DataTableFilter<T>[];
  readonly rowHref?: (row: T) => string;
  readonly pageSize?: number;
  readonly toolbarActions?: ReactNode;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly enableExport?: boolean;
  readonly className?: string;
}

const ALL = "__all__";

export function DataTable<T extends object>({
  data,
  columns,
  columnLabels,
  getRowId,
  getSearchText,
  searchPlaceholder = "Search records",
  filters = [],
  rowHref,
  pageSize = 10,
  toolbarActions,
  emptyTitle = "No records match the current view",
  emptyDescription = "Adjust the search term or filters to see more of the demonstration dataset.",
  enableExport = true,
  className,
}: DataTableProps<T>) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize });

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase();
    return data.filter((row) => {
      if (term && getSearchText && !getSearchText(row).toLowerCase().includes(term)) return false;
      return filters.every((filter) => {
        const value = filterValues[filter.id];
        if (!value || value === ALL) return true;
        return filter.getValue(row) === value;
      });
    });
  }, [data, search, filterValues, filters, getSearchText]);

  const table = useTable({
    features: dataTableFeatures,
    data: filteredData as unknown as Record<string, unknown>[],
    columns: columns as unknown as ColumnDef<DataTableFeatures, Record<string, unknown>>[],
    state: { columnVisibility, sorting, pagination },
    getRowId: getRowId as unknown as (row: Record<string, unknown>) => string,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  const activeFilterCount = filters.filter(
    (filter) => filterValues[filter.id] && filterValues[filter.id] !== ALL,
  ).length;

  const resetFilters = () => {
    setFilterValues({});
    setSearch("");
  };

  const filterControls = filters.map((filter) => (
    <div key={filter.id} className="grid gap-1.5">
      <Label htmlFor={`filter-${filter.id}`} className="text-muted-foreground text-xs md:sr-only">
        {filter.label}
      </Label>
      <Select
        value={filterValues[filter.id] ?? ALL}
        onValueChange={(value) => {
          setFilterValues((current) => ({ ...current, [filter.id]: value }));
          setPagination((current) => ({ ...current, pageIndex: 0 }));
        }}
      >
        <SelectTrigger size="sm" id={`filter-${filter.id}`} className="w-full md:w-[170px]">
          <SelectValue placeholder={filter.label} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={ALL}>All {filter.label.toLowerCase()}</SelectItem>
            {filter.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ));

  const rows = table.getRowModel().rows;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {getSearchText && (
            <div className="relative w-full md:max-w-xs">
              <Search aria-hidden className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPagination((current) => ({ ...current, pageIndex: 0 }));
                }}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="h-8 pl-8"
              />
            </div>
          )}
          {filters.length > 0 && <div className="hidden flex-wrap items-center gap-2 md:flex">{filterControls}</div>}
          {filters.length > 0 && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Filter data-icon="inline-start" />
                  Filters
                  {activeFilterCount > 0 && <span className="ml-1 text-xs">({activeFilterCount})</span>}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Refine the demonstration dataset shown in this table.</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 px-4 pb-6">{filterControls}</div>
              </SheetContent>
            </Sheet>
          )}
          {(activeFilterCount > 0 || search) && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="hidden md:inline-flex">
              <X data-icon="inline-start" />
              Reset
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {toolbarActions}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 data-icon="inline-start" />
                <span className="hidden sm:inline">Columns</span>
                <ChevronDown data-icon="inline-end" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {columnLabels?.[column.id] ?? column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {enableExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.success("Export preview prepared.", { description: "Demonstration only — no file is generated." })
              }
            >
              <Download data-icon="inline-start" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          )}
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDirection = header.column.getIsSorted();
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan} className="whitespace-nowrap">
                        {header.isPlaceholder ? null : canSort ? (
                          <button
                            type="button"
                            onClick={() => header.column.toggleSorting()}
                            className="inline-flex items-center gap-1 font-medium hover:text-foreground"
                          >
                            <table.FlexRender header={header} />
                            {sortDirection === "asc" ? (
                              <ArrowUp className="size-3.5" />
                            ) : sortDirection === "desc" ? (
                              <ArrowDown className="size-3.5" />
                            ) : (
                              <ChevronsUpDown className="size-3.5 opacity-50" />
                            )}
                          </button>
                        ) : (
                          <table.FlexRender header={header} />
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {rows.map((row) => {
                const href = rowHref?.(row.original as unknown as T);
                return (
                  <TableRow
                    key={row.id}
                    tabIndex={href ? 0 : undefined}
                    role={href ? "link" : undefined}
                    aria-label={href ? `Open ${row.id}` : undefined}
                    onClick={href ? () => router.push(href) : undefined}
                    onKeyDown={
                      href
                        ? (event) => {
                            if (event.key === "Enter") router.push(href);
                          }
                        : undefined
                    }
                    className={cn(href && "cursor-pointer focus-visible:bg-muted/70")}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          {filteredData.length} of {data.length} records
        </p>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <Label htmlFor="rows-per-page" className="font-medium text-sm">
              Rows
            </Label>
            <Select
              value={`${table.state.pagination?.pageSize ?? pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                <SelectGroup>
                  {[10, 20, 30, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <span className="font-medium text-sm">
            Page {(table.state.pagination?.pageIndex ?? 0) + 1} of {Math.max(table.getPageCount(), 1)}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">First page</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Previous page</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Next page</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
