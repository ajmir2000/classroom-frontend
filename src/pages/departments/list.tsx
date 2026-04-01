import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";

import { Department } from "@/types";

export default function DepartmentsList() {
  const [searchQuery, setSearchQuery] = useState("");

  const departmentColumns = useMemo<ColumnDef<Department>[]>(
    () => [
      { id: "code", accessorKey: "code", header: "Code" },
      { id: "name", accessorKey: "name", header: "Name" },
      { id: "description", accessorKey: "description", header: "Description" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ShowButton
            resource="departments"
            recordItemId={row.original.id}
            size="sm"
            variant="outline">
            View
          </ShowButton>
        ),
      },
    ],
    [],
  );

  const searchFilters = searchQuery
    ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
    : [];

  const departmentTable = useTable<Department>({
    columns: departmentColumns,
    refineCoreProps: {
      resource: "departments",
      pagination: { pageSize: 10, mode: "server" },
      filters: { permanent: [...searchFilters] },
      sorters: { initial: [{ field: "id", order: "desc" }] },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Departments</h1>
      <div className="intro-row">
        <p>Manage academic departments.</p>
        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name or code..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <CreateButton resource="departments" />
        </div>
      </div>
      <DataTable table={departmentTable} />
    </ListView>
  );
}
