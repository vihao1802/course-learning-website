"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatDate, formatSecond } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { ILesson, ILessonProgress } from "../../../../../../../../types";
import {
  GetAllLessonsByCourseId,
  GetLessonById,
  GetLessonIdsByCourseId,
} from "@/lib/actions/lesson.action";
import { RingLoader } from "react-spinners";
import LessonListLearning from "@/components/LessonListLearning";
import { UpdateStatusLessonProgress } from "@/lib/actions/lessonProgress.action";
import { useUser } from "@clerk/nextjs";
import { ArrowLeftFromLine, CircleCheckBigIcon, FrownIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import ButtonMarkAsCompleted from "@/components/ButtonMarkAsCompleted";
import LessonProgressBar from "@/components/LessonProgressBar";
import ProgressBar from "@/components/ProgressBar";

const LessonPage = () => {
  const { user } = useUser();
  const { course_id, lesson_id } = useParams<{
    course_id: string;
    lesson_id: string;
  }>();
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [isLoadingCurIndex, setLoadingCurIndex] = useState(true);
  const [lessonIds, setLessonIds] = useState<string[] | []>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(0);
  const [key, setKey] = useState(0);
  const [lessons, setLessons] = useState<ILesson[] | []>([]);

  // get lesson by id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = JSON.parse(await GetLessonById(lesson_id));
        setLesson(data);
      } catch (error) {
        toast.error("Something went wrong");
        console.log("Something went wrong at LessonPage");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // get current index
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ids = JSON.parse(await GetLessonIdsByCourseId(course_id));
        setLessonIds(ids);
        setCurrentIndex(ids.findIndex((id: string) => id === lesson_id));
      } catch (error) {
        toast.error("Something went wrong");
        console.log("Something went wrong at LessonPage");
      } finally {
        setLoadingCurIndex(false);
      }
    };

    fetchData();
  }, []);

  // get all lessons by course Id and Account Id
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        // get all lesson in this course with the account id signed in
        const data: ILesson[] = JSON.parse(
          await GetAllLessonsByCourseId({ course_id, account_id: user.id })
        );
        setLessons(data);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [user, key]);

  // get completed percentage

  useEffect(() => {
    if (!user || lessons.length === 0) return;
    const fetchData = async () => {
      try {
        // get array with filter item === lesson.id and item is completed (is true)
        // if filter is correct that means array will be 1 and 0 otherwise
        const arr = lessons.map((lesson) => {
          return lesson.lessons_progress.filter(
            (item: ILessonProgress) =>
              item.lesson_id === lesson._id && item.isCompleted
          ).length;
        });

        // calculate sum of all item in arr
        const totalCompleted = arr.reduce(
          (cur: number, val: number) => cur + val,
          0
        );

        // calculate percentage
        const percentage =
          Math.round((totalCompleted / lessons.length) * 100 * 100) / 100;

        setResult(percentage);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchData();
  }, [lessons, key]);

  const handleClickPrev = async () => {
    router.replace(
      `/course/detail/${course_id}/lesson/${lessonIds[currentIndex - 1]}`
    );
  };

  const handleClickNext = () => {
    router.replace(
      `/course/detail/${course_id}/lesson/${lessonIds[currentIndex + 1]}`
    );
  };

  const markAsCompleted = async (status: Boolean) => {
    if (!user) return;
    try {
      await UpdateStatusLessonProgress({
        accountId: user.id,
        lessonId: lesson_id,
        status,
      });
      setKey((prev) => prev + 1);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="relative  h-[calc(100vh-60px)]  flex flex-row gap-2 ">
      <div className="w-2/3 flex flex-col bg-gray-50">
        <div className="flex flex-col overflow-auto h-full">
          <div className=" bg-white">
            <div className="relative aspect-video">
              {isLoading && !lesson && (
                <RingLoader
                  color="blue"
                  className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
                />
              )}
              {!isLoading && lesson && lesson.video.videoUrl === "" && (
                <div className="w-full h-full flex flex-row items-center justify-center gap-2">
                  <FrownIcon width={50} height={50} />
                  <h1 className="text-xl font-bold">Video unavailable</h1>
                </div>
              )}
              {/* {!isLoading && lesson && lesson.video.videoUrl !== "" && (
                <video
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                >
                  <source src={lesson.video.videoUrl} type="video/mp4" />
                  <track
                    src="/path/to/captions.vtt"
                    kind="subtitles"
                    srcLang="en"
                    label="English"
                  />
                  Your browser does not support the video tag.
                </video>
              )} */}
            </div>
          </div>
          <div className="p-3 space-y-4 flex-grow">
            <div className="flex flex-row justify-between ">
              {user ? (
                <ButtonMarkAsCompleted
                  key={key}
                  lessonId={lesson_id}
                  accountId={user.id}
                  markAsCompleted={markAsCompleted}
                />
              ) : (
                <Skeleton className=" w-44 h-10 bg-gray-400" />
              )}
              <div className="flex flex-row justify-end gap-2">
                {isLoadingCurIndex && (
                  <Skeleton className="w-[120px] h-10 bg-gray-400" />
                )}
                {isLoadingCurIndex && (
                  <Skeleton className="w-[120px] h-10 bg-gray-400" />
                )}
                {currentIndex > 0 && (
                  <Button
                    className="w-[120px] py-1 border-2 text-slate-700 border-slate-700 hover:bg-white"
                    onClick={handleClickPrev}
                  >
                    Previous
                  </Button>
                )}
                {currentIndex < lessonIds.length - 1 && (
                  <Button
                    className="w-[120px] py-1 border-2 border-slate-700 bg-slate-700 hover:bg-slate-950"
                    onClick={handleClickNext}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-4 text-lg">
              <h2 className="text-xl font-bold">About the lesson</h2>
              <div className=" flex flex-row justify-between">
                <p>Title:</p>
                {lesson ? (
                  <p className="font-bold">{lesson.title}</p>
                ) : (
                  <Skeleton className="w-44 h-7 bg-gray-400" />
                )}
              </div>
              <div className="flex flex-row justify-between">
                <p>Created Date:</p>
                {lesson ? (
                  <p className="font-bold">{formatDate(lesson.created_at)}</p>
                ) : (
                  <Skeleton className="w-44 h-7 bg-gray-400" />
                )}
              </div>
              <div className="flex flex-row justify-between">
                <p>Duration:</p>
                {lesson ? (
                  <p className="font-bold">
                    {formatSecond(lesson.video.duration)}
                  </p>
                ) : (
                  <Skeleton className="w-44 h-7 bg-gray-400" />
                )}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">Show Note (On progress...)</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed top-[60px] right-0 bottom-0 w-1/3">
        <div className="flex flex-col h-full ">
          {result === 100 && (
            <div className="w-full text-center py-4  bg-green-700">
              <p className="text-white flex flex-row justify-center gap-2 items-center">
                <CircleCheckBigIcon width={22} height={22} />
                Congrats! You've completed this course
              </p>
            </div>
          )}
          <div className="px-4 pt-2 space-y-2">
            <div className="flex flex-row justify-between items-center">
              <h2 className="font-bold text-xl">Your progress</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="border bg-white text-gray-400 hover:text-gray-600 p-2 space-x-1 gap-1 items-center"
                      onClick={() =>
                        router.replace(`/course/detail/${course_id}`)
                      }
                    >
                      <ArrowLeftFromLine />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Leave</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {/* {!isLoadingCurIndex && user ? (
              <LessonProgressBar
                key={key}
                lessonsLength={lessonIds.length}
                courseId={course_id}
                accountId={user.id}
              />
            ) : (
              <div className="pb-2">
                <Skeleton className="w-full h-2 bg-gray-400" />
                <Skeleton className="w-28 h-5 bg-gray-400 ml-auto mt-1" />
              </div>
            )} */}
            <div className="text-right pb-2 text-green-600">
              <ProgressBar value={result} />
              <span>Completed {result}%</span>
            </div>
          </div>

          <LessonListLearning
            key={key}
            courseId={course_id}
            currentLessonId={lesson_id}
          />
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
