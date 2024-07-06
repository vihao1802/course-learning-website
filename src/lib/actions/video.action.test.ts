import mongoose from "mongoose";
import { GetVideoByLessonId, GetTotalDurationByCourseId } from "./video.action";

describe("Video Action", () => {
  it("Should get video by lesson id", async () => {
    const id = new mongoose.Types.ObjectId("6681fa978326a78abf6153f2");
    const result = JSON.parse(await GetVideoByLessonId(id.toString()));
    expect(result).toBeDefined();
  });
  it("Should get total duration by course id", async () => {
    const result = JSON.parse(
      await GetTotalDurationByCourseId("07dffd37-ce0b-456c-82e2-f41b20c11375")
    );
    expect(result).toBeDefined();
  });
});
