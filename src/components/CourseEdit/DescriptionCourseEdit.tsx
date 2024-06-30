import { Pencil } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { UpdateDescriptionCourse } from "@/lib/actions/course.action";
import toast from "react-hot-toast";

interface TitleCourseProps {
  courseId: string;
  courseDescription: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }),
});

const DescriptionCourseEdit = ({
  courseId,
  courseDescription,
}: TitleCourseProps) => {
  const [isEditing, setEditing] = useState(false);
  const [descriptionState, setDescriptionState] = useState(courseDescription);
  const toggleEdit = () => setEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: courseDescription,
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const router = useRouter();

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await UpdateDescriptionCourse(courseId, value.description);
      toast.success("Description updated");
      setDescriptionState(value.description);
      toggleEdit();
      // refresh();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-slate-200 p-4 rounded-md">
      <div className="flex flex-row justify-between items-center font-bold">
        <p>Course description</p>
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
      {!isEditing && <p className="mt-3">{descriptionState}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 text-right"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      maxLength={500}
                      rows={3}
                      className="mt-3 resize-none"
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

export default DescriptionCourseEdit;
