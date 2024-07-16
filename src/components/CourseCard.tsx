import Link from "next/link";
import { FC } from "react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, formatSecond } from "@/lib/utils";
import Image from "next/image";
import TextFormatDuration from "./TextFormatDuration";
import TextAccountName from "./TextAccountName";
import { ICourse } from "../../types";

const CourseCard: FC<{ course: ICourse }> = ({ course }) => {
  return (
    <div className="relative w-full h-auto sm:min-h-[350px] shadow-lg rounded-md flex flex-col border border-gray-300">
      <Link
        href={`/course/detail/${course.id}`}
        className="absolute top-0 left-0 h-full w-full z-50"
      ></Link>
      <div className="relative aspect-video">
        <Image
          src={course.poster}
          fill
          priority
          sizes="(max-width: 600px) 100vw"
          className="rounded-t-md object-cover"
          alt="Banner"
        />
      </div>
      <div className="p-3 flex-grow flex flex-col gap-3">
        <div className="flex flex-row justify-between text-gray-500">
          <p>{formatDate(course.created_at)}</p>
          <TextFormatDuration courseId={course.id} />
          {/* <p>{formatSecond(course.duration)}</p> */}
        </div>
        <h1 className="text-base font-extrabold line-clamp-2">
          {course.title}
        </h1>
        <div className="flex flex-row justify-between text-gray-500  mt-auto">
          <div className="text-gray-500">
            <div>{course.instructor_id.name}</div>
          </div>
          <Badge
            variant={"secondary"}
            className={cn("bg-green-600 text-white px-3", {
              "bg-yellow-500": course.price !== 0,
            })}
          >
            {course.price === 0 ? "Free" : "Pricing"}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
