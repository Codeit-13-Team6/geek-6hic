"use client";

import { useState } from "react";
import Image from "next/image";
import profileImg from "@/assets/img/profile/female1-m.jpg";
import editImg from "@/assets/icon/edit/edit-sm.svg";
import { TabCommon, TabsContent } from "@/components/common/TabCommon";
import { DetailCardCommon } from "@/components/common/DetailCardCommon";

export default function Page() {

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


  return (
    <div className="mx-auto mt-[32px] flex flex-col gap-[56px] bg-gray-50 md:mt-[48px] md:w-[1280px] md:flex-row">
      <section className="w-full shrink-0 md:mt-[14px] md:w-[282px]">
        <h1 className="mb-[24px] text-4xl font-semibold md:mx-[10px] md:mb-[54px]">
          마이페이지
        </h1>

        <article className="bg-main-green-100 border-main-green-400 flex h-[124px] w-full items-center rounded-[24px] border-1! px-[24px] py-[24px] md:h-fit md:flex-col md:items-center md:justify-center md:py-[40px]">
          <Image
            src={profileImg}
            alt="프로필 이미지"
            width={114}
            height={114}
            className="mr-[12px] h-[54px] w-[54px] overflow-hidden rounded-full md:mr-0 md:mb-[24px] md:h-[114px] md:w-[114px]"
          />
          <div className="flex flex-row items-center justify-center align-middle text-lg font-semibold text-gray-800 md:mb-[22px]">
            아이디
            <Image
              src={editImg}
              alt="수정 이미지"
              width={28}
              height={28}
              className="cursor-pointer md:h-[28px] md:w-[28px]"
              onClick={() => setIsEditModalOpen(true)}
            />
          </div>
          <div className="flex flex-col ml-[58px] md:ml-0">
            <div className="bg-gradient-200 rounded-[24px] px-[12px] py-[6px] text-gray-600 md:mb-[30px] mb-[8px]">
              이메일
            </div>
            <div className="flex md:flex-col flex-row items-center">
              <p className="font-medium text-gray-500 md:mb-[4px] mr-[18px] md:mr-0">
                한줄소개
              </p>
              <p className="font-medium text-gray-800">내용요오오ㅗㅇ오</p>
            </div>
          </div>
        </article>
      </section>

      <section className="flex-1">
        <TabCommon>
          <TabsContent value="liked" className="md:mt-[42px]">
            <DetailCardCommon />
          </TabsContent>
          <TabsContent value="created" className="md:mt-[42px]">
            내가만든모임
          </TabsContent>
          <TabsContent value="lounge" className="md:mt-[42px]">
            라운지
          </TabsContent>
        </TabCommon>
      </section>
    </div>
  );
}
