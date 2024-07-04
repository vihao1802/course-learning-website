"use server";

import { ILessonProgress } from "../../../types";
import Account from "../models/account.model";
import Course from "../models/course.model";
import Lesson from "../models/lesson.model";
import LessonProgress from "../models/lessonProgress.model";

interface LessonProgressParams {
  lesson_id: string;
  account_id: string;
  isCompleted: boolean;
}

export const UpsertLessonProgress = async ({
  lesson_id,
  account_id,
  isCompleted,
}: LessonProgressParams) => {
  try {
    const account = await Account.findOne({ id: account_id });
    const lesson = await Lesson.findOne({ id: lesson_id });
    if (!account || !lesson) throw new Error("Account or Lesson not found");

    return await LessonProgress.findOneAndUpdate(
      { lesson_id: lesson._id, account_id: account._id },
      { lesson_id: lesson._id, account_id: account._id, isCompleted },
      { upsert: true, new: true }
    );
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const UpsertAllLessonsByAccountIdAndCourseId = async ({
  accountId,
  courseId,
}: {
  accountId: string;
  courseId: string;
}) => {
  try {
    const account = await Account.findOne({ id: accountId });
    if (!account) throw new Error("Account not found");

    const course = await Course.findOne({ id: courseId });
    if (!course) throw new Error("Course not found");

    const lessons = await Lesson.find({ course_id: course._id });

    console.log({ lessons });
    lessons.forEach(async (lesson) => {
      const lessonProgress = await UpsertLessonProgress({
        lesson_id: lesson.id,
        account_id: accountId,
        isCompleted: false,
      });
      console.log({ lessonProgress });

      //push lessonProgress to lesson progress
      await Lesson.findByIdAndUpdate(lessonProgress.lesson_id, {
        $push: { lessons_progress: lessonProgress._id },
      });
    });

    return JSON.stringify(lessons[0]);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const GetLessonProgressByAccountIdAndLessonId = async ({
  accountId,
  lessonId,
}: {
  accountId: string;
  lessonId: string;
}) => {
  try {
    const account = await Account.findOne({ id: accountId });
    if (!account) throw new Error("Account not found");

    const lesson = await Lesson.findOne({ id: lessonId });
    if (!lesson) throw new Error("Lesson not found");

    const lessonProgress = await LessonProgress.findOne({
      account_id: account._id,
      lesson_id: lesson._id,
    });

    return JSON.stringify(lessonProgress);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const GetLessonProgressCurrent = async ({
  accountId,
  courseId,
}: {
  accountId: string;
  courseId: string;
}) => {
  try {
    const account = await Account.findOne({ id: accountId });
    if (!account) throw new Error("Account not found");

    const course = await Course.findOne({
      id: courseId,
    });
    if (!course) throw new Error("Course not found");

    // find the first lesson that is not completed and return id of that lesson match with lessonProgress
    const lessons = await Lesson.find({ course_id: course._id })
      .sort({
        position: 1,
      })
      .populate("lessons_progress");

    let lesson = lessons.find((l) => {
      const lessonProgress = l.lessons_progress.find(
        (lp: ILessonProgress) =>
          lp.account_id.toString() === account._id.toString()
      );
      // console.log(lessonProgress);
      return !lessonProgress.isCompleted;
    });

    if (lesson === undefined) lesson = lessons[lessons.length - 1];
    console.log({ lesson });

    return JSON.stringify(lesson.id);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const UpdateStatusLessonProgress = async ({
  accountId,
  lessonId,
  status,
}: {
  accountId: string;
  lessonId: string;
  status: Boolean;
}) => {
  try {
    const account = await Account.findOne({ id: accountId });
    if (!account) throw new Error("Account not found");

    const lesson = await Lesson.findOne({ id: lessonId });
    if (!lesson) throw new Error("Lesson not found");

    const lessonProgress = await LessonProgress.findOneAndUpdate(
      { account_id: account._id, lesson_id: lesson._id },
      { isCompleted: status },
      { new: true }
    );
    return JSON.stringify(lessonProgress);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
