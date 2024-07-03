import React, { useEffect, useState } from "react";
import { ILesson } from "../../types";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import Image from "next/image";
import { GetLessonById } from "@/lib/actions/lesson.action";
import toast from "react-hot-toast";

interface Props {
  lessonId: string;
  markAsCompleted: (status: Boolean) => void;
}

const ButtonMarkAsCompleted = ({ lessonId, markAsCompleted }: Props) => {
  const [lesson, setLesson] = useState<ILesson | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = JSON.parse(await GetLessonById(lessonId));

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

  return (
    <div>
      {!lesson || isLoading ? (
        <Skeleton className=" w-44 h-10 bg-gray-400" />
      ) : lesson.lessons_progress.find((item) => item.lesson_id === lesson._id)
          ?.isCompleted ? (
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
    </div>
  );
};

export default ButtonMarkAsCompleted;
