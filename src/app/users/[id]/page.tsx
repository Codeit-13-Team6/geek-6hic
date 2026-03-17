"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import profileImg from "@/assets/img/profile/female1-sm.jpg";
import editImg from "@/assets/icon/edit/edit-sm.svg";
import { TabCommon, TabsContent } from "@/components/common/TabCommon";
import { DetailCardCommon } from "@/components/common/DetailCardCommon";
import { getUser } from "@/api/user";
import { User } from "@/types/user";
import { Meeting } from "@/types/meeting";
import {
  createMeeting,
  getFavorites,
  getMeeting,
  postMeetType,
  updateFavorites,
} from "@/api/meeting";
import { getRefresh } from "@/api/auth";

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
  const [user, setUser] = useState<User | null>(null);
  const [meetList, setMeetList] = useState<any | null>(null);
  const [favoritesList, setFavoritesList] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const data = await getUser(token);
        const meetData = await getMeeting(token);
        const favoritesList = await getFavorites(token);
        setFavoritesList(favoritesList.data);
        setUser(data);
        setMeetList(meetData.data);
      } catch {
        const refresh = localStorage.getItem("refresh");
        if (!refresh) return;
        const { accessToken, refreshToken } = await getRefresh(refresh);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refresh", refreshToken);
        const data = await getUser(accessToken);
        const meetList = await getMeeting(accessToken);
        const favoritesList = await getFavorites(accessToken);
        setFavoritesList(favoritesList.data);
        setMeetList(meetList.data);
        setUser(data);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-20 md:pt-10 lg:pt-[48px]">
      <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6 lg:px-8">
        {/* <div
          onClick={() => {
            const token = localStorage.getItem("token");

            if (!token) return;

            postMeetType(token);
          }}
        >
          모임 종류 생성
        </div>

        <div
          onClick={() => {
            const token = localStorage.getItem("token");

            if (!token) return;

            updateFavorites(696, token);
          }}
        >
          찜 추가
        </div> */}
        <h1
          className="mb-4 ml-2 cursor-pointer text-xl font-bold text-gray-900 md:mb-8 md:text-2xl lg:mb-10 lg:text-[32px]"
          onClick={() => {
            const token = localStorage.getItem("token");
            if (!token) return;
            createMeeting(mockMeeting, token);
          }}
        >
          마이페이지
        </h1>

        <div className="flex flex-col gap-5 md:gap-10 lg:flex-row lg:items-start lg:gap-[56px]">
          <section className="w-full shrink-0 lg:w-[282px]">
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
            <TabCommon>
              <TabsContent value="liked" className="mt-6 md:mt-[42px]">
                {favoritesList?.map((item: any) => (
                  <DetailCardCommon
                    key={item.id}
                    title={item.meeting.name}
                    type={item.meeting.type}
                    date={new Date(item.meeting.dateTime)}
                    imageSrc={item.meeting.image}
                    capacity={item.meeting.capacity}
                    participantCount={item.meeting.participantCount}
                  />
                ))}
              </TabsContent>
              <TabsContent value="created" className="mt-6 md:mt-[42px]">
                {meetList?.map((item: any) => (
                  <DetailCardCommon
                    key={item.id}
                    title={item.name}
                    type={item.type}
                    date={new Date(item.dateTime)}
                    imageSrc={item.image}
                    capacity={item.capacity}
                    participantCount={item.participantCount}
                  />
                ))}
              </TabsContent>
              <TabsContent value="lounge" className="mt-6 md:mt-[42px]">
                라운지
              </TabsContent>
            </TabCommon>
          </section>
        </div>
      </div>
    </div>
  );
}
