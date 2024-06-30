import { Schema, models, model } from "mongoose";

const courseSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    poster: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false,
    },
    price: {
      type: Number,
      required: true,
    },
    instructor_id: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    purchases: [
      {
        type: Schema.Types.ObjectId,
        ref: "Purchase",
      },
    ],
  },
  { collection: "Course" }
);

const Course = models.Course || model("Course", courseSchema);

export default Course;
