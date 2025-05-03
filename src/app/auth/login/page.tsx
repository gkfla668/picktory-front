"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import Onboarding from "@/components/common/Onboarding";
import KakaoLoginButton from "@/components/common/KakaoLoginButton";

import MainGraphic from "/public/img/login_graphic.svg";

const Page = () => {
  const REST_API_KEY = process.env.NEXT_PUBLIC_REST_API_KEY;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI;

  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;

  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
  };

  const getMotionProps = (direction: "left" | "right") => {
    const isLeft = direction === "left";
    return {
      initial: { opacity: 0, x: isLeft ? -20 : 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: isLeft ? 20 : -20 },
      transition: { duration: 0.5 },
    };
  };

  return (
    <AnimatePresence mode="wait">
      {!isOnboardingComplete ? (
        <motion.div
          key="/auth/login"
          {...getMotionProps("left")}
          className="h-full"
        >
          <Onboarding onComplete={handleOnboardingComplete} />
        </motion.div>
      ) : (
        <motion.div key="login" {...getMotionProps("right")} className="h-full">
          <div className="h-full w-full bg-pink-50">
            <p className="flex h-full items-center justify-center pb-[487px] pt-[42px] text-center font-nanum text-lg font-bold tracking-[-0.03em]">
              선물 보따리를 안전하게 보관하기 위해 <br />
              로그인이 필요해요!
            </p>
            <Image
              src={MainGraphic}
              alt="MainGraphic"
              width={430}
              style={{ height: "auto" }}
              priority
              className="absolute bottom-0"
            />
          </div>
          <div className="absolute bottom-4 w-full px-4">
            <KakaoLoginButton link={KAKAO_AUTH_URL} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Page;
