import { storage } from "@/lib/firebaseStorage";

import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";

interface UploadFileProps {
  id: string;
  filePoster: File;
  setProgress: (value: number) => void;
}

export const uploadFile = async ({
  id,
  filePoster,
  setProgress,
}: UploadFileProps) => {
  return new Promise((resolve, reject) => {
    // Reference to the storage location(folder name: course-images) for the image
    const storageRef = ref(storage, `course-images/${id}`);

    // Create an upload task for the selected image
    const uploadTask = uploadBytesResumable(storageRef, filePoster);

    // setShowProgressBar(true);
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
        // console.log(error.message);
        reject(new Error("Failed to upload file"));
        // return null;
      },
      async () => {
        // get url image after uploaded

        // call function create course to db
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Upload completed");
          console.log(downloadURL);

          resolve(downloadURL);
          //   return downloadURL;
          //   await CreateCourse({
          //     id: values.id,
          //     title: values.title,
          //     description: values.description || "",
          //     price: values.price,
          //     poster: downloadURL,
          //     instructor_id: user.id,
          //   });
          //   router.push(`/course/edit/${values.id}`);
        } catch (error: any) {
          //   return null;
          reject(new Error("Failed to get download URL"));
        } finally {
          setProgress(0);
        }
        // finally {
        //   setShowProgressBar(false);
        //   setProgress(0);
        // }
      }
    );
  });
};
