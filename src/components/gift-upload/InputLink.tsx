"use client";

import { Input } from "../ui/input";
import { InputLinkProps } from "@/types/components/types";

const InputLink = ({ value = "", onChange }: InputLinkProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-[5px]">
        <p className="text-[15px]">선물 링크를 메모해보세요.</p>
        <p className="text-xs text-gray-400">
          선물 링크는 상대방에게 공개되지 않습니다.
        </p>
      </div>
      <Input
        placeholder="링크 추가"
        value={value}
        onChange={handleChange}
        className="shadow-none"
      />
    </div>
  );
};

export default InputLink;
