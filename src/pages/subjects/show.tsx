import { useShow } from "@refinedev/core";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SubjectShow() {
  const { query } = useShow({ resource: "subjects" });
  const subject = query.data?.data;

  if (!subject) {
    return (
      <ShowView>
        <ShowViewHeader resource="subjects" title="Subject" />
        <p className="state-message">Loading or no subject found.</p>
      </ShowView>
    );
  }

  return (
    <ShowView>
      <ShowViewHeader resource="subjects" title="Subject Details" />
      <Card>
        <CardHeader>
          <CardTitle>{subject.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Code: {subject.code}</p>
          <p>Department: {subject.department?.name ?? "-"}</p>
          <p>Description: {subject.description}</p>
        </CardContent>
      </Card>
    </ShowView>
  );
}
