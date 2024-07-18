import { IAccount } from "../../types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const InstructorInfo = ({ account }: { account: IAccount }) => {
  return (
    <div>
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
    </div>
  );
};

export default InstructorInfo;
