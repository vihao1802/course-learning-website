import { Schema, model, models } from "mongoose";

const LessonSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      required: true,
    },
    lesson_id: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },
  },
  { collection: "Video" }
);

const Video = models.Video || model("Video", LessonSchema);

export default Video;
