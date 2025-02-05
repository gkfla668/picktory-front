"use client";

import { Fragment } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import { deliveryCharacterData } from "@/data/deliveryCharacterData";

import { Button } from "@/components/ui/button";

interface Step2Props {
  onNextStep: (selectedCharacter: string) => void;
  onPrevStep: () => void;
}

const Step2 = ({ onNextStep, onPrevStep }: Step2Props) => {
  const searchParams = useSearchParams();
  const character = searchParams ? searchParams.get("character") : null;

  return (
    <div className="h-full w-full flex flex-col items-center justify-between gap-7 pt-[42px]">
      <section className="flex flex-col items-center">
        <div className="flex flex-col items-center">
          <div className="mb-[3px] ">
            <p className="font-nanum text-[12px] font-bold">
              {deliveryCharacterData[character || "포리"].bubbleText}
            </p>
          </div>
          <Image
            src={deliveryCharacterData[character || "포리"].imageSrc}
            alt="delivery"
            width={200}
            height={200}
            style={{ width: "200px", height: "200px" }}
            className="mb-[22px]"
          />
          <div className="mb-7">
            <p className="text-gray-400 font-bold font-nanum">
              {deliveryCharacterData[character || "포리"].jobTitle}
            </p>
            <h1 className="text-gray-800 text-center text-[24px] font-bold font-nanum">
              {character || "포리"}
            </h1>
          </div>
          <div>
            <p className="text-[12px] text-gray-700 font-medium text-center">
              {deliveryCharacterData[character || "포리"].description
                .split("\n")
                .map((line, index) => (
                  <Fragment key={index}>
                    {line}
                    <br />
                  </Fragment>
                ))}
            </p>
          </div>
        </div>
      </section>

      {/* Button Section */}
      <section className="flex gap-2 w-full absolute bottom-4 mx-4">
        <Button
          onClick={onPrevStep}
          size="lg"
          className="bg-gray-100 text-gray-600 ml-4"
        >
          다시 선택하기
        </Button>
        <Button
          onClick={() => onNextStep(character || "포리")}
          size="lg"
          className="mr-4"
        >
          선택 완료하기
        </Button>
      </section>
    </div>
  );
};

export default Step2;
