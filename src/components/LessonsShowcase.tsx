import React, { useEffect, useState } from "react";
import { Lesson } from "../../types";
import toast from "react-hot-toast";
import { GetAllLessonByCourseId } from "@/lib/actions/lesson.action";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

const LessonsShowcase = ({ courseId }: { courseId: string }) => {
  const [lessons, setLessons] = useState<Lesson[] | []>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = JSON.parse(await GetAllLessonByCourseId(courseId));
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
        {(isLoading || !lessons) && (
          <>
            {Array.from({ length: 4 }).map((_, index) => {
              <Skeleton key={index} className="w-full h-6" />;
            })}
          </>
        )}

        {!isLoading && lessons && (
          <div className="relative flex flex-row justify-between w-full px-4 py-2 rounded-lg pd-2 hover:bg-slate-200">
            <Link
              href={`/course/detail/1/lesson/1`}
              className="absolute w-full h-full top-0 left-0"
            ></Link>
            <div className="w-[95%]">
              <h2 className="font-bold text-lg line-clamp-1">
                Web Programming Introduce Programming Introduce
              </h2>
              <p className="text-sm text-gray-700">Lesson 1 - 4min</p>
            </div>
            <Image
              src={"/chevron-right.svg"}
              alt="Logo next"
              width="0"
              height="0"
              className="p-[6px] w-[5%]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonsShowcase;
