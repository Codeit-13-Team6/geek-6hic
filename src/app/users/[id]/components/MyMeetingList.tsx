"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMeeting } from "@/api/meetings";
import { UserCard } from "@/components/features/card/UserCard";

export default function MyMeetingList() {
  const router = useRouter();

  const { data: meetList } = useQuery({
    queryKey: ["meetings", "my"],
    queryFn: getMeeting,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {meetList?.map((item: any) => (
        <UserCard
          key={item.id}
          title={item.name}
          type={item.type}
          date={new Date(item.dateTime)}
          imageSrc={item.image}
          capacity={item.capacity}
          participantCount={item.participantCount}
          showLikeBtn={false}
          onDetailClick={() => router.push(`/meetings/${item.id}`)}
        />
      ))}
    </>
  );
}
