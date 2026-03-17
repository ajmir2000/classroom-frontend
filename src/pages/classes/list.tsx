import { Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useTable } from "@refinedev/react-table";
import { useList } from "@refinedev/core";
import { ColumnDef } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";

import { Class } from "@/types";

export default function ClassesList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: subjectsData } = useList({ resource: "subjects" });
  const { data: teachersData } = useList({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "teacher" }],
  });

  const subjectOptions = subjectsData?.data?.map((subject) => ({
    value: subject.name,
    label: subject.name,
  })) || [];

  const teacherOptions = teachersData?.data?.map((teacher) => ({
    value: teacher.name,
    label: teacher.name,
  })) || [];

  const classColumns = useMemo<ColumnDef<Class>[]>(
    () => [
      {
        id: "bannerUrl",
        accessorKey: "bannerUrl",
        size: 80,
        header: () => <p className="column-title ml-2">Banner</p>,
        cell: ({ getValue }) => {
          const url = getValue<string>();
          return url ? (
            <img
              src={url}
              alt="Banner"
              className="w-10 h-10 rounded object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded bg-gray-200"></div>
          );
        },
      },
      {
        id: "name",
        accessorKey: "name",
        size: 200,
        header: () => <p className="column-title">Class Name</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
        filterFn: "includesString",
      },
      {
        id: "status",
        accessorKey: "status",
        size: 100,
        header: () => <p className="column-title">Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <Badge
              variant={status === "active" ? "default" : "secondary"}
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: "subject",
        accessorKey: "subject.name",
        size: 150,
        header: () => <p className="column-title">Subject</p>,
        cell: ({ getValue }) => (
          <Badge variant="secondary">{getValue<string>()}</Badge>
        ),
      },
      {
        id: "teacher",
        accessorKey: "teacher.name",
        size: 150,
        header: () => <p className="column-title">Teacher</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<string>()}</span>
        ),
      },
      {
        id: "capacity",
        accessorKey: "capacity",
        size: 100,
        header: () => <p className="column-title">Capacity</p>,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<number>()}</span>
        ),
      },
    ],
    [],
  );

  const subjectFilters = selectedSubject !== "all"
    ? [
        {
          field: "subject",
          operator: "eq" as const,
          value: selectedSubject,
        },
      ]
    : [];

  const teacherFilters = selectedTeacher !== "all"
    ? [
        {
          field: "teacher",
          operator: "eq" as const,
          value: selectedTeacher,
        },
      ]
    : [];

  const searchFilters = debouncedSearchQuery
    ? [
        {
          field: "name",
          operator: "contains" as const,
          value: debouncedSearchQuery,
        },
      ]
    : [];

  const classTable = useTable<Class>({
    columns: classColumns,
    refineCoreProps: {
      resource: "classes",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      filters: {
        // Compose refine filters from the current UI selections.
        permanent: [...subjectFilters, ...teacherFilters, ...searchFilters],
      },
      sorters: {
        initial: [
          {
            field: "id",
            order: "desc",
          },
        ],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Classes</h1>

      <div className="intro-row">
        <p>Quick access to essential metrics and management tools.</p>

        <div className="actions-row">
          <div className="search-field">
            <Search className="search-icon" />
            <Input
              type="text"
              placeholder="Search by name..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}>
              <SelectTrigger className="">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjectOptions.map((subject) => (
                  <SelectItem key={subject.value} value={subject.value}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedTeacher}
              onValueChange={setSelectedTeacher}>
              <SelectTrigger className="">
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teacherOptions.map((teacher) => (
                  <SelectItem key={teacher.value} value={teacher.value}>
                    {teacher.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton resource="classes" />
          </div>
        </div>
      </div>

      <DataTable table={classTable} />
    </ListView>
  );
}
