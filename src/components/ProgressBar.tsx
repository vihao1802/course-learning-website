import React, { FC } from "react";

interface ProgressProps {
  value: number;
}

const ProgressBar: FC<ProgressProps> = ({ value }) => {
  return (
    <div className="h-2 bg-gray-200 rounded-md overflow-hidden">
      <div
        className="h-full bg-green-500 transition-all"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
