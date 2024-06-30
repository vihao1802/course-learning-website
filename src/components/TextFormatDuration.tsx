"use client";
import { GetTotalDurationByCourseId } from "@/lib/actions/video.action";
import { formatSecond } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Skeleton } from "./ui/skeleton";

const TextFormatDuration = ({ courseId }: { courseId: string }) => {
  const [total, setTotal] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetTotalDurationByCourseId(courseId);
        if (data) setTotal(data);
      } catch (error) {
        toast.error("Something went wrong in TextFormatDuration");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {total ? (
        formatSecond(Number(total))
      ) : (
        <Skeleton className="w-20 h-5 bg-gray-400" />
      )}
    </div>
  );
};

export default TextFormatDuration;
