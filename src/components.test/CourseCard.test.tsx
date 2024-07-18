import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CourseCard from "@/components/CourseCard";
import connectDB from "@/lib/mongoose";
import mongoose from "mongoose";
import { IAccount, ICourse, ILesson } from "../../types";

const mockInstructor: IAccount = {
  _id: "456",
  id: "2",
  name: "John Doe",
  email: "john.doe@example.com",
  created_at: new Date("2024-01-01T00:00:00.000+00:00"),
  avatar: "/path/to/avatar.jpg",
  oauth_tokes: ["token1", "token2"],
  courses: [],
  purchases: [],
  lessons_progress: [],
};

const mockLesson: ILesson = {
  _id: "789",
  id: "3",
  title: "Sample Lesson",
  created_at: new Date("2024-07-01T01:00:00.000+00:00"),
  position: 1,
  isPublished: true,
  video: {
    id: "101112",
    videoUrl: "/path/to/video.mp4",
    duration: 1200,
  },
  course_id: "1",
  lessons_progress: [],
};

const mockCourse: ICourse = {
  _id: "123",
  id: "1",
  title: "Sample Course",
  description: "This is a sample course description.",
  price: 0,
  created_at: new Date("2024-07-01T00:38:47.471+00:00"),
  poster: "/path/to/poster.jpg",
  isPublished: true,
  instructor_id: mockInstructor,
  lessons: [mockLesson],
};

describe("CourseCard", () => {
  /* beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  }); */
  it("renders course details correctly", () => {
    render(<CourseCard course={mockCourse} />);

    expect(screen.getByText("July 1, 2024")).toBeInTheDocument();
    expect(screen.getByText("Sample Course")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("displays the course poster", () => {
    render(<CourseCard course={mockCourse} />);
    expect(screen.getByAltText("Banner")).toBeInTheDocument();
  });

  it("links to the correct course detail page", () => {
    render(<CourseCard course={mockCourse} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/course/detail/1");
  });
});
