"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil, PlusCircle, Rabbit } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import {
  GetAllLessonByCourseId,
  UpdatePositionLesson,
  UpsertLesson,
} from "@/lib/actions/lesson.action";
import { useRouter } from "next/navigation";
import { SkewLoader } from "react-spinners";

interface Lesson {
  id: string;
  title: string;
  created_at: Date;
  isPublished: Boolean;
  position: number;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const LessonCourseEdit = ({ courseId }: { courseId: string }) => {
  const [lessons, setLessons] = useState<Lesson[] | []>([]);
  const [isLoading, setLoading] = useState(true);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await GetAllLessonByCourseId(courseId);
        setLessons(JSON.parse(res));
      } catch (error: any) {
        toast.error("Something went wrong with fetchData");
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshFlag]);

  // add lesson form
  const [isEditing, setEditing] = useState(false);
  const toggleEdit = () => setEditing((current) => !current);
  // create form validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  // submit form
  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await UpsertLesson({
        lessonId: "",
        courseId,
        title: value.title,
        isPublished: false,
      });

      setRefreshFlag((cur) => !cur);
      form.setValue("title", "");
      toast.success("Lesson added");
      toggleEdit();
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const { isSubmitting } = form.formState;

  // drag and drop lesson
  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    // source: the item picked
    // destination: the item which is the destination we drag to (drag end)

    // If the item is dropped outside of a droppable area
    if (!destination) return;

    // If the item is dropped in the same place it was picked up from
    if (source.index === destination.index) return;

    setLoading(true);

    // make copy of lessons array
    const updatedLessons = lessons;

    // get 1 lesson from array by slice()
    const [reorderedLesson] = updatedLessons.splice(source.index, 1);

    // Insert item at destination
    updatedLessons.splice(destination.index, 0, reorderedLesson);

    // Update local state with new positions
    const newLessons = updatedLessons.map((lesson, index) => ({
      ...lesson,
      position: index + 1,
    }));

    // update the origin lessons array
    setLessons(updatedLessons);

    // Log the new indices of all items
    // console.log("Updated Lesson Indices:");
    /* newLessons.forEach((lesson) => {
      console.log(`Lesson ID: ${lesson.id}, New Position: ${lesson.position}`);
    }); */

    try {
      // update lessons array in database
      await UpdatePositionLesson(JSON.stringify(newLessons));

      toast.success("Lesson positions updated");
    } catch (error: any) {
      console.error(error.message);
      toast.error("Failed to update lesson positions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-200 p-4 rounded-md">
      {isLoading ? (
        <div className="flex justify-center py-4">
          <SkewLoader />
        </div>
      ) : (
        <>
          <div className="flex flex-row justify-between items-center font-bold">
            <p>Course lessons</p>
            <div
              className="flex flex-row items-center gap-2 cursor-pointer"
              onClick={toggleEdit}
            >
              {isEditing ? (
                <p>Cancel</p>
              ) : (
                <>
                  <PlusCircle width={18} height={18} />
                  <p>Add a lesson</p>
                </>
              )}
            </div>
          </div>
          {isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 text-right"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          type="text"
                          className="mt-3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-left" />
                    </FormItem>
                  )}
                />
                {isEditing && (
                  <Button
                    type="submit"
                    className=" bg-slate-600 hover:bg-slate-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                )}
              </form>
            </Form>
          )}
          {!isEditing && lessons.length === 0 && (
            <>
              <Rabbit
                width={70}
                height={70}
                className="text-center mx-auto mt-5"
              />
              <p className="text-center text-xl font-bold">No lesson found</p>
            </>
          )}
          {!isEditing && lessons.length > 0 && (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="lessons">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {lessons.map((lesson, index) => (
                      <Draggable
                        key={lesson.id}
                        draggableId={lesson.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-4 border rounded-lg text-sm mt-3 px-3 py-3 bg-blue-100"
                          >
                            <div
                              className="border-r hover:bg-muted rounded-l-md transition cursor-grab"
                              {...provided.dragHandleProps}
                            >
                              <Grip className="text-blue-700" />
                            </div>
                            <div className="grid grid-cols-10 w-full items-center">
                              <p className="col-span-9 text-blue-500 text-base line-clamp-1 ">
                                {/* {lesson.position}.  */}
                                {lesson.title}
                              </p>
                              <Pencil
                                className="col-span-1 text-blue-500 ml-auto cursor-pointer"
                                width={20}
                                height={20}
                                onClick={() =>
                                  router.push(
                                    `/course/edit/${courseId}/lesson/${lesson.id}`
                                  )
                                }
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </>
      )}
    </div>
  );
};

export default LessonCourseEdit;
