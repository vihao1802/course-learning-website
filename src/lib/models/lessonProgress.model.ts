import { Schema, model, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const lessonProgressSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      default: uuidv4(),
    },
    lesson_id: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    account_id: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "LessonProgress",
  }
);

const LessonProgress =
  models.LessonProgress || model("LessonProgress", lessonProgressSchema);

export default LessonProgress;
