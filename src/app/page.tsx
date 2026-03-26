"use client";

import { CreateMeetingModal } from "@/app/meetings/modal/CreateMeetingModal";
import Notification from "@/components/layout/Notification";

export default function Home() {
  return (
    <>
      <CreateMeetingModal />
      <Notification />
    </>
  );
}
