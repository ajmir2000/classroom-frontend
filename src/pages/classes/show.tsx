import { AdvancedImage } from "@cloudinary/react";
import { useShow, useList, useCreate, useDelete } from "@refinedev/core";
import { useState } from "react";
import { useParams } from "react-router";

import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { bannerPhoto } from "@/lib/cloudinary";
import { ClassDetails } from "@/types";

const ClassesShow = () => {
  const { id } = useParams();
  const classId = Number(id);

  const { query } = useShow<ClassDetails>({ resource: "classes" });
  const classDetails = query.data?.data;
  const { isLoading, isError } = query;

  const [studentToEnroll, setStudentToEnroll] = useState<string>("");

  const { query: enrolledQuery, refetch: refetchEnrollments } = useList({
    resource: "enrollments",
    filters: [{ field: "classId", operator: "eq", value: classId }],
    pagination: { mode: "server", pageSize: 20 },
  });

  const { data: studentsData } = useList({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "student" }],
    pagination: { mode: "off" },
  });

  const { mutate: enrollStudent, isLoading: enrolling } = useCreate();
  const { mutate: removeEnrollment, isLoading: removing } = useDelete();

  const enrollments = enrolledQuery.data?.data || [];
  const students = studentsData?.data || [];

  const canEnroll =
    classDetails &&
    classDetails.enrolledCount !== undefined &&
    classDetails.capacity > classDetails.enrolledCount;

  const handleEnroll = async () => {
    if (!studentToEnroll || !classId) return;

    enrollStudent(
      {
        resource: "enrollments",
        values: { classId, studentId: studentToEnroll },
      },
      {
        onSuccess() {
          setStudentToEnroll("");
          refetchEnrollments();
          query.refetch?.();
        },
      },
    );
  };

  const handleUnenroll = async (enrollmentId: number) => {
    removeEnrollment(
      { resource: "enrollments", id: enrollmentId },
      {
        onSuccess() {
          refetchEnrollments();
          query.refetch?.();
        },
      },
    );
  };

  if (isLoading || isError || !classDetails)
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="classes" title="Class Details" />

        <p className="state-message">
          {isLoading
            ? "Loading class details ..."
            : isError
            ? "Error loading class details"
            : "No class details found"}
        </p>
      </ShowView>
    );

  const teacherName = classDetails.teacher?.name ?? "Unknown";
  const teachersInitials = teacherName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
    teachersInitials || "NA",
  )}`;

  const {
    name,
    description,
    status,
    capacity,
    bannerUrl,
    bannerCldPubId,
    teacher,
  } = classDetails;

  return (
    <ShowView className="class-view class-show space-y-6">
      <ShowViewHeader resource="classes" title="Class Details" />

      <div className="banner">
        {bannerUrl ? (
          bannerUrl.includes("res.cloudinary.com") && bannerCldPubId ? (
            <AdvancedImage
              cldImg={bannerPhoto(
                classDetails.bannerCldPubId ?? "",
                classDetails.name,
              )}
              alt="Class Banner"
            />
          ) : (
            <img src={bannerUrl} alt={name} loading="lazy" />
          )
        ) : (
          <div className="placeholder" />
        )}
      </div>

      <Card className="details-card">
        {/* Class Details */}
        <div>
          <div className="details-header">
            <div>
              <h1>{name}</h1>
              <p>{description}</p>
            </div>

            <div>
              <Badge variant="outline">{capacity} spots</Badge>
              <Badge
                variant={status === "active" ? "default" : "secondary"}
                data-status={status}>
                {status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="details-grid">
            <div className="instructor">
              <p>👨‍🏫 Instructor</p>
              <div>
                <img src={teacher?.image ?? placeholderUrl} alt={teacherName} />

                <div>
                  <p>{teacherName}</p>
                  <p>{classDetails?.teacher?.email}</p>
                </div>
              </div>
            </div>

            <div className="department">
              <p>🏛️ Department</p>

              <div>
                <p>{classDetails?.department?.name}</p>
                <p>{classDetails?.department?.description}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Subject Card */}
        <div className="subject">
          <p>📚 Subject</p>

          <div>
            <Badge variant="outline">
              Code: <span>{classDetails?.subject?.code}</span>
            </Badge>
            <p>{classDetails?.subject?.name}</p>
            <p>{classDetails?.subject?.description}</p>
          </div>
        </div>

        <Separator />

        {/* Invite and Enrollment Section */}
        <div className="join">
          <h2>🎓 Class Access</h2>
          <p>
            Invite code: <strong>{classDetails?.inviteCode ?? "N/A"}</strong>
          </p>
          <p>
            Capacity: {classDetails?.enrolledCount ?? 0}/
            {classDetails?.capacity}
            {classDetails &&
              classDetails.capacity - (classDetails.enrolledCount ?? 0) <=
                5 && (
                <span className="text-warning ml-2">Low capacity left</span>
              )}
          </p>
        </div>

        <Separator />

        <div className="space-y-3">
          <h2>Enrolled Students</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
            <div>
              <label className="text-sm mb-1 block">
                Pick student to enroll
              </label>
              <select
                className="w-full rounded border p-2"
                value={studentToEnroll}
                onChange={(e) => setStudentToEnroll(e.target.value)}>
                <option value="">Select a student</option>
                {students.map((student: any) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
            </div>
            <Button
              className="w-full sm:w-auto"
              onClick={handleEnroll}
              disabled={!canEnroll || enrolling || !studentToEnroll}>
              Enroll Student
            </Button>
          </div>

          {enrollments.length === 0 ? (
            <p>No students enrolled yet.</p>
          ) : (
            <div className="space-y-2">
              {enrollments.map((enrol: any) => (
                <div
                  key={enrol.id}
                  className="rounded border p-3 flex items-center justify-between">
                  <div>
                    <p>{enrol.student?.name || enrol.studentId}</p>
                    <p className="text-xs text-muted-foreground">
                      {enrol.student?.email}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnenroll(enrol.id)}
                    disabled={removing}>
                    Unenroll
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Join Class Section */}
        <div className="join">
          <h2>🎓 Join Class</h2>

          <ol>
            <li>Ask your teacher for the invite code.</li>
            <li>Click on &quot;Join Class&quot; button.</li>
            <li>Paste the code and click &quot;Join&quot;</li>
          </ol>
        </div>

        <Button size="lg" className="w-full">
          Join Class
        </Button>
      </Card>
    </ShowView>
  );
};

export default ClassesShow;
