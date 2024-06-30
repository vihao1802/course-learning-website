"use server";

import Course from "../models/course.model";
import Lesson from "../models/lesson.model";
import Video from "../models/video.model";
import connectDB from "../mongoose";
import { v4 as uuid } from "uuid";

interface Param {
  lessonId: string;
  videoUrl: string;
  duration: number;
}

export const UpsertVideo = async ({ videoUrl, lessonId, duration }: Param) => {
  try {
    await connectDB();
    const lesson = await Lesson.findOne({ id: lessonId });

    const existingVideo = await Video.findOne({ lesson_id: lesson._id });

    const videoData: {
      id?: string;
      videoUrl: string;
      duration: number;
      lesson_id: string;
    } = {
      videoUrl,
      duration,
      lesson_id: lesson._id,
    };

    if (!existingVideo) {
      videoData.id = uuid();
    }

    // upsert video
    const newVideo = await Video.findOneAndUpdate(
      { lesson_id: lesson._id },
      videoData,
      { upsert: true, new: true }
    );

    // set video id in lesson
    await Lesson.findByIdAndUpdate(newVideo._id, {
      $set: { video: newVideo._id },
    });

    // return JSON.stringify(newVideo);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const GetVideoByLessonId = async (lessonId: string) => {
  try {
    await connectDB();
    return JSON.stringify(await Video.findOne({ lesson_id: lessonId }));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const GetTotalDurationByCourseId = async (courseId: string) => {
  try {
    await connectDB();
    const course = await Course.findOne({ id: courseId });
    const lessons = await Lesson.find({ course_id: course._id }).populate(
      "video"
    );
    console.log({ lessons, courseId });

    const updatedLessons = await Promise.all(
      lessons.map(async (lesson) => {
        const video = await Video.findOne({ lesson_id: lesson._id });
        return video ? video.duration : 0;
      })
    );
    console.log({ updatedLessons });

    const total = updatedLessons.reduce(
      (acc: number, cur: number) => acc + cur,
      0
    );
    console.log({ total });

    return JSON.stringify(total);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
