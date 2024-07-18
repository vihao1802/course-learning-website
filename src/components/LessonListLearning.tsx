import { cn, formatSecond } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ILessonProgress, ILesson } from "../../types";
import { GetAllLessonsByCourseId } from "@/lib/actions/lesson.action";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Skeleton } from "./ui/skeleton";

interface LessonListLearningProps {
  courseId: string;
  currentLessonId: string;
}

const LessonListLearning = ({
  courseId,
  currentLessonId,
}: LessonListLearningProps) => {
  const { user } = useUser();
  const [lessons, setLessons] = useState<ILesson[] | []>([]);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const data = JSON.parse(
          await GetAllLessonsByCourseId({
            course_id: courseId,
            account_id: user.id,
          })
        );

        setLessons(data);
      } catch (error) {
        toast.error("Something went wrong");
        console.log("Something went wrong at LessonListLearning");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="flex flex-col overflow-y-auto ">
      {lessons &&
        lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className={cn(
              "px-4 py-3 flex flex-row items-start cursor-pointer hover:bg-gray-200 ",
              {
                "bg-gray-200": currentLessonId === lesson.id,
              }
            )}
            onClick={() => {
              router.replace(`/course/detail/${courseId}/lesson/${lesson.id}`);
            }}
          >
            <Image
              src={
                lesson.lessons_progress && lesson.lessons_progress.length === 0
                  ? "/icons/play-circle.svg"
                  : lesson.lessons_progress &&
                    lesson.lessons_progress.filter(
                      (item: ILessonProgress) =>
                        item.lesson_id === lesson._id && item.isCompleted
                    ).length !== 0
                  ? "/icons/check.png"
                  : "/icons/play-circle.svg"
              }
              alt="Icon play"
              width={24}
              height={24}
              className="pt-1 pr-3 w-8"
            />
            <div className="flex flex-col gap-1 w-[calc(100%-32px)]">
              <p className="text-lg line-clamp-1">
                <strong>{index + 1}.</strong>
                {" " + lesson.title}
              </p>
              <p className="text-sm font-semibold">
                {formatSecond(lesson.video.duration)}
              </p>
            </div>
          </div>
        ))}
      {isLoading && (
        <>
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="px-4 py-3 flex flex-row items-start">
              <Skeleton className="h-5 w-5 mt-1 mr-3 rounded-full bg-gray-400" />
              <div className="flex flex-col gap-1 w-[calc(100%-32px)]">
                <Skeleton className="h-5 w-40 bg-gray-400" />

                <Skeleton className="h-5 w-20 bg-gray-400" />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default LessonListLearning;
