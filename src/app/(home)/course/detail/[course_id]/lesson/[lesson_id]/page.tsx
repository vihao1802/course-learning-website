"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatDate, formatSecond } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import toast from "react-hot-toast";
import { ILesson } from "../../../../../../../../types";
import {
  GetLessonById,
  GetLessonIdsByCourseId,
} from "@/lib/actions/lesson.action";
import { RingLoader } from "react-spinners";
import LessonListLearning from "@/components/LessonListLearning";
import {
  UpdateStatusLessonProgress,
  UpsertLessonProgress,
} from "@/lib/actions/lessonProgress.action";
import { useUser } from "@clerk/nextjs";
import { ArrowLeftFromLine, FrownIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import ButtonMarkAsCompleted from "@/components/ButtonMarkAsCompleted";

const LessonPage = () => {
  const { user } = useUser();
  const { course_id, lesson_id } = useParams<{
    course_id: string;
    lesson_id: string;
  }>();
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [lessonIds, setLessonIds] = useState<string[] | []>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = JSON.parse(await GetLessonById(lesson_id));
        const ids = JSON.parse(await GetLessonIdsByCourseId(course_id));

        setLessonIds(ids);
        setCurrentIndex(ids.findIndex((id: string) => id === lesson_id));
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

  const handleClickPrev = async () => {
    // console.log(lessonIds[currentIndex - 1]);
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

  // handle progressbar video
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  let percentage = (progress / duration) * 100;

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
              {/* <div>
                {!lesson ? (
                  <Skeleton className=" w-44 h-10 bg-gray-400" />
                ) : lesson.lessons_progress.find(
                    (item) => item.lesson_id === lesson._id
                  )?.isCompleted ? (
                  <Button
                    className="px-2 py-1 border-2 bg-gray-500 hover:bg-gray-600"
                    onClick={() => markAsCompleted(false)}
                  >
                    <Image
                      src={"/icons/mark_completed.png"}
                      alt="Logo Check"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Keep as Incomplete
                  </Button>
                ) : (
                  <Button
                    className="px-2 py-1 border-2 bg-green-500  hover:bg-green-600"
                    onClick={() => markAsCompleted(true)}
                  >
                    <Image
                      src={"/icons/mark_completed.png"}
                      alt="Logo Check"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    Mark as Completed
                  </Button>
                )}
              </div> */}

              <ButtonMarkAsCompleted
                key={key}
                lessonId={lesson_id}
                markAsCompleted={markAsCompleted}
              />
              <div className="flex flex-row justify-end gap-2">
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
      <div className="fixed top-[60px] pt-[12px] right-0 bottom-0 w-1/3">
        <div className="flex flex-col h-full">
          <div className="px-4 space-y-2">
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
            <div className="text-right">
              <ProgressBar value={20} />
              <span>20%</span>
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
