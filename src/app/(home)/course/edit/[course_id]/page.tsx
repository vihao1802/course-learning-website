"use client";
import DescriptionCourseEdit from "@/components/CourseEdit/DescriptionCourseEdit";
import PosterCourseEdit from "@/components/CourseEdit/PosterCourseEdit";
import TitleCourseEdit from "@/components/CourseEdit/TitleCourseEdit";
import { Button } from "@/components/ui/button";
import { GetCourseById } from "@/lib/actions/course.action";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "lucide-react";
import { RingLoader } from "react-spinners";
import { cn, formatDateTime } from "@/lib/utils";
import { ICourse } from "../../../../../../types";
import PriceCourseEdit from "@/components/CourseEdit/PriceCourseEdit";
import LessonCourseEdit from "@/components/CourseEdit/LessonCourseEdit";

const CourseEditPage = () => {
  const { course_id } = useParams<{ course_id: string }>();
  const { user } = useUser();
  const router = useRouter();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [isLoading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await GetCourseById(course_id);
      if (data) setCourse(JSON.parse(data));
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !course_id) {
      return;
    }
    fetchData();
  }, [user]);

  return (
    <main className="max-w-[1200px] w-full mx-auto h-auto p-6 space-y-3">
      <div className="w-full flex flex-row items-center gap-2 font-semibold py-2 text-sm cursor-pointer">
        <Button
          onClick={() => router.push("/course")}
          className="text-black p-0"
        >
          <ArrowLeftIcon />
          <p className="ml-2">Back to your course</p>
        </Button>
      </div>
      <div className="w-full text-left mb-6">
        <h1 className="text-2xl font-bold mb-2">Edit Course</h1>
        <p className="text-gray-600">Customize your course</p>
      </div>
      {isLoading && !course && (
        <div className="flex justify-center items-center py-3">
          <RingLoader
            size={40}
            aria-label="Loading Spinner"
            data-testid="loader"
            color="#0000ff"
          />
        </div>
      )}
      {!isLoading && course && (
        <>
          <div className="w-full flex flex-row justify-between items-center">
            <h1 className="text-lg ">
              <span className="font-bold">Date create: </span>
              {formatDateTime(course.created_at)}
            </h1>
            <Button
              className={cn(
                "bg-slate-600 border border-slate-600 hover:bg-slate-800",
                {
                  "bg-white  border-red-600 text-red-600 hover:bg-red-600 border-2 hover:text-white":
                    course.isPublished,
                }
              )}
              onClick={() => {
                // fetchData();
                router.refresh();
                toast.success("Course status changed");
              }}
            >
              {course.isPublished ? "Unpublish" : "Publish"}
            </Button>
          </div>
          {!course.isPublished && (
            <p className="text-red-400 text-right">
              Your course is not published yet
            </p>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-6">
              <TitleCourseEdit
                courseId={course_id}
                courseTitle={course.title}
              />
              <DescriptionCourseEdit
                courseId={course_id}
                courseDescription={course.description}
              />
              <PosterCourseEdit
                courseId={course_id}
                coursePosterUrl={course.poster}
              />
            </div>
            <div className="space-y-6">
              <PriceCourseEdit
                courseId={course_id}
                coursePrice={course.price}
              />
              <LessonCourseEdit courseId={course_id} />
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default CourseEditPage;
