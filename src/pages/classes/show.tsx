import { AdvancedImage } from "@cloudinary/react";
import { useShow } from "@refinedev/core";

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
  const { query } = useShow<ClassDetails>({ resource: "classes" });
  const classDetails = query.data?.data;
  const { isLoading, isError } = query;

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
