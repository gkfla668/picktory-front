"use client";

import cloneDeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import LogoIcon from "/public/icons/logo.svg";
import SettingIcon from "/public/icons/setting_large.svg";
import ArrowLeftIcon from "/public/icons/arrow_left_large.svg";
import CloseIcon from "/public/icons/close.svg";
import EditIcon from "/public/icons/edit.svg";

import {
  BUNDLE_NAME_MAX_LENGTH,
  MIN_GIFTBOX_AMOUNT,
} from "@/constants/constants";
import { toast } from "@/hooks/use-toast";
import useDynamicTitle from "@/hooks/useDynamicTitle";
import { useTempSaveBundle } from "@/hooks/useTempSaveBundle";
import { useEditDraftBundleNameMutation } from "@/queries/useEditDraftBundleNameMutation";
import {
  useCreatingBundleStore,
  useBundleNameStore,
  useIsOpenDetailGiftBoxStore,
  useSelectedBagStore,
  useLoadingStore,
  useSnapshotGiftBoxesStore,
} from "@/stores/bundle/useStore";
import { useEditBoxStore, useGiftStore } from "@/stores/gift-upload/useStore";

import GoToHomeDrawer from "./GoToHomeDrawer";

// 정적 title 관리
const pageTitles: { [key: string]: string } = {
  "/bundle/detail": "내가 만든 보따리",
  "/my-bundles": "내가 만든 보따리",
  "/bundle/delivery": "선물 보따리 배달하기",
  "/bundle": "선물 보따리 만들기",
  "/gift-upload": "선물 박스 채우기",
  "/setting/account": "연결된 계정",
  "/setting/notice": "공지사항",
  "/setting": "설정",
};

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams?.get("step");
  const isStepThree = step === "3";

  const dynamicTitle = useDynamicTitle(); // 타이틀 동적 업데이트

  const [showGoToHomeDrawer, setShowGoToHomeDrawer] = useState(false);

  const { setIsBoxEditing } = useEditBoxStore();
  const { isCreatingBundle } = useCreatingBundleStore();
  const { isOpenDetailGiftBox, setIsOpenDetailGiftBox } =
    useIsOpenDetailGiftBoxStore();
  const { bundleName } = useBundleNameStore();
  const isLoading = useLoadingStore((state) => state.isLoading);

  const isAuthPage = ["/auth/login"].includes(pathname ?? "");
  const isHomePage = pathname === "/home";
  const isNotFoundPage = !Object.keys(pageTitles).some((key) =>
    pathname?.startsWith(key),
  );
  const isBundleDeliveryPage = pathname === "/bundle/delivery";
  const isGiftUploadPage = pathname === "/gift-upload";
  const isBundleAddPage = pathname === "/bundle/add";

  const bgColor = isAuthPage ? "bg-pink-50" : "bg-white";

  const isBundleDetailStepTwo =
    pathname?.startsWith("/bundle/") && searchParams?.get("step") === "2";

  // 상대방이 받아보는 페이지 (bundle/[id])
  const isReceiveBundlePage =
    pathname?.startsWith("/bundle/") &&
    !pathname.includes("list") &&
    !pathname.includes("detail") &&
    !pathname.includes("add") &&
    !pathname.includes("delivery");

  {
    /** 보따리 임시저장 관련 코드 */
  }
  const { giftBoxes } = useGiftStore();
  const { selectedBagIndex } = useSelectedBagStore();
  const [showTempSave, setShowTempSave] = useState(false);

  const bundleId = sessionStorage.getItem("bundleId");
  const filledCount = giftBoxes.filter((box) => box && box.filled).length;

  useEffect(() => {
    setShowTempSave(filledCount >= MIN_GIFTBOX_AMOUNT);
  }, [filledCount, giftBoxes]);

  const { handleTempSave } = useTempSaveBundle();

  const { snapshotGiftBoxes, setSnapshotGiftBoxes } =
    useSnapshotGiftBoxesStore();

  const handleTempSaveClick = () => {
    handleTempSave({ bundleName, selectedBagIndex });
    setSnapshotGiftBoxes(cloneDeep(giftBoxes));
  };

  if (isBundleDetailStepTwo && isOpenDetailGiftBox) {
    return (
      <div className="relative sticky top-0 z-20 flex h-[56px] items-center justify-center bg-gray-100 px-4">
        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-medium">
          답변 선택하기
        </h1>
        <button
          className="ml-auto"
          onClick={() => setIsOpenDetailGiftBox(false)}
        >
          <Icon src={CloseIcon} alt="close" size="large" />
        </button>
      </div>
    );
  }

  if (isReceiveBundlePage) {
    return (
      <div
        className={`z-20 flex h-[56px] items-center justify-center ${step === "2" ? "bg-pink-50" : "bg-white"}`}
      >
        <Icon src={LogoIcon} alt="logo" />
      </div>
    );
  }

  // 메인 페이지: 로고 + 설정 아이콘
  if (isHomePage) {
    return (
      <div className="z-20 flex h-[56px] bg-white">
        <div className="flex w-full items-center justify-between px-4">
          <button onClick={() => router.push("/")}>
            <Icon src={LogoIcon} alt="logo" />
          </button>
          <button onClick={() => router.push("/setting")}>
            <Icon src={SettingIcon} alt="setting" size="large" />
          </button>
        </div>
      </div>
    );
  }

  // auth 페이지, 404 페이지: 로고만 중앙 정렬
  if (isAuthPage || isNotFoundPage) {
    return (
      <div
        className={`${bgColor} z-20 flex h-[56px] items-center justify-center`}
      >
        <Icon src={LogoIcon} alt="logo" />
      </div>
    );
  }

  const BackButton = () => {
    if ((isStepThree && isBundleDeliveryPage) || isLoading) return null;

    const handleBack = () => {
      if (isGiftUploadPage) {
        setIsBoxEditing(false);
      }

      if (pathname !== "/bundle/add") {
        router.back();
        return;
      }

      if (bundleId && !isCreatingBundle) {
        const hasChanged =
          snapshotGiftBoxes && !isEqual(snapshotGiftBoxes, giftBoxes);

        if (hasChanged) {
          if (filledCount === 0) {
            toast({
              title: "선물 박스를 하나 이상 채운 뒤에 임시 저장이 가능합니다.",
            });
          } else {
            setShowGoToHomeDrawer(true);
          }
        } else {
          router.push(`/my-bundles/${bundleId}`);
        }
        return;
      }

      if (!snapshotGiftBoxes && filledCount > 0) {
        setShowGoToHomeDrawer(true);
        return;
      }
      if (snapshotGiftBoxes && !isEqual(snapshotGiftBoxes, giftBoxes)) {
        if (filledCount === 0) {
          toast({
            title: "선물 박스를 하나 이상 채운 뒤에 임시 저장이 가능합니다.",
          });
        } else {
          setShowGoToHomeDrawer(true);
        }
        return;
      }
      if (!bundleId) {
        router.push("/home");
        return;
      }
      if (isCreatingBundle) {
        router.push("/home");
      } else {
        router.push(`/my-bundles/${bundleId}`);
      }
    };

    return (
      <Button
        onClick={handleBack}
        variant="ghost"
        className="flex justify-start"
      >
        <Icon src={ArrowLeftIcon} alt="back" size="large" />
      </Button>
    );
  };

  const Title = () => {
    const { setBundleName } = useBundleNameStore();
    const [isNameEditing, setIsNameEditing] = useState(false);
    const [inputValue, setInputValue] = useState(dynamicTitle);
    const { mutate } = useEditDraftBundleNameMutation(
      inputValue,
      bundleId ?? "",
    );

    useEffect(() => {
      setInputValue(dynamicTitle);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.length <= BUNDLE_NAME_MAX_LENGTH) {
        setInputValue(value);
      }
    };

    const saveAndClose = () => {
      setIsNameEditing(false);
      setBundleName(inputValue);

      // 임시 저장된 보따리의 경우
      if (bundleId) {
        mutate(); // 이름 수정 API 호출
      }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") saveAndClose();
      if (e.key === "Escape") {
        setIsNameEditing(false);
        setInputValue(dynamicTitle);
      }
    };

    return isBundleAddPage ? (
      <div className="flex items-center justify-center">
        {isNameEditing ? (
          <Input
            autoFocus
            value={inputValue}
            onChange={handleInputChange}
            onBlur={saveAndClose}
            maxLength={BUNDLE_NAME_MAX_LENGTH}
            onKeyDown={handleInputKeyDown}
            className="h-9 border-none bg-pink-50 text-center !text-lg font-medium text-gray-300 shadow-none outline-none ring-0 focus:border-none focus:shadow-none focus:outline-none focus:ring-0 focus-visible:shadow-none focus-visible:outline-none focus-visible:ring-0"
          />
        ) : (
          <>
            <h1 className="flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-lg font-medium">
              {dynamicTitle}
            </h1>
            <Button
              variant="ghost"
              onClick={() => setIsNameEditing(true)}
              className="ml-[2px] w-[20px] min-w-[20px]"
            >
              <Icon src={EditIcon} alt="edit-bundleName" />
            </Button>
          </>
        )}
      </div>
    ) : (
      <h1 className="overflow-hidden text-ellipsis whitespace-nowrap text-center text-lg font-medium">
        {dynamicTitle}
      </h1>
    );
  };

  const RightButton = () => {
    if (showTempSave && isBundleAddPage) {
      return (
        <Button
          variant="ghost"
          onClick={handleTempSaveClick}
          className="flex justify-end text-[15px] text-gray-200"
        >
          임시 저장
        </Button>
      );
    }

    if (isBundleDeliveryPage && isStepThree && !isLoading) {
      return (
        <Button
          onClick={() => router.push("/home")}
          variant="ghost"
          className="flex justify-end"
        >
          <Icon src={CloseIcon} alt="close" size="large" />
        </Button>
      );
    }

    return null;
  };

  return (
    <div
      className={`${isBundleAddPage ? "bg-pink-50" : "bg-white"} relative sticky top-0 z-20 flex h-[56px] items-center px-4`}
    >
      <div className="flex justify-start">
        <BackButton />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Title />
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <RightButton />
      </div>
      {bundleId && (
        <GoToHomeDrawer
          open={showGoToHomeDrawer}
          onClose={() => setShowGoToHomeDrawer(false)}
          bundleId={bundleId}
        />
      )}
    </div>
  );
};

export default Header;
