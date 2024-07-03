"use server";
import Account from "../models/account.model";
import connectDB from "../mongoose";

interface AccountParams {
  id: string;
  email: string;
  // created_at: number;
  avatar: string;
  name: string;
}

export const upsertAccount = async ({
  id,
  email,
  // created_at,
  avatar,
  name,
}: AccountParams) => {
  try {
    await connectDB();
    const account = await Account.findOne({ email });

    if (!account) {
      const createdAccount = new Account({
        id,
        email,
        name,
        avatar,
      });
      await createdAccount.save();
    } else {
      await Account.updateOne({ email }, { name, avatar });
    }

    console.log("UpSerted account successfully");
  } catch (error: any) {
    throw new Error("Error at upsertAccount: ", error.message);
  }
};

export async function getAllAccount() {
  try {
    // await connectDB();
    // const account = await Account.findOne({ email: "asds" });
    // if (!account) {
    //   const createdAccount = new Account({
    //     email: "asds",
    //     name: "Shad man",
    //     avatar: "abc.jpg",
    //   });
    //   await createdAccount.save();
    // } else {
    //   await Account.updateOne(
    //     { email: "asds" },
    //     { name: "T-90", avatar: "abc.jpg" }
    //   );
    // }
    // console.log("Account upSerted");
    // return JSON.stringify([]);
    // return JSON.stringify(accounts);
  } catch (error: any) {
    throw new Error("Error at getAllAccount: ", error.message);
  }
}

export async function getAccountById(id: string) {
  try {
    await connectDB();
    const account = await Account.findById(id)
      .populate("courses")
      .populate("lessons_progress");
    return JSON.stringify(account);
  } catch (error: any) {
    throw new Error("Error at getAccountById: ", error.message);
  }
}
