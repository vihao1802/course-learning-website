import { getAccountById } from "@/lib/actions/account.action";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IAccount } from "../../types";
import { Skeleton } from "./ui/skeleton";

const TextAccountName = ({ accountId }: { accountId: string }) => {
  const [account, setAccount] = useState<IAccount | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = JSON.parse(await getAccountById(accountId));
        if (data) setAccount(data);
      } catch (error) {
        toast.error("Something went wrong in TextAccountName");
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      {account ? (
        <div>{account.name}</div>
      ) : (
        <Skeleton className="w-16 h-6 bg-gray-400" />
      )}
    </div>
  );
};

export default TextAccountName;
