import React from "react";
import Image from "next/image";
import TextFormatDuration from "../TextFormatDuration";
import { formatDate } from "@/lib/utils";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const RowTable = ({ index, course }: { index: number; course: any }) => {
  const router = useRouter();
  return (
    <tr key={course.id} className="relative rounded-md ">
      <td className="p-4 text-center">{index + 1}</td>
      <td className="p-4 overflow-auto w-[180px]">
        <div className="relative aspect-[22/13]">
          <Image
            src={course.poster}
            alt="Poster"
            fill
            sizes="(max-width: 180px) 100vw"
            priority
            className="rounded-md object-cover"
          />
        </div>
      </td>
      <td className="p-4 w-[220px] max-w-[220px] truncate">{course.title}</td>

      <td className="p-4">{formatDate(course.created_at)}</td>
      <td className="p-4">
        <div>
          <TextFormatDuration courseId={course.id} />
        </div>
      </td>
      <td className="p-4 text-center">{course.lessons.length}</td>
      <td className="p-4 text-center">
        {course.price === 0 ? (
          <Badge
            variant={"secondary"}
            className="text-sm bg-green-500 text-white px-3 hover:bg-green-500"
          >
            Free
          </Badge>
        ) : (
          <Badge
            variant={"secondary"}
            className="text-sm bg-yellow-500 text-white px-3  hover:bg-yellow-500"
          >
            Pricing
          </Badge>
        )}
      </td>
      <td>
        <DropdownMenu>
          <DropdownMenuTrigger className="border-none outline-none m-auto">
            <Image
              src={"/icons/menu-dots-vertical.png"}
              alt="icon"
              height={24}
              width={24}
              className="ml-auto cursor-pointer hover:bg-gray-200 rounded-sm"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push(`/course/edit/${course.id}`)}
            >
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

export default RowTable;
