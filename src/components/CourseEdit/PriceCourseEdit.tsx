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
import { UpdatePriceCourse } from "@/lib/actions/course.action";
import toast from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LampFloor } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface PriceCourseProps {
  courseId: string;
  coursePrice: number;
}

const formSchema = z.object({
  price: z.number().min(0, {
    message: "Price is required",
  }),
});

const PriceCourseEdit = ({ courseId, coursePrice }: PriceCourseProps) => {
  const [isEditing, setEditing] = useState(false);
  const [priceState, setPriceState] = useState(coursePrice);
  const toggleEdit = () => setEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: coursePrice,
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      await UpdatePriceCourse(courseId, value.price);
      toast.success("Price updated ");
      setPriceState(value.price);
      toggleEdit();
      //   refresh();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-slate-200 p-4 rounded-md">
      <div className="flex flex-row justify-between items-center font-bold">
        <div className="flex flex-row items-center gap-2">
          <p>Course price</p>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant={"secondary"}
                  className={cn(
                    "hover:bg-gray-600 cursor-default bg-green-600 text-white px-3 ",
                    {
                      "bg-yellow-500": priceState !== 0,
                    }
                  )}
                >
                  {priceState === 0 ? "Free" : "Pricing"}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>$0: Course will be free </p>
                <p>$1 or Over: Course will be pricing </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
      {!isEditing && <p className="mt-3">${priceState}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 text-right"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      type="number"
                      className="mt-3"
                      min={0}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : parseFloat(e.target.value)
                        )
                      }
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

export default PriceCourseEdit;
