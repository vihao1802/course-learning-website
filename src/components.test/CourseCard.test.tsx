import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CourseCard from "@/components/CourseCard";
import connectDB from "@/lib/mongoose";
import mongoose from "mongoose";

const mockCourse = {
  id: "1",
  title: "Sample Course",
  description: "This is a sample course description.",
  price: 0,
  created_at: new Date("2024-07-01T00:38:47.471+00:00"),
  instructor_id: "instructor-1",
  poster: "/path/to/poster.jpg",
  isPublished: true,
  duration: 3600,
};

describe("CourseCard", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
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
