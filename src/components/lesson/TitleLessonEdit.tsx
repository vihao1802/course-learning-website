"use client";
import { Pencil } from "lucide-react";
import { Input } from "../ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import toast from "react-hot-toast";
import { UpdateTitleLesson } from "@/lib/actions/lesson.action";

interface TitleCourseProps {
  lessonId: string;
  lessonTitle: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const TitleLessonEdit = ({ lessonId, lessonTitle }: TitleCourseProps) => {
  const [isEditing, setEditing] = useState(false);
  const toggleEdit = () => setEditing((current) => !current);
  const [titleState, setTitleState] = useState(lessonTitle);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: lessonTitle,
    },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await UpdateTitleLesson(lessonId, value.title);
      toast.success("Title updated");
      setTitleState(value.title);
      toggleEdit();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-slate-200 p-4 rounded-md">
      <div className="flex flex-row justify-between items-center font-bold">
        <p>Lesson title</p>
        <div
          className="flex flex-row items-center gap-2 cursor-pointer"
          onClick={toggleEdit}
        >
          {isEditing ? (
            <p>Cancel</p>
          ) : (
            <>
              <Pencil width={18} height={18} />
              <p>Edit</p>
            </>
          )}
        </div>
      </div>
      {!isEditing && <p className="mt-3">{titleState}</p>}
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
    </div>
  );
};

export default TitleLessonEdit;
