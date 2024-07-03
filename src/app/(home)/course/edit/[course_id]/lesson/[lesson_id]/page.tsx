"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "lucide-react";
import { RingLoader } from "react-spinners";
import { cn, formatDateTime } from "@/lib/utils";
import { ILesson } from "../../../../../../../../types";
import { GetLessonById } from "@/lib/actions/lesson.action";
import TitleLessonEdit from "@/components/lesson/TitleLessonEdit";
import VideoLessonEdit from "@/components/lesson/VideoLessonEdit";

const LessonEditPage = () => {
  const { course_id, lesson_id } = useParams<{
    course_id: string;
    lesson_id: string;
  }>();
  const { user } = useUser();
  const router = useRouter();

  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [isLoading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await GetLessonById(lesson_id);

      if (data) setLesson(JSON.parse(data));
      // console.log(lesson);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !lesson_id) {
      return;
    }
    fetchData();
  }, [user]);

  return (
    <main className="max-w-[1200px] w-full mx-auto h-auto p-6 space-y-3">
      <div className="w-full flex flex-row items-center gap-2 font-semibold py-2 text-sm cursor-pointer">
        <Button
          onClick={() => router.push(`/course/edit/${course_id}`)}
          className="text-black p-0"
        >
          <ArrowLeftIcon />
          <p className="ml-2">Back to edit course</p>
        </Button>
      </div>
      <div className="w-full text-left mb-6">
        <h1 className="text-2xl font-bold mb-2">Edit Lesson</h1>
        <p className="text-gray-600">Customize your lesson</p>
      </div>
      {isLoading && !lesson && (
        <div className="flex justify-center items-center py-3">
          <RingLoader
            size={40}
            aria-label="Loading Spinner"
            data-testid="loader"
            color="#0000ff"
          />
        </div>
      )}
      {!isLoading && lesson && (
        <>
          <div className="w-full flex flex-row justify-between items-center">
            <h1 className="text-lg ">
              <span className="font-bold">Created Date: </span>
              {formatDateTime(lesson.created_at)}
            </h1>
            <Button
              className={cn(
                "bg-slate-600 border border-slate-600 hover:bg-slate-800",
                {
                  "bg-white  border-red-600 text-red-600 hover:bg-red-600 border-2 hover:text-white":
                    lesson.isPublished,
                }
              )}
              onClick={() => {
                router.refresh();
                toast.success("Course status changed");
              }}
            >
              {lesson.isPublished ? "Unpublish" : "Publish"}
            </Button>
          </div>
          {!lesson.isPublished && (
            <p className="text-red-400 text-right">
              Your course is not published yet
            </p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-6">
              <TitleLessonEdit
                lessonId={lesson_id}
                lessonTitle={lesson.title}
              />
            </div>
            <div className="space-y-6">
              <VideoLessonEdit
                lessonId={lesson_id}
                lessonVideoUrl={lesson.video.videoUrl}
              />
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default LessonEditPage;
