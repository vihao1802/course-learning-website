import mongoose from "mongoose";
import connectDB from "../mongoose";
import { upsertAccount, getAccountById } from "./account.action";

describe("Account Action", () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
  it("should upsert account", async () => {
    const account = {
      id: "1",
      email: "abc@gmail.com",
      name: "Shad",
      avatar: "abc.jpg",
    };
    const result = JSON.parse(await upsertAccount(account));
    expect(result).toBeDefined();
  });
  it("Should get account by id", async () => {
    const id = new mongoose.Types.ObjectId("66782759bbae04e4a97dc23a");
    const result = JSON.parse(await getAccountById(id.toString()));
    expect(result).toBeDefined();
  });
});
