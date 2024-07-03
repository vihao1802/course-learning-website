"use server";
import Account from "../models/account.model";
import Course from "../models/course.model";
import connectDB from "../mongoose";
import { ICourseParams } from "../../../types";

export const CreateCourse = async ({
  id,
  title,
  description,
  price,
  instructor_id,
  poster,
}: ICourseParams) => {
  try {
    await connectDB();

    const account = await Account.findOne({ id: instructor_id });

    if (!account) throw new Error("Instructor not found");

    const createdCourse = await Course.findOneAndUpdate(
      {
        id,
      },
      {
        id,
        title,
        description,
        poster,
        price,
        instructor_id: account._id,
        created_at: new Date(),
      },
      { upsert: true, new: true }
    );

    // await createdCourse.save();
    await Account.findByIdAndUpdate(account._id, {
      $push: { courses: createdCourse._id },
    });
  } catch (error: any) {
    throw new Error("Error at CreateCourse: ", error.message);
  }
};

// get course by course id
export const GetCourseById = async (courseId: string) => {
  try {
    await connectDB();
    return JSON.stringify(
      await Course.findOne({ id: courseId }).populate("lessons")
    );
  } catch (error: any) {
    throw new Error("Error at GetCourseById: ", error.message);
  }
};

// get courses by user id
export const GetCoursesByAccountId = async (userId: string) => {
  try {
    await connectDB();
    const account = await Account.findOne({ id: userId });

    if (account === null) throw new Error("Account not found");
    return JSON.stringify(
      await Course.find({ instructor_id: account._id }).sort({ created_at: -1 })
    );
  } catch (error: any) {
    throw new Error("Error at GetCoursesById: ", error.message);
  }
};

// get courses teaching by user id
export const GetCoursesTeachingByAccountId = async (userId: string) => {
  try {
    await connectDB();
    const account = await Account.findOne({ id: userId });

    if (account === null) throw new Error("Account not found");

    //get courses
    const courses = await Course.find({ instructor_id: account._id }).sort({
      created_at: -1,
    });

    /*  return JSON.stringify(
      
    ); */
  } catch (error: any) {
    throw new Error("Error at GetCoursesById: ", error.message);
  }
};

// get all courses
export const GetAllCourses = async () => {
  try {
    await connectDB();
    return JSON.stringify(await Course.find().sort({ created_at: -1 }));
  } catch (error: any) {
    throw new Error("Error at GetAllCourses: ", error.message);
  }
};

// update title course by course id
export const UpdateTitleCourse = async (courseId: string, newTitle: string) => {
  try {
    await connectDB();
    await Course.findOneAndUpdate({ id: courseId }, { title: newTitle });
  } catch (error: any) {
    throw new Error("Error at UpdateTitleCourse: ", error.message);
  }
};

// update description course by course id
export const UpdateDescriptionCourse = async (
  courseId: string,
  newDescription: string
) => {
  try {
    await connectDB();
    await Course.findOneAndUpdate(
      { id: courseId },
      { description: newDescription }
    );
  } catch (error: any) {
    throw new Error("Error at UpdateDescriptionCourse: ", error.message);
  }
};

// update poster course by course id
export const UpdatePosterCourse = async (
  courseId: string,
  newPosterUrl: string
) => {
  try {
    await connectDB();
    await Course.findOneAndUpdate({ id: courseId }, { poster: newPosterUrl });
    // revalidatePath(`/course/edit/${courseId}`);
  } catch (error: any) {
    throw new Error("Error at UpdatePosterCourse: ", error.message);
  }
};

// update course by value and course id
export const UpdatePriceCourse = async (courseId: string, value: number) => {
  try {
    await connectDB();
    await Course.findOneAndUpdate({ id: courseId }, { price: value });
  } catch (error: any) {
    throw new Error("Error at UpdateCourse: ", error.message);
  }
};
