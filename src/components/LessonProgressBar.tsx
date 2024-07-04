import React, { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import { GetAllLessonsByCourseId } from "@/lib/actions/lesson.action";
import { ILesson, ILessonProgress } from "../../types";
import { Skeleton } from "./ui/skeleton";

interface Props {
  lessonsLength: number;
  courseId: string;
  accountId: string;
}

const LessonProgressBar = ({ lessonsLength, courseId, accountId }: Props) => {
  const [result, setResult] = useState(0);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: ILesson[] = JSON.parse(
          await GetAllLessonsByCourseId({
            course_id: courseId,
            account_id: accountId,
          })
        );
        const arr = data.map((lesson) => {
          return lesson.lessons_progress.filter(
            (item: ILessonProgress) =>
              item.lesson_id === lesson._id && item.isCompleted
          ).length;
        });

        const totalCompleted = arr.reduce(
          (cur: number, val: number) => cur + val,
          0
        );

        const percentage =
          Math.round((totalCompleted / lessonsLength) * 100 * 100) / 100;

        setResult(percentage);
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {isLoading ? (
        <div className="pb-2">
          <Skeleton className="w-full h-2 bg-gray-400" />
          <Skeleton className="w-28 h-5 bg-gray-400 mt-1 ml-auto" />
        </div>
      ) : (
        <div className="text-right pb-2 text-green-800">
          <ProgressBar value={result} />
          <span>Completed {result}%</span>
        </div>
      )}
    </>
  );
};

export default LessonProgressBar;
