"use server";

import Account from "../models/account.model";
import Course from "../models/course.model";
import Lesson from "../models/lesson.model";
import Video from "../models/video.model";
import connectDB from "../mongoose";
import { v4 as uuid } from "uuid";

interface Param {
  lessonId: string;
  courseId: string;
  title: string;
  isPublished: boolean;
}

export const UpsertLesson = async ({
  lessonId,
  courseId,
  title,
  isPublished,
}: Param) => {
  try {
    await connectDB();

    const course = await Course.findOne({ id: courseId });

    if (!course) throw new Error("Course not found");
    const count = await Lesson.countDocuments({
      course_id: course._id,
    });

    // upsert lesson
    const newLesson = await Lesson.findOneAndUpdate(
      { id: lessonId },
      {
        id: lessonId === "" ? uuid() : lessonId,
        title,
        isPublished,
        position: count + 1,
        course_id: course._id,
        created_at: new Date(),
      },
      { upsert: true, new: true }
    );
    // return JSON.stringify(newLesson);
    // push lesson to course

    /* await UpsertVideo({
      lessonId,
      videoUrl: "",
      duration: 0,
    }); */
    const newVideo = await Video.create({
      id: uuid(),
      videoUrl: "",
      duration: 0,
      lesson_id: newLesson._id,
    });

    // set video id in lesson
    await Lesson.findByIdAndUpdate(newLesson._id, {
      $set: { video: newVideo._id },
    });

    await Course.findByIdAndUpdate(course._id, {
      $push: { lessons: newLesson._id },
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const UpdatePositionLesson = async (lessons: string) => {
  try {
    await connectDB();

    // update position lessons
    const bulkOps = JSON.parse(lessons).map((lesson: any, index: number) => ({
      updateOne: {
        filter: { id: lesson.id },
        update: { position: lesson.position },
      },
    }));

    await Lesson.bulkWrite(bulkOps);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const GetAllLessonByCourseId = async (course_id: string) => {
  try {
    await connectDB();
    const course = await Course.findOne({ id: course_id });

    if (!course) throw new Error("Course not found");

    const lessons = await Lesson.find({ course_id: course._id })
      .populate("video")
      .sort({
        position: 1,
      });

    return JSON.stringify(lessons);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const GetAllLessonsByCourseId = async ({
  course_id,
  account_id,
}: {
  course_id: string;
  account_id: string;
}) => {
  try {
    await connectDB();
    const course = await Course.findOne({ id: course_id });
    if (!course) throw new Error("Course not found");

    const account = await Account.findOne({ id: account_id });

    const lessons = await Lesson.find({ course_id: course._id })
      .populate("video")
      .populate({
        path: "lessons_progress",
        match: { account_id: account._id },
      })
      .sort({
        position: 1,
      });

    const filteredLessons = lessons.map((lesson) => {
      const lessons_progress = lesson.lessons_progress.filter(
        (item: any) => item.account_id.toString() === account._id.toString()
      );

      return {
        ...lesson.toObject(),
        lessons_progress,
      };
    });

    return JSON.stringify(filteredLessons);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const GetLessonById = async (lesson_id: string) => {
  try {
    await connectDB();
    let lesson = await Lesson.findOne({ id: lesson_id })
      .populate("video")
      .populate("lessons_progress");

    if (!lesson) throw new Error("Lesson not found");

    return JSON.stringify(lesson);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const GetLessonByAccountIdAndLessonId = async ({
  accountId,
  lessonId,
}: {
  accountId: string;
  lessonId: string;
}) => {
  try {
    await connectDB();
    const account = await Account.findOne({ id: accountId });
    if (!account) throw new Error("Account not found");

    const lesson = await Lesson.findOne({ id: lessonId })
      .populate("video")
      .populate("lessons_progress");
    if (!lesson) throw new Error("Lesson not found");

    const filteredLessonProgress = lesson.lessons_progress.filter(
      (item: any) => item.account_id.toString() === account._id.toString()
    );

    const filteredLessons = {
      ...lesson.toObject(),
      lessons_progress: filteredLessonProgress,
    };

    // console.log({ filteredLessons, lesson });

    return JSON.stringify(filteredLessons);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const GetLessonIdsByCourseId = async (course_id: string) => {
  try {
    await connectDB();
    const course = await Course.findOne({ id: course_id });

    if (!course) throw new Error("Course not found");

    const lessons = await Lesson.find({ course_id: course._id })
      .select("id")
      .lean();

    // return JSON.stringify(lessons);
    return JSON.stringify(lessons.map((lesson) => lesson.id));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const UpdateTitleLesson = async (lesson_id: string, title: string) => {
  try {
    await connectDB();
    if (!lesson_id) throw new Error("Lesson_id not found");
    await Lesson.findOneAndUpdate({ id: lesson_id }, { title });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const UpdateVideoLesson = async (
  lesson_id: string,
  videoUrl: string
) => {
  try {
    await connectDB();
    if (!lesson_id) throw new Error("Lesson_id not found");
    await Lesson.findOneAndUpdate({ id: lesson_id }, { videoUrl });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
