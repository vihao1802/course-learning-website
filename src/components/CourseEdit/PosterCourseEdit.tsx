import { Pencil } from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import {
  UploadTaskSnapshot,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/lib/firebaseStorage";
import { UpdatePosterCourse } from "@/lib/actions/course.action";
import ProgressBar from "../ProgressBar";
import { cn } from "@/lib/utils";

interface PosterCourseEditProps {
  courseId: string;
  coursePosterUrl: string;
}

const formSchema = z.object({
  poster: z.string().url("Please select an image"),
});

const PosterCourseEdit = ({
  courseId,
  coursePosterUrl,
}: PosterCourseEditProps) => {
  const [isEditing, setEditing] = useState(false);
  const [filePoster, setFilePoster] = useState<File | null>(null);
  const [posterUrl, setPosterUrl] = useState(coursePosterUrl);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progress, setProgress] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      poster: "",
    },
  });

  const toggleEdit = () => {
    form.reset({ poster: "" });
    setEditing((current) => !current);
  };

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (filePoster) {
      // Reference to the storage location(folder name: course-images) for the image
      const storageRef = ref(storage, `course-images/${courseId}`);

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
        (error: any) => {
          // handle error
          console.log(error.message);
        },
        async () => {
          // get url image after uploaded
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // call function create course to db
          try {
            console.log("Upload completed");
            await UpdatePosterCourse(courseId, downloadURL);
            toast.success("File uploaded");
            setPosterUrl(downloadURL);
            toggleEdit();
          } catch (error) {
            toast.error("Couldn't connect to database");
          } finally {
            setShowProgressBar(false);
            setProgress(0);
          }
        }
      );
    } else return toast.error("Please choose a file before create");
  };

  const handleChangePoster = (
    e: ChangeEvent<HTMLInputElement>,
    changeField: (value: string) => void
  ) => {
    if (!e.target.files) return toast.error("Please select file");
    const file = e.target.files[0];

    if (file && file.type && !file.type.includes("image"))
      return toast.error("Please image file");
    const reader = new FileReader();
    setFilePoster(file);
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64String = reader.result?.toString() || "";
      changeField(base64String);
    };

    reader.onerror = () => {
      console.log(reader.error);
    };
  };

  return (
    <div className="bg-slate-200 p-4 rounded-md">
      <div className="flex flex-row justify-between items-center font-bold">
        <p>Course poster</p>
        <div
          className={cn("flex flex-row items-center gap-2 cursor-pointer", {
            hidden: showProgressBar,
          })}
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
      {!isEditing && (
        <div className="mt-3 w-full h-full relative aspect-video">
          <Image
            src={posterUrl}
            alt="Poster"
            priority
            fill
            sizes="(max-width: 600px) 100vw"
            className="rounded-md object-cover"
          />
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 text-right"
          >
            <FormField
              control={form.control}
              name="poster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="h-auto">
                    {field.value ? (
                      <div className="h-auto max-h-[350px] mt-3 rounded-md bg-white">
                        <div className="relative aspect-video">
                          <Image
                            src={field.value}
                            alt="Poster"
                            priority
                            fill
                            loading="lazy"
                            sizes="(max-width: 600px)100vw"
                            className="rounded-md object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="h-[350px] mt-3 rounded-md bg-white flex justify-center items-center ">
                        <Image
                          src={"/icons/image-gallery.png"}
                          alt="Poster"
                          priority
                          width={100}
                          height={100}
                        />
                      </div>
                    )}
                    {showProgressBar && <ProgressBar value={progress} />}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      disabled={showProgressBar}
                      placeholder="Add course's poster"
                      className="px-1 py-0 h-8 rounded-sm "
                      onChange={(e) => handleChangePoster(e, field.onChange)}
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
                disabled={showProgressBar}
              >
                {showProgressBar ? "Saving..." : "Save"}
              </Button>
            )}
          </form>
        </Form>
      )}
    </div>
  );
};

export default PosterCourseEdit;
