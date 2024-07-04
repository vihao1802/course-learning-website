import React, { useEffect, useState } from "react";
import { IAccount } from "../../types";
import toast from "react-hot-toast";
import { getAccountById } from "@/lib/actions/account.action";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const InstructorInfo = ({ accountId }: { accountId: string }) => {
  const [account, setAccount] = useState<IAccount | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = JSON.parse(await getAccountById(accountId));
        if (data) setAccount(data);
      } catch (error) {
        toast.error("Something went wrong at InstructorInfo");
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {account ? (
        <div className="flex flex-row gap-2 items-center">
          <Avatar>
            <AvatarImage src={account.avatar} />
            <AvatarFallback className="bg-slate-500 text-white">
              {account.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <p>
            <strong>Instructor</strong>: {account.name}
          </p>
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          <Skeleton className="w-10 h-10 rounded-full bg-gray-400" />
          <Skeleton className="w-28 h-6 bg-gray-400" />
        </div>
      )}
    </div>
  );
};

export default InstructorInfo;
