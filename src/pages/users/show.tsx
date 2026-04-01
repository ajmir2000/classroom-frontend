import { useShow } from "@refinedev/core";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UserShow() {
  const { query } = useShow({ resource: "users" });
  const user = query.data?.data;

  if (!user) {
    return (
      <ShowView>
        <ShowViewHeader resource="users" title="User" />
        <p className="state-message">Loading or no user found.</p>
      </ShowView>
    );
  }

  return (
    <ShowView>
      <ShowViewHeader resource="users" title="User Details" />
      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Email: {user.email}</p>
          <p>
            Role: <Badge>{user.role}</Badge>
          </p>
          <p>Created at: {new Date(user.createdAt).toLocaleString()}</p>
        </CardContent>
      </Card>
    </ShowView>
  );
}
