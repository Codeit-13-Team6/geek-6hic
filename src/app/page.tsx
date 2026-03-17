"use client";

import ModalCommon from "@/components/common/ModalCommon";
import { CreateMeetingModalContent } from "@/components/modal/CreateMeetingModalContent";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      {" "}
      <Button type="button" onClick={handleOpenModal}>
        모달 열기
      </Button>
      <ModalCommon
        disablePointerDismissal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        contentClassName="w-[544px] max-w-[calc(100vw-24px)] rounded-[40px] px-12 py-12 border-none shadow-2xl"
      >
        <CreateMeetingModalContent
          onClose={() => {
            setIsOpen(false);
          }}
        />
      </ModalCommon>
    </>
  );
}
