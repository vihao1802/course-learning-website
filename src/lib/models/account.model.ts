import { randomUUID } from "crypto";
import { Schema, models, model } from "mongoose";

const AccountSchema = new Schema(
  {
    id: {
      type: String,
      // default: randomUUID,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
    avatar: String,
    oauth_tokes: [
      {
        type: Schema.Types.ObjectId,
        ref: "OAuthToken",
      },
    ],
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    purchases: [
      {
        type: Schema.Types.ObjectId,
        ref: "Purchase",
      },
    ],
    lessons_progress: [
      {
        type: Schema.Types.ObjectId,
        ref: "LessonProgress",
      },
    ],
  },
  { collection: "Account" }
);

// check if the model is exist, if not, create a new model with schema
const Account = models.Account || model("Account", AccountSchema);

export default Account;
