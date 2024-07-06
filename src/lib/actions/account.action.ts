"use server";
import Account from "../models/account.model";
import Course from "../models/course.model";
import Lesson from "../models/lesson.model";
import LessonProgress from "../models/lessonProgress.model";
import connectDB from "../mongoose";

interface AccountParams {
  id: string;
  email: string;
  avatar: string;
  name: string;
}

export const upsertAccount = async ({
  id,
  email,
  avatar,
  name,
}: AccountParams) => {
  try {
    await connectDB();
    const account = await Account.findOne({ email });
    let createdAccount;
    if (!account) {
      createdAccount = new Account({
        id,
        email,
        name,
        avatar,
      });
      await createdAccount.save();
    } else {
      createdAccount = await Account.updateOne(
        { email },
        { name, avatar },
        { new: true }
      );
    }

    console.log("UpSerted account successfully");

    return JSON.stringify(createdAccount);
  } catch (error: any) {
    throw new Error("Error at upsertAccount: ", error.message);
  }
};

export async function getAccountById(id: string) {
  try {
    await connectDB();
    await Course.find({});
    await LessonProgress.find({});

    const account = await Account.findById(id)
      .populate("courses")
      .populate("lessons_progress");
    return JSON.stringify(account);
  } catch (error: any) {
    throw new Error("Error at getAccountById: " + error.message);
  }
}
