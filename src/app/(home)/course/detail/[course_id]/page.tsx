"use client";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GetCourseById } from "@/lib/actions/course.action";
import { RingLoader } from "react-spinners";
import { ICourse } from "../../../../../../types";
import { formatDate } from "@/lib/utils";
import InstructorInfo from "@/components/InstructorInfo";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import LessonsShowcase from "@/components/LessonsShowcase";
import TextFormatDuration from "@/components/TextFormatDuration";
import {
  GetLessonProgressByAccountIdAndLessonId,
  GetLessonProgressCurrent,
  UpsertAllLessonsByAccountIdAndCourseId,
} from "@/lib/actions/lessonProgress.action";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

const CourseDetailPage = () => {
  const { user } = useUser();
  const { course_id } = useParams<{ course_id: string }>();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isEnroll, setEnroll] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const data: ICourse | null = JSON.parse(await GetCourseById(course_id));

        // console.log(data?.lessons[0]);
        if (data && data.lessons && data.lessons[0]) {
          var check = JSON.parse(
            await GetLessonProgressByAccountIdAndLessonId({
              accountId: user.id,
              lessonId: data.lessons[0].id,
            })
          );
          setEnroll(true);
        } else {
          setEnroll(false);
          console.log("hello");
        }
        console.log(check);

        if (data) setCourse(data);
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleEnroll = async () => {
    if (!user) return toast.error("You are not signed in");
    try {
      const data = JSON.parse(
        await UpsertAllLessonsByAccountIdAndCourseId({
          accountId: user.id,
          courseId: course_id,
        })
      );
      router.push(`/course/detail/${course_id}/lesson/${data.id}`);
    } catch (error: any) {
      toast.error("Something went wrong");
      console.log("Error at handleEnroll" + error.message);
    }
  };

  const handleContinue = async () => {
    if (!user) return toast.error("You are not signed in");

    try {
      const currentLessonId = JSON.parse(
        await GetLessonProgressCurrent({
          courseId: course_id,
          accountId: user.id,
        })
      );
      // console.log(currentLessonId);
      router.push(`/course/detail/${course_id}/lesson/${currentLessonId}`);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  if (!course || isLoading || !user)
    return (
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] h-screen">
        <RingLoader
          size={40}
          aria-label="Loading Spinner"
          data-testid="loader"
          color="#0000ff"
          className=""
        />
      </div>
    );

  return (
    <main className="max-w-[1000px] w-full mx-auto h-auto p-6">
      <Button onClick={() => router.push("/")} className="text-black p-0 mb-2">
        <ArrowLeftIcon />
        <p className="ml-2">Back to home</p>
      </Button>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-gray-700">{course.description}</p>
        <InstructorInfo accountId={course.instructor_id} />
        <div>
          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="col-span-2">
              <img
                src={course.poster}
                alt="Banner"
                loading="lazy"
                className="rounded-md w-full h-auto aspect-video object-cover border border-gray-300"
              />
              <LessonsShowcase courseId={course_id} />
            </div>

            <div className="sticky col-span-1 top-[60px] right-0 flex flex-col flex-grow space-y-4 max-h-[280px] h-auto p-3 rounded-md shadow-2xl border-2">
              <h2 className="pb-2 border-b-2 font-bold text-xl">
                Course overview
              </h2>
              <div className="flex flex-row justify-between">
                <p>Date created:</p>
                <p className="font-bold">{formatDate(course.created_at)}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Total lessons:</p>
                <p className="font-bold">{course.lessons.length}</p>
              </div>
              <div className="flex flex-row justify-between">
                <p>Total duration:</p>
                <div className="font-bold">
                  <TextFormatDuration courseId={course_id} />
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <p>Cost:</p>
                <p className="font-bold">${course.price}</p>
              </div>
              {course.lessons[0] ? (
                isEnroll ? (
                  <Button
                    className="w-full py-2 text-white bg-slate-600 hover:bg-slate-800 mt-auto"
                    onClick={handleContinue}
                  >
                    Continue{" "}
                    <ArrowRightIcon className="ml-2" width={20} height={20} />
                  </Button>
                ) : (
                  <Button
                    className="w-full py-2 text-white bg-green-600 hover:bg-green-700 mt-auto"
                    onClick={handleEnroll}
                  >
                    Enroll Now
                  </Button>
                )
              ) : (
                <Button
                  className="w-full py-2 text-white bg-gray-600  mt-auto"
                  disabled
                >
                  On-going...
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetailPage;
