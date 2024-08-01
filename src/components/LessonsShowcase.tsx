import React, { useEffect, useState } from "react";
import { ILesson } from "../../types";
import toast from "react-hot-toast";
import { GetAllLessonByCourseId } from "@/lib/actions/lesson.action";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { formatSecond } from "@/lib/utils";

const LessonsShowcase = ({
  courseObjectId,
  courseId,
}: {
  courseObjectId: string;
  courseId: string;
}) => {
  const [lessons, setLessons] = useState<ILesson[] | []>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = JSON.parse(await GetAllLessonByCourseId(courseObjectId));
        setLessons(data);
      } catch (error) {
        toast.error("Something went wrong");
        console.log("Something went wrong at LessonsShowcase");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Lessons</h2>
      <div className="flex flex-col mt-3 border-2 p-2 rounded-md gap-4">
        {isLoading && (
          <>
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-12 bg-gray-400" />
            ))}
          </>
        )}
        {!isLoading && lessons.length === 0 && <h1>No lesson available</h1>}
        {!isLoading &&
          lessons.length > 0 &&
          lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className="relative flex flex-row justify-between w-full px-4 py-2 rounded-lg pd-2 hover:bg-gray-200"
            >
              <Link
                href={`/course/detail/${courseId}/lesson/${lesson.id}`}
                className="absolute w-full h-full top-0 left-0"
              ></Link>
              <div className="w-[95%]">
                <h2 className="font-bold text-lg line-clamp-1">
                  {lesson.title}
                </h2>
                <p className="text-sm text-gray-700">
                  Lesson {index + 1} - {formatSecond(lesson.video.duration)}
                </p>
              </div>
              <Image
                src={"/chevron-right.svg"}
                alt="Logo next"
                width="0"
                height="0"
                className="p-[6px] w-[5%] hidden md:block"
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default LessonsShowcase;
