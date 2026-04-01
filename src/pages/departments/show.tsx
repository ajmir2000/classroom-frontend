import { useShow } from "@refinedev/core";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DepartmentShow() {
  const { query } = useShow({ resource: "departments" });
  const department = query.data?.data;

  if (!department) {
    return (
      <ShowView>
        <ShowViewHeader resource="departments" title="Department" />
        <p className="state-message">Loading or no department found.</p>
      </ShowView>
    );
  }

  return (
    <ShowView>
      <ShowViewHeader resource="departments" title="Department Details" />
      <Card>
        <CardHeader>
          <CardTitle>{department.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Code: {department.code}</p>
          <p>Description: {department.description || "-"}</p>
        </CardContent>
      </Card>
    </ShowView>
  );
}
