"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { getAccountById, getAllAccount } from "@/lib/actions/account.action";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GetCourseById } from "@/lib/actions/course.action";
import { RingLoader } from "react-spinners";
import { Course } from "../../../../../../types";
import { formatDate } from "@/lib/utils";
import InstructorInfo from "@/components/InstructorInfo";
import { ArrowLeftIcon } from "lucide-react";
import LessonsShowcase from "@/components/LessonsShowcase";
import TextFormatDuration from "@/components/TextFormatDuration";

const CourseDetailPage = () => {
  const { course_id } = useParams<{ course_id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetCourseById(course_id);
        const parsedData = JSON.parse(data);
        if (parsedData) setCourse(parsedData);
      } catch (error: any) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEnroll = async () => {
    try {
      // const account = await getAllAccount();
      // console.log(JSON.parse(account));
    } catch (error: any) {
      console.log("Error at handleEnroll" + error.message);
    }
  };

  if (!course || isLoading)
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
              // lessons showcase here
              {/* <div className="mt-4">
                <h2 className="text-xl font-bold">Lessons</h2>
                <div className="flex flex-col mt-3 border-2 p-2 rounded-md gap-4">
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
                  <div className="relative flex flex-row justify-between w-full px-4 py-2 rounded-xl pd-2">
                    <Link
                      href={`/course/detail/1/lesson/2`}
                      className="absolute w-full h-full top-0 left-0"
                    ></Link>
                    <div className="w-[95%]">
                      <h2 className="font-bold text-lg line-clamp-1">
                        Web Programming Introduce Web Programming Introduce Web
                        Programming Introduce
                      </h2>
                      <p className="text-sm text-gray-700">Lesson 2 - 8min</p>
                    </div>
                    <Image
                      src={"/chevron-right.svg"}
                      alt="Logo next"
                      width="0"
                      height="0"
                      className="p-[6px] w-[5%]"
                    />
                  </div>
                  <div className="relative flex flex-row justify-between w-full px-4 py-2 rounded-xl pd-2">
                    <Link
                      href={`/course/detail/1/lesson/1`}
                      className="absolute w-full h-full top-0 left-0"
                    ></Link>
                    <div className="w-[95%]">
                      <h2 className="font-bold text-lg line-clamp-1">
                        Web Programming Introduce Web Programming Introduce Web
                        Programming Introduce
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
                  <div className="relative flex flex-row justify-between w-full px-4 py-2 rounded-xl pd-2">
                    <Link
                      href={`/course/detail/1/lesson/1`}
                      className="absolute w-full h-full top-0 left-0"
                    ></Link>
                    <div className="w-[95%]">
                      <h2 className="font-bold text-lg line-clamp-1">
                        Web Programming Introduce Web Programming Introduce Web
                        Programming Introduce
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
                </div>
              </div> */}
              <LessonsShowcase courseId={course_id} />
            </div>

            <div className="sticky col-span-1 top-[60px] right-0 flex flex-col flex-grow gap-3 max-h-[250px] h-auto p-3 rounded-md shadow-2xl border-2">
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
                {/* <p className="font-bold">{}</p> */}
                <TextFormatDuration courseId={course_id} />
              </div>
              <div className="flex flex-row justify-between">
                <p>Cost:</p>
                <p className="font-bold">${course.price}</p>
              </div>
              <Button
                className="w-full py-2 text-white bg-green-600 hover:bg-green-700 mt-auto"
                onClick={handleEnroll}
              >
                Enroll Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetailPage;
