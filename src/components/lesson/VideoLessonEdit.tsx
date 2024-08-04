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
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import {
  UploadTaskSnapshot,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { VideoIcon, VideoOffIcon } from "lucide-react";
import { storage } from "@/lib/firebaseStorage";
import ProgressBar from "../ProgressBar";
import { UpsertVideo } from "@/lib/actions/video.action";
import { cn } from "@/lib/utils";

interface VideoLessonEditProps {
  lessonId: string;
  lessonVideoUrl: string;
}

const formSchema = z.object({
  video: z.string().url("Please select a video file"),
});

const VideoLessonEdit = ({
  lessonId,
  lessonVideoUrl,
}: VideoLessonEditProps) => {
  const [isEditing, setEditing] = useState(false);
  const [fileVideo, setFileVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState(lessonVideoUrl);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [durationVideo, setDurationVideo] = useState(0);
  const [progress, setProgress] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      video: "",
    },
  });

  const toggleEdit = () => {
    form.reset({ video: "" });
    setEditing((current) => !current);
  };

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (fileVideo) {
      // Reference to the storage location(folder name: course-video) for the video
      const storageRef = ref(storage, `course-video/${lessonId}`);

      // Create an upload task for the selected video
      const uploadTask = uploadBytesResumable(storageRef, fileVideo);

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
          // get url video after uploaded
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          // call function create course to db
          try {
            console.log("Upload completed");
            /* console.log({
              lessonId,
              videoUrl: downloadURL,
              duration: durationVideo,
            }); */

            await UpsertVideo({
              lessonId,
              videoUrl: downloadURL,
              duration: durationVideo,
            });
            toast.success("File uploaded");
            setVideoUrl(downloadURL);
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

  const handleChangeVideo = (
    e: ChangeEvent<HTMLInputElement>,
    changeField: (value: string) => void
  ) => {
    if (!e.target.files) return toast.error("Please select file");
    const file = e.target.files[0];

    if (file && file.type && !file.type.includes("video"))
      return toast.error("Please choose video file");

    const reader = new FileReader();
    setFileVideo(file);
    reader.readAsDataURL(file);

    reader.onload = () => {
      const fileContent = reader.result?.toString() || "";
      //   console.log(fileContent);

      const video = document.createElement("video");
      video.src = fileContent;

      video.onloadedmetadata = () => {
        // const duration = video.duration;
        setDurationVideo(video.duration);
        // console.log("Duration: " + duration);
      };

      changeField(fileContent);
    };

    reader.onerror = () => {
      console.log(reader.error);
    };
  };

  return (
    <div className="bg-slate-200 p-4 rounded-md">
      <div className="flex flex-row justify-between items-center font-bold">
        <p>Lesson video</p>
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
      {!isEditing &&
        (videoUrl === "" ? (
          <div className="mt-3 w-full h-full relative aspect-video flex items-center justify-center flex-col">
            <VideoOffIcon width={70} height={70} />
            <span className="text-lg font-bold">
              Haven't uploaded a video yet
            </span>
          </div>
        ) : (
          <div className="mt-3 w-full h-full relative aspect-video">
            <video
              className="w-full h-full object-cover rounded-md"
              controls
              preload="metadata"
            >
              <source src={videoUrl} type="video/mp4" />
              {/* <track
                src="/path/to/captions.vtt"
                kind="subtitles"
                srcLang="en"
                label="English"
                /> */}
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 text-right"
          >
            <FormField
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="h-auto">
                    {field.value ? (
                      <div className="h-auto max-h-[350px] mt-3 rounded-md bg-white">
                        <div className="relative aspect-video">
                          <video
                            className="w-full h-full object-cover rounded-md"
                            controls
                            preload="metadata"
                          >
                            <source src={field.value} type="video/mp4" />
                            <track
                              src="/path/to/captions.vtt"
                              kind="subtitles"
                              srcLang="en"
                              label="English"
                            />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video mt-3 rounded-md bg-white flex justify-center items-center ">
                        <VideoIcon width={70} height={70} />
                      </div>
                    )}
                    {showProgressBar && <ProgressBar value={progress} />}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="video/mp4"
                      disabled={showProgressBar}
                      placeholder="Add course's video"
                      className="px-1 py-0 h-8 rounded-sm "
                      onChange={(e) => handleChangeVideo(e, field.onChange)}
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

export default VideoLessonEdit;
