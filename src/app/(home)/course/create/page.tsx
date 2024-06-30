"use client";
import FormCreateCourse from "@/components/FormCreateCourse";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CourseCreatePage() {
  const router = useRouter();
  return (
    <main className="max-w-[1000px] w-full mx-auto h-auto p-6">
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
        <h1 className="text-2xl font-bold mb-2">Create course</h1>
        <p className="text-gray-600">Build your courses and lessons</p>
      </div>
      <FormCreateCourse />
    </main>
  );
}
