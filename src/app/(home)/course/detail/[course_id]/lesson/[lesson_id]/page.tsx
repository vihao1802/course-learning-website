"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatMinute } from "@/lib/utils";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";

const lessons = [
  {
    lesson_title: "Web Programming Introduce Web Programming Introduce",
    duration: 10,
    status: true,
  },
  {
    lesson_title: "HTML Basics and Structure",
    duration: 15,
    status: false,
  },
  {
    lesson_title: "CSS Fundamentals",
    duration: 82,
    status: true,
  },
  {
    lesson_title: "JavaScript Introduction",
    duration: 25,
    status: true,
  },
  {
    lesson_title: "Advanced JavaScript Concepts",
    duration: 30,
    status: false,
  },
  {
    lesson_title: "Responsive Web Design",
    duration: 18,
    status: true,
  },
  {
    lesson_title: "Web Accessibility",
    duration: 12,
    status: false,
  },
  {
    lesson_title: "Frontend Frameworks Overview",
    duration: 22,
    status: true,
  },
  {
    lesson_title: "Version Control with Git",
    duration: 17,
    status: true,
  },
  {
    lesson_title: "Deployment and Hosting",
    duration: 14,
    status: false,
  },
  {
    lesson_title: "Web Security Basics",
    duration: 80,
    status: true,
  },
];

const LessonPage: FC = () => {
  const params = useParams();
  const { course_id, lesson_id } = params;

  // handle progressbar video
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  let percentage = (progress / duration) * 100;

  return (
    <div className="relative h-full p-4 flex flex-row gap-2 ">
      <div className="w-3/4 flex flex-col gap-3  pr-6">
        <div className="w-full">
          <Breadcrumb>
            <BreadcrumbList className="text-xl">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/course/detail/${course_id}`}>
                  Course
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-bold text-2xl ">Web Programming Introduce</p>
          {/* <div className="flex flex-row justify-between ">
            <p>Date publish: 20/02/2014</p>
            <p>20:14</p>
          </div> */}
          {/* <img
            src="/cs502.png"
            alt="Video"
            className="h-[350px] object-contain"
          /> */}
          <VideoPlayer setPlayed={setProgress} setDuration={setDuration} />
          <div className="flex flex-row justify-between">
            <div>
              <Button className="px-2 py-1 border-2 bg-green-500  hover:bg-green-600">
                <Image
                  src={"/icons/mark_completed.png"}
                  alt="Logo Check"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Mark as Completed
              </Button>
            </div>
            <div className="flex flex-row justify-end gap-2">
              <Button className="w-[120px] py-1 border-2 text-slate-700 border-slate-700 hover:bg-gray-200">
                Previous
              </Button>
              <Button className="w-[120px] py-1 border-2 border-slate-700 bg-slate-700 hover:bg-slate-950">
                Next
              </Button>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold">Show Note (On progress...)</h2>
          </div>
        </div>
      </div>
      <div className="fixed top-[60px] pt-[16px] right-0 bottom-0 w-1/4">
        <div className="flex flex-col h-full">
          <h2 className="font-bold text-xl px-4 pb-2">Your lessons</h2>
          <div className="px-4 text-right">
            <ProgressBar value={20} />
            <span>20%</span>
          </div>
          <div className="ml-[-6px] flex flex-col overflow-y-auto ">
            {lessons.map((item, index) => (
              <div
                key={index}
                className="px-4 py-3 flex flex-row items-start cursor-pointer hover:bg-gray-100 rounded-s-md border-l-[6px] border-l-white hover:border-l-slate-700 "
              >
                <Image
                  src={
                    item.status ? "/icons/check.png" : "/icons/play-circle.svg"
                  }
                  alt="Icon play"
                  width={24}
                  height={24}
                  className="pt-1 pr-3 w-8"
                />
                <div className="flex flex-col gap-1 w-[calc(100%-32px)]">
                  <p className="text-base line-clamp-1">
                    <strong>{index + 1}.</strong>
                    {" " + item.lesson_title}
                  </p>
                  <p className="text-sm font-semibold">
                    {formatMinute(item.duration)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
