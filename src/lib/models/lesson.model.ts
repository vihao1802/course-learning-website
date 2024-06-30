import { model, models, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const LessonSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      default: uuidv4(),
    },
    title: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    course_id: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    lessons_progress: [
      {
        type: Schema.Types.ObjectId,
        ref: "LessonProgress",
      },
    ],
  },
  { collection: "Lesson" }
);

const Lesson = models.Lesson || model("Lesson", LessonSchema);

export default Lesson;
