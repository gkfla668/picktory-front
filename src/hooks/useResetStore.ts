import { useEffect } from "react";

import {
  useSelectedBagStore,
  useBundleNameStore,
  useIsClickedUpdateFilledButton,
} from "@/stores/bundle/useStore";
import { resetGiftBoxes } from "@/utils/giftBoxUtils";

const useResetStore = () => {
  const { setSelectedBagIndex } = useSelectedBagStore();
  const { setBundleName } = useBundleNameStore();
  const { setIsClickedUpdateFilledButton } = useIsClickedUpdateFilledButton();

  useEffect(() => {
    resetGiftBoxes();
    setSelectedBagIndex(0);
    setBundleName("");
    sessionStorage.removeItem("bundleId");
    setIsClickedUpdateFilledButton(false);
  }, [setSelectedBagIndex, setBundleName, setIsClickedUpdateFilledButton]);
};

export default useResetStore;
