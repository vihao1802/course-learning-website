"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { GetCoursesByAccountId } from "@/lib/actions/course.action";
import { ICourse } from "../../../../types";
import { RingLoader } from "react-spinners";
import RowTable from "@/components/CourseTeaching/RowTable";

const YourCoursePage = () => {
  const { user } = useUser();
  const router = useRouter();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await GetCoursesByAccountId(user.id);
        if (data) setCourses(JSON.parse(data));
      } catch (error: any) {
        console.log("Error at fetchData: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <main className="max-w-[1200px] w-full mx-auto h-auto p-6">
      <div className="w-full text-left mb-6">
        <h1 className="text-2xl font-bold mb-2">Courses</h1>
        <p className="text-gray-600">View and manage courses</p>
      </div>
      <div className="flex flex-row justify-between items-center mb-4">
        <div className="w-auto flex flex-row items-center gap-2 h-full py-1 px-2 border-2 border-gray-600 rounded-md ">
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
        </div>
        <Button
          className=" bg-slate-600 hover:bg-slate-800"
          onClick={() => router.push("/course/create")}
        >
          Create course
        </Button>
      </div>
      <div className="shadow-xl max-w-[1200px] overflow-x-auto w-full border border-gray-300 rounded-md">
        <table className="min-w-[1100px] w-full text-left px-2">
          <thead className="bg-gray-100 font-bold ">
            <tr>
              <th className="p-4 text-center">#</th>
              <th className="px-6 py-4 text-center">Poster</th>
              <th className="p-4">Title</th>
              <th className="p-4">Date Created</th>
              <th className="p-4">Duration</th>
              <th className="p-4 text-center">Lessons</th>
              <th className="p-4 text-center">Cost</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          {!isLoading && (
            <tbody>
              {courses && courses.length > 0 ? (
                courses.map((course, index) => (
                  <RowTable key={index} course={course} index={index} />
                ))
              ) : (
                <tr className="text-center  text-base text-gray-600">
                  <td colSpan={7} className="p-4">
                    You haven't created any course.
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
        {isLoading && (
          <div className="flex justify-center items-center py-3">
            <RingLoader
              size={40}
              aria-label="Loading Spinner"
              data-testid="loader"
              color="#0000ff"
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default YourCoursePage;
