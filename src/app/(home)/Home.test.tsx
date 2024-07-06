import { getByAltText, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./page";
import connectDB from "@/lib/mongoose";
import mongoose from "mongoose";

describe("HomeLayout", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("Should have All course text", () => {
    const { getByText } = render(<Home />);

    expect(getByText("All course")).toBeInTheDocument();
  });

  it("Should have Image Icon search-outline", () => {
    render(<Home />);

    const iconImage = screen.getByAltText("Icon Search");
    expect(iconImage).toHaveAttribute("src", "/icons/search-outline.svg");
  });
});
