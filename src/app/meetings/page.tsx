'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getMeetingList } from '@/api/meetings';
import type { Meeting } from '@/types';

import bannerLg from '@/assets/img/banner/banner-lg.png';
import bannerSm from '@/assets/img/banner/banner-sm.png';
import arrowDrop from '@/assets/icon/arrow/arrow-drop.svg';
import filter from '@/assets/icon/filter/filter.svg';
import MeetingList from './components/MeetingList';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/SelectCommon";

export default function Page() {
  const router = useRouter();
  const [activeValue, setActiveValue] = useState('all');

  // 필터링 로직
  const [sortValue, setSortValue] = useState<'deadline' | 'participants'>('deadline');
  const sortOptions = [
    { value: 'deadline', label: '마감임박 순' },
    { value: 'participants', label: '참여인원 순' },
  ] as const;
  
  const sortByMap = {
    deadline: 'registrationEnd',
    participants: 'participantCount',
  } as const;
  
  const currentSortLabel = sortOptions.find(
    (opt) => opt.value === sortValue,
  )?.label;
  
  const { data: meetingList = [], isLoading } = useQuery<Meeting[]>({
    queryKey: ['meetings', sortValue],
    queryFn: () =>
      getMeetingList({
        sortBy: sortByMap[sortValue],
      }),
  });

  // 탭 value
  const TAB_LIST = [
    { value: 'all', label: '전체' },
    { value: 'team', label: '팀미팅' },
    { value: 'study', label: '스터디' },
    { value: 'job', label: '취준생' },
    { value: 'wework', label: '위워크' },
    { value: 'etc', label: '기타' },
  ];


  return (
    <div className="w-full bg-gray-50 sm:pt-6 lg:pt-[48px]">
      <div className="relative mx-auto flex min-h-48 w-full items-center overflow-hidden bg-[#9debcd] bg-[url('/img/banner/banner-lg-demo.jpg')] bg-cover bg-center bg-no-repeat pl-4 sm:min-h-61 sm:max-w-[calc(100%-48px)] sm:rounded-3xl sm:bg-none sm:pl-10 lg:w-full lg:max-w-[1280px] lg:pl-14">
        <div>
          <h4 className="text-sm text-green-700 sm:text-xl">함께할 사람을 찾고 계신가요?</h4>
          <h3 className="mt-[10px] text-lg font-semibold sm:text-3xl">지금 모임에 참여해보세요</h3>

          <div className="absolute left-[323px] top-7 hidden h-[273px] w-117 sm:block lg:hidden">
            <Image src={bannerLg} fill alt="" />
          </div>

          <div className="absolute right-21 top-2 hidden h-[313px] w-134 lg:block">
            <Image src={bannerSm} fill alt="" />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1280px]">
        <div className="mb-4 mt-6 flex flex-col">
          <ul className="flex gap-2 overflow-auto">
            {TAB_LIST.map(({ value, label }) => (
              <li key={value}>
                <button
                  type="button"
                  onClick={() => setActiveValue(value)}
                  className={cn(
                    'shrink-0 cursor-pointer rounded-[14px] px-4 py-2 transition-colors',
                    activeValue === value
                      ? 'bg-gray-700 font-bold text-white'
                      : 'bg-gray-100 text-gray-800',
                  )}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-2 flex">
          <Select
              value={sortValue}
              onValueChange={(value) => {
                if (value === 'deadline' || value === 'participants') {
                  setSortValue(value);
                }
              }}
            >
              <SelectTrigger className="!h-[50px] w-[120px] !rounded-[12px] px-4 text-sm font-medium text-gray-800 sm:w-[140px]">
                <SelectValue>{currentSortLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent className="w-[120px] sm:w-[140px]">
                <SelectGroup>
                  {sortOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <button
              type="button"
              className="flex items-center gap-0.5 px-2 py-1 text-base font-bold text-gray-600"
            >
              <span>날짜 전체</span>
              <div className="relative h-[17px] w-[17px]">
                <Image src={arrowDrop} fill alt="날짜 전체" />
              </div>
            </button>

            <button
              type="button"
              className="flex items-center gap-0.5 px-2 py-1 text-base font-bold text-gray-600"
            >
              <div className="relative h-[17px] w-[17px]">
                <Image src={filter} fill alt="마감 임박" />
              </div>
              <span>마감 임박</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
          <MeetingList
            meetingList={meetingList}
            isLoading={isLoading}
            onItemClick={(item) => router.push(`/meetings/${item.id}`)}
          />
        </div>
      </div>
    </div>
  );
}