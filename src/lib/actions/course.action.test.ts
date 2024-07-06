import mongoose from "mongoose";
import connectDB from "../mongoose";
import {
  GetCourseById,
  GetAllCourses,
  GetCoursesByAccountId,
  GetCoursesTeachingByAccountId,
} from "./course.action";

describe("Course Action", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("Should get course by id", async () => {
    const id = new mongoose.Types.ObjectId("6681fa878326a78abf61487c");
    const result = JSON.parse(await GetCourseById(id.toString()));
    expect(result).toBeDefined();
  });
  it("Should get all courses", async () => {
    const result = JSON.parse(await GetAllCourses());
    expect(result).toBeDefined();
  });
  it("Should get courses by account id", async () => {
    const id = "user_2iHbOgc1lBZ4p7UY1KiYQZO9gk5";
    const result = JSON.parse(await GetCoursesByAccountId(id));
    expect(result).toBeDefined();
  });
  it("Should get courses teaching by account id", async () => {
    const id = "user_2iHbOgc1lBZ4p7UY1KiYQZO9gk5";
    const result = JSON.parse(await GetCoursesTeachingByAccountId(id));
    expect(result).toBeDefined();
  });
});
