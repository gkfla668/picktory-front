import React from "react";

import CopyLinkIcon from "../../../public/icons/copy_link.svg";
import { Button } from "../ui/button";

import { Icon } from "./Icon";

const LinkButton = ({ linkUrl }: { linkUrl: string }) => {
  const handleLinkButtonClick = () => {
    if (linkUrl) {
      window.open(linkUrl, "_blank");
    }
  };

  return (
    <Button
      onClick={handleLinkButtonClick}
      disabled={!linkUrl}
      className="h-[30px] w-[141px] text-xs hover:opacity-70"
      variant="secondary"
    >
      첨부한 링크 바로가기
      <Icon src={CopyLinkIcon} size="xsmall" alt="copyLink-btn" />
    </Button>
  );
};

export default React.memo(LinkButton);
