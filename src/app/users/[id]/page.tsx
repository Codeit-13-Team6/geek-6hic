"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import profileImg from "@/assets/img/profile/female1-m.jpg";
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

  useEffect(() => {    const fetchUser = async () => {
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
    <div className="mx-auto mt-[32px] flex flex-col gap-[56px] bg-gray-50 md:mt-[48px] md:w-[1280px] md:flex-row">
      <section className="w-full shrink-0 md:mt-[14px] md:w-[282px]">
        <div
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
        </div>

        <h1
          className="mb-[24px] text-4xl font-semibold md:mx-[10px] md:mb-[54px]"
          onClick={() => {
            const token = localStorage.getItem("token");
            if (!token) return;
            createMeeting(mockMeeting, token);
          }}
        >
          마이페이지 ( 모임 생성 static 으로 박아둠  )
        </h1>

        <article className="bg-main-green-100 border-main-green-400 flex h-[124px] w-full items-center rounded-[24px] border-1! px-[24px] py-[24px] md:h-fit md:flex-col md:items-center md:justify-center md:py-[40px]">
          <Image
            src={user?.image ?? profileImg}
            alt="프로필 이미지"
            width={114}
            height={114}
            className="mr-[12px] h-[54px] w-[54px] overflow-hidden rounded-full md:mr-0 md:mb-[24px] md:h-[114px] md:w-[114px]"
          />
          <div className="flex flex-row items-center justify-center align-middle text-lg font-semibold whitespace-nowrap text-gray-800 md:mb-[22px]">
            {user?.name}
            <Image
              src={editImg}
              alt="수정 이미지"
              width={28}
              height={28}
              className="cursor-pointer md:h-[28px] md:w-[28px]"
              onClick={() => setIsEditModalOpen(true)}
            />
          </div>
          <div className="ml-[58px] flex flex-col md:ml-0">
            <div className="bg-gradient-200 mb-[8px] rounded-[24px] px-[12px] py-[6px] whitespace-nowrap text-gray-600 md:mb-[30px]">
              {user?.email}
            </div>
            <div className="flex flex-row items-center md:flex-col">
              <p className="mr-[18px] font-medium whitespace-nowrap text-gray-500 md:mr-0 md:mb-[4px]">
                한줄소개
              </p>
              <p className="font-medium text-gray-800">{user?.companyName}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="flex-1">
        <TabCommon>
          <TabsContent value="liked" className="md:mt-[42px]">
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
          <TabsContent value="created" className="md:mt-[42px]">
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
          <TabsContent value="lounge" className="md:mt-[42px]">
            라운지
          </TabsContent>
        </TabCommon>
      </section>
    </div>
  );
}
