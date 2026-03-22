"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFavorites, getFavorites } from "@/api/meeting";
import { UserCard } from "@/components/features/card/UserCard";

export default function FavoriteList() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: favoritesList } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: (meetingId: number) => deleteFavorites(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return (
    <>
      {favoritesList?.map((item: any) => (
        <UserCard
          key={item.id}
          title={item.meeting.name}
          type={item.meeting.type}
          date={new Date(item.meeting.dateTime)}
          imageSrc={item.meeting.image}
          capacity={item.meeting.capacity}
          participantCount={item.meeting.participantCount}
          defaultLiked={true}
          onDetailClick={() => router.push(`/meeting/${item.meetingId}`)}
          onHeartClick={() => toggleFavorite(item.meetingId)}
        />
      ))}
    </>
  );
}
