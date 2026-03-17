"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import profileImg from "@/assets/img/profile/female1-m.jpg";
import editImg from "@/assets/icon/edit/edit-sm.svg";
import { TabCommon, TabsContent } from "@/components/common/TabCommon";
import { DetailCardCommon } from "@/components/common/DetailCardCommon";
import { getUser } from "@/api/user";
import { Meeting } from "@/types";
import {
  createMeeting,
  deleteFavorites,
  getFavorites,
  getMeeting,
  postMeetType,
  updateFavorites,
} from "@/api/meeting";
import LoungePostListCommon from "@/components/common/LoungePostListCommon";
import { useAuthStore } from "@/store/useAuthStore";
import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/components/common/PaginationCommon";
import { HotListCardCommon } from "@/components/common/HotListCardCommon";

const mockMeeting: Meeting = {
  name: "달램핏ㅇ임7",
  type: "스터디",
  region: "디스코드?2",
  address: "스타벅스 강남역점, 서울 강남구 강남대로 390, 3층으아아아아",
  latitude: 37.4979,
  longitude: 127.0276,
  dateTime: "2026-05-02T14:00:00.000Z",
  registrationEnd: "2026-05-01T23:59:59.000Z",
  capacity: 20,
  image: "https://example.com/image.jpg",
  description: "함께 운동하며 건강을 챙겨요!ㅇㅇㅇ",
};

export default function Page() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();


  // 라운지 게시물 필터링을 위해 id 세팅 , 추후 다른곳에서도 id 사용여지가있을것같아서 일단 전역으로 두었는데 상황에 따라서 전역관리 안해도 될것같으면 제외하는걸로
  const userId = useAuthStore((state) => state.userId);
  const setUserId = useAuthStore((state) => state.setUserId);


  const { mutate: toggleFavorite } = useMutation({
    mutationFn: (meetingId: number) => deleteFavorites(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });


  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const { data: meetList } = useQuery({
    queryKey: ["meetings", "my"],
    queryFn: async () => {
      const res = await getMeeting();
      return res.data;
    },
  });

  const { data: favoritesList } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await getFavorites();
      return res.data;
    },
  });


  useEffect(() => {
    if (user?.id) setUserId(user.id);
  }, [user]);


  return (
    <div className="w-full flex-1 bg-gray-50 pt-6 pb-20 md:pt-10 lg:pt-[48px]">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        {/*<div onClick={() => postMeetType()}>모임 종류 생성</div>*/}
        {/*<div onClick={() => updateFavorites(698)}>찜 추가</div>*/}
        {/*<div onClick={() => createMeeting(mockMeeting)}>모임생성</div>*/}

        <div className="flex flex-col gap-5 md:gap-10 lg:flex-row lg:items-start lg:gap-[56px]">
          <section className="mt-0 w-full shrink-0 lg:mt-[22px] lg:w-[282px]">
            <h1 className="mb-4 ml-2 cursor-pointer text-xl font-bold text-gray-900 md:mb-8 md:text-2xl lg:mb-10 lg:text-[32px]">
              마이페이지
            </h1>
            <article className="border-main-green-400 bg-main-green-100 flex h-[100px] w-full shrink-0 items-center rounded-[24px] border px-4 md:h-[124px] md:px-6 lg:h-[370px] lg:w-[282px] lg:flex-col lg:justify-center lg:py-10">
              <div className="flex shrink-0 items-center gap-2 lg:flex-col lg:gap-6">
                <div className="relative size-[30px] overflow-hidden rounded-full sm:size-[36px] lg:size-[114px]">
                  <Image
                    src={user?.image ?? profileImg}
                    alt="프로필 이미지"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center gap-1 lg:mb-2">
                  <span className="text-sm font-bold text-gray-800 sm:text-lg lg:text-xl">
                    {user?.name}
                  </span>
                  <Image
                    src={editImg}
                    alt="수정 이미지"
                    className="size-5 cursor-pointer sm:size-7"
                    onClick={() => setIsEditModalOpen(true)}
                  />
                </div>
              </div>

              <div className="bg-main-green-400/50 mx-4 h-12 w-[1px] shrink-0 md:mx-6 lg:hidden" />

              <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 lg:items-center lg:gap-6">
                <div className="lg:bg-gradient-200 flex items-center lg:rounded-[24px] lg:px-4 lg:py-1.5">
                  <span className="w-[52px] shrink-0 text-xs font-medium text-gray-500 sm:text-sm lg:hidden">
                    이메일
                  </span>
                  <span className="sm:text-md truncate text-xs font-medium text-gray-800 sm:ml-3 sm:text-sm lg:text-gray-600">
                    {user?.email}
                  </span>
                </div>
                <div className="flex items-center lg:flex-col lg:gap-1">
                  <span className="w-[52px] shrink-0 text-xs font-medium text-gray-500 sm:text-sm lg:w-auto lg:text-base">
                    한줄소개
                  </span>
                  <span className="truncate text-xs font-medium text-gray-800 sm:ml-3 sm:text-sm lg:text-gray-800">
                    {user?.companyName}
                  </span>
                </div>
              </div>
            </article>
          </section>

          <section className="flex min-w-0 flex-1 flex-col">
            <HotListCardCommon/>

            <TabCommon>
              <TabsContent value="liked" className="mt-6 md:mt-[32px]">
                {favoritesList?.map((item: any) => (
                  <DetailCardCommon
                    key={item.id}
                    title={item.meeting.name}
                    type={item.meeting.type}
                    date={new Date(item.meeting.dateTime)}
                    imageSrc={item.meeting.image}
                    capacity={item.meeting.capacity}
                    participantCount={item.meeting.participantCount}
                    defaultLiked={true}
                    onDetailClick={() =>
                      router.push(`/meeting/${item.meetingId}`)
                    }
                    onHeartClick={() => toggleFavorite(item.meetingId)}
                  />
                ))}
              </TabsContent>
              <TabsContent value="created" className="mt-6 md:mt-[32px]">
                {meetList?.map((item: any) => (
                  <DetailCardCommon
                    key={item.id}
                    title={item.name}
                    type={item.type}
                    date={new Date(item.dateTime)}
                    imageSrc={item.image}
                    capacity={item.capacity}
                    participantCount={item.participantCount}
                    showLikeBtn={false}
                    onDetailClick={() => router.push(`/meeting/${item.id}`)}
                  />
                ))}
              </TabsContent>
              <TabsContent value="lounge" className="md:mt-[32px]">
                <LoungePostListCommon
                  filterFn={(post) => post.author.id === userId}
                />
              </TabsContent>
            </TabCommon>
          </section>
        </div>
      </div>
    </div>
  );
}
