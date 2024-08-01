"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { storage } from "@/lib/firebaseStorage";

import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import { Badge } from "./ui/badge";
import { v4 as uuidv4 } from "uuid";
import ProgressBar from "./ProgressBar";
import { CreateCourse } from "@/lib/actions/course.action";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// from validation schema
const formSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(10, { message: "Minimum 10 characters." })
    .max(50, { message: "Maximum 50 characters." }),
  poster: z.string().url(),
  description: z.string().optional(),
  price: z.number().min(0, { message: "Minimum price is 0." }),
});

const FormCreateCourse = () => {
  const router = useRouter();
  const { user } = useUser();
  // if (user) console.log(user.id);

  // store image file has been chosen from input
  const [filePoster, setFilePoster] = useState<File | null>(null);

  // store progress
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progress, setProgress] = useState(0);

  // init useForm value default with condition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: uuidv4(),
      title: "",
      description: "",
      poster: "",
      price: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // ✅ This will be type-safe and validated.
    if (!user) return alert("Please sign in to create course");
    if (filePoster) {
      // Reference to the storage location(folder name: course-images) for the image
      const storageRef = ref(storage, `course-images/${values.id}`);

      // Create an upload task for the selected image
      const uploadTask = uploadBytesResumable(storageRef, filePoster);

      setShowProgressBar(true);
      // Event listener for tracking the upload file progress
      uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
          //Progress function (optional)
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          // handle error
          console.log(error.message);
        },
        async () => {
          // get url image after uploaded
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // call function create course to db
          try {
            await CreateCourse({
              id: values.id,
              title: values.title,
              description: values.description || "",
              price: values.price,
              poster: downloadURL,
              instructor_id: user.id,
            });
            console.log("Upload completed");
            router.push(`/course/edit/${values.id}`);
          } catch (error) {
            alert("Couldn't connect to database");
          } finally {
            setShowProgressBar(false);
            setProgress(0);
          }
        }
      );
    } else return alert("Please choose a file before create");
  };

  const handleChangePoster = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void // change value of field in formSchema
  ) => {
    // e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // check if file is type image
      if (!file.type.includes("image")) return;

      // set file image to filePoster
      setFilePoster(file);

      // init FileReader for converting image
      const reader = new FileReader();

      // when in status onload, we will get the string
      reader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      // function will read this file content and status will on load
      // readAsDataURL return base64 data url
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* // Input file */}
        <FormField
          control={form.control}
          name="poster"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Poster
                <div className="aspect-video bg-gray-200 rounded-lg">
                  {field.value ? (
                    <div className="w-full h-full relative ">
                      <Image
                        src={field.value}
                        alt="Poster"
                        fill
                        sizes=""
                        className="rounded-md object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-full flex justify-center items-center ">
                      <Image
                        src={"/icons/image-gallery.png"}
                        alt="Poster"
                        priority
                        width={100}
                        height={100}
                      />
                    </div>
                  )}
                </div>
                {showProgressBar && <ProgressBar value={progress} />}
              </FormLabel>
              <FormControl>
                <Input
                  disabled={showProgressBar}
                  type="file"
                  accept="image/*"
                  placeholder="Add course's poster"
                  className="px-1 py-0 h-8 rounded-sm"
                  onChange={(e) => handleChangePoster(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* // Input Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  disabled={showProgressBar}
                  placeholder="Ex: Python Course"
                  {...field}
                  className="px-1 py-0 h-8 rounded-sm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* // Input Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  disabled={showProgressBar}
                  placeholder="Ex: Python Course's Description"
                  maxLength={500}
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pricing */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex flex-row items-center gap-2">
                <div className="flex flex-row items-center gap-2">
                  This course will be
                  {field.value === 0 ? (
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
                </div>
              </FormLabel>
              <div className="flex flex-row items-center gap-3">
                <span>Price:</span>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    disabled={showProgressBar}
                    placeholder="If you want the course is free, you can skip this"
                    className="px-1 py-0 h-8 rounded-sm w-[10%] text-right"
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : parseFloat(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <span>$</span>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* // Submit button */}
        <Button
          type="submit"
          className="w-full bg-slate-600 hover:bg-slate-800"
          disabled={showProgressBar}
        >
          {showProgressBar ? "Saving..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
};

export default FormCreateCourse;
