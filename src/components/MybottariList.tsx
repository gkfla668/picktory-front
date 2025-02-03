"use client";

import { useRouter } from "next/navigation";

import Card from "@/components/Card";

interface MyBottariListProps {
  bottariData: string[];
}

const MyBottariList = ({ bottariData }: MyBottariListProps) => {
  const router = useRouter();

  const handleCardClick = (index: number) => {
    router.push(`/my-bottari?index=${index}`);
  };

  return (
    <div className="flex gap-4 whitespace-nowrap">
      {Array.from({ length: bottariData.length }, (_, index) => (
        <Card
          key={index}
          size={"medium"}
          img={bottariData[index % bottariData.length]}
          onClick={() => handleCardClick(index)}
        />
      ))}
    </div>
  );
};

export default MyBottariList;
