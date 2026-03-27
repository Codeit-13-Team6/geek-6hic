"use client";

import { useState } from "react";
import { CreateMeetingModal } from "@/app/meetings/modal/CreateMeetingModal";
import Notification from "@/components/layout/notification/Notification";

export default function Home() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(true);

  return (
    <>
      <CreateMeetingModal />
      <Notification
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
}
