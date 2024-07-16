"use client";
import CourseCard from "@/components/CourseCard";
import { GetAllCourses } from "@/lib/actions/course.action";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ICourse } from "../../../types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [courses, setCourses] = useState<ICourse[] | []>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await GetAllCourses();
        console.log(JSON.parse(data));
        setCourses(JSON.parse(data));
      } catch (error) {
        toast.error("Error fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="max-w-[1000px] w-full mx-auto h-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
        <h1 className="text-2xl font-bold ">All course</h1>
        {/* <div className="w-auto flex flex-row items-center gap-2 h-full p-2 border-2 border-gray-600 rounded-md ">
          <Image
            src={"/icons/search-outline.svg"}
            alt={"Icon Search"}
            height={24}
            width={24}
          />
          <input
            className="outline-none border-none w-full sm:w-[300px]"
            type="text"
            placeholder="Search..."
          />
        </div> */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full mt-5 sm:mt-10">
        {!isLoading
          ? courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          : Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-auto sm:min-h-[350px] shadow-lg rounded-md flex flex-col"
              >
                <div className="relative aspect-video">
                  <Skeleton className="w-full h-full bg-gray-400" />
                </div>
                <div className="p-3 flex-grow flex flex-col gap-3">
                  <div className="flex flex-row justify-between text-gray-500">
                    <Skeleton className="w-20 h-5 bg-gray-400" />
                    <Skeleton className="w-20 h-5 bg-gray-400" />
                  </div>
                  <Skeleton className="w-36 h-6 bg-gray-400" />
                  <div className="flex flex-row justify-between text-gray-500  mt-auto">
                    <Skeleton className="w-16 h-6 bg-gray-400" />
                    <Skeleton className="w-16 h-6 bg-gray-400" />
                  </div>
                </div>
              </div>
            ))}
      </div>
    </main>
  );
}
