import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

const fetchGiftBagPreview = async () => {
  const accessToken = getCookie("accessToken");

  const response = await fetch("/api/v1/bundles/main", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("데이터를 불러오는 데 실패했습니다.");
  }
  return response.json();
};

export const useGiftBagPreview = () => {
  return useQuery({
    queryKey: ["giftBagPreview"],
    queryFn: fetchGiftBagPreview,
  });
};
