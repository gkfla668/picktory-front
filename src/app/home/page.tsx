"use client";

import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/common/Icon";
import Loading from "@/components/common/Loading";
import MyCardList from "@/components/myBundle/MyCardList";
import { Button } from "@/components/ui/button";
import { useHandleCreateBundleClick } from "@/hooks/bundle/add/useHandleCreateBundleClick";
import useResetStore from "@/hooks/useResetStore";
import { useBundlesPreviewQuery } from "@/queries/useBundlesPreviewQuery";

import MainGraphic from "/public/img/main_graphic.svg";
import ArrowRightIcon from "/public/icons/arrow_right_small.svg";

const Page = () => {
  useResetStore();
  const handleBundleCreate = useHandleCreateBundleClick();

  const { data, isLoading, isError } = useBundlesPreviewQuery();
  if (!data) return;
  const myBundles = data.result;

  return (
    <main className="flex flex-col items-center justify-center gap-10 px-4 pt-3">
      <div className="relative">
        <Image
          src={MainGraphic}
          alt="MainGraphic"
          width={430}
          style={{ height: "auto" }}
          priority
        />

        <Button
          size="lg"
          onClick={handleBundleCreate}
          className="absolute bottom-3 left-1/2 w-[calc(100%-24px)] max-w-[370px] -translate-x-1/2"
        >
          보따리 만들러 가기
        </Button>
      </div>
      <section className="flex w-full flex-col gap-[14px]">
        <div className="flex items-center justify-between">
          <p className="font-medium text-gray-900">내가 만든 보따리</p>
          <Link href="/my-bundles" className="flex items-center justify-center">
            <p className="text-sm text-gray-600">더보기</p>
            <Icon
              src={ArrowRightIcon}
              alt="more"
              size="small"
              loading="eager"
            />
          </Link>
        </div>
        <div
          className="overflow-x-auto overflow-y-hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {isError ? (
            <p className="flex h-[88px] items-center justify-center text-coral-600">
              데이터를 불러오는 도중 오류가 발생했습니다.
            </p>
          ) : isLoading ? (
            <div className="flex h-[88px] w-full items-center justify-center">
              <Loading />
            </div>
          ) : myBundles.length > 0 ? (
            <MyCardList data={data.result} type="bundle" size="medium" />
          ) : (
            <p className="flex h-[88px] items-center justify-center text-gray-200">
              아직 만들어진 보따리가 없습니다.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default Page;
