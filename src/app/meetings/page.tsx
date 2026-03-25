'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getMeetingList } from '@/api/meetings';
import type { JoinedMeeting } from '@/types';
import type { DateRange } from 'react-day-picker';
import { useMeetingFavoriteMutation } from "@/hooks/useMeetingFavoriteMutation";

import bannerLg from '@/assets/img/banner/banner-lg.png';
import bannerSm from '@/assets/img/banner/banner-sm.png';
import MeetingList from './components/MeetingList';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/SelectCommon';
import { Calendar } from '@/components/ui/Calendar';

const TAB_LIST = [
  { value: 'all', label: '전체', type: undefined },
  { value: 'team', label: '팀미팅', type: '팀미팅' },
  { value: 'study', label: '스터디', type: '스터디' },
  { value: 'job', label: '취준생', type: '취준생' },
  { value: 'wework', label: '위워크', type: '위워크' },
  { value: 'etc', label: '기타', type: '기타' },
] as const;

const SORT_OPTIONS = [
  { value: 'deadline', label: '마감임박 순' },
  { value: 'participants', label: '참여인원 순' },
] as const;

const sortByMap = {
  deadline: 'registrationEnd',
  participants: 'participantCount',
} as const;

const sortOrderMap = {
  deadline: 'asc',
  participants: 'desc',
} as const;

type TabValue = (typeof TAB_LIST)[number]['value'];
type SortValue = 'deadline' | 'participants' | null;

export default function Page() {
  const router = useRouter();

  const [activeValue, setActiveValue] = useState<TabValue>('all');
  const [sortValue, setSortValue] = useState<SortValue>(null);
  const [draftDate, setDraftDate] = useState<DateRange | undefined>(undefined);
  const [appliedDate, setAppliedDate] = useState<DateRange | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  const { toggleFavorite, isPending } = useMeetingFavoriteMutation();

  const currentTab = TAB_LIST.find((tab) => tab.value === activeValue);

  const { data: meetingList = [], isLoading } = useQuery<JoinedMeeting[]>({
    queryKey: ['meetings', activeValue, sortValue],
    queryFn: async () => {
      const params = {
        type: currentTab?.type,
        size: 100,
        ...(sortValue
          ? {
            sortBy: sortByMap[sortValue],
            sortOrder: sortOrderMap[sortValue],
          }
          : {}),
      };

      const response = await getMeetingList(params);

      return response;
    },
  });

  // 필터 선택 후 인풋 SORT_OPTIONS의 label로 변경
  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === sortValue)?.label;

  // 달력선택시
  const calendarValue = (range: DateRange | undefined) => {
    setDraftDate(range);
  };

  const filteredMeetingList = meetingList.filter((meeting) => {
    if (!appliedDate?.from || !appliedDate?.to) return true;

    const meetingTime = new Date(meeting.dateTime).getTime();
    const fromTime = new Date(appliedDate.from).setHours(0, 0, 0, 0);
    const toTime = new Date(appliedDate.to).setHours(23, 59, 59, 999);

    return meetingTime >= fromTime && meetingTime <= toTime;
  });

  return (
    <div className='w-full bg-gray-50 pb-20 sm:pt-6 lg:pt-[48px]'>
      <div className="relative mx-auto flex min-h-48 w-full items-center overflow-hidden bg-[#9debcd] bg-[url('/img/banner/banner-lg-demo.jpg')] bg-cover bg-center bg-no-repeat pl-4 sm:min-h-61 sm:max-w-[calc(100%-48px)] sm:rounded-3xl sm:bg-none sm:pl-10 lg:w-full lg:max-w-[1280px] lg:pl-14">
        <div>
          <h4 className='text-sm text-green-700 sm:text-xl'>
            함께할 사람을 찾고 계신가요?
          </h4>
          <h3 className='mt-[10px] text-lg font-semibold sm:text-3xl'>
            지금 모임에 참여해보세요
          </h3>

          <div className='absolute left-[323px] top-7 hidden h-[273px] w-117 sm:block lg:hidden'>
            <Image src={bannerLg} fill alt='' />
          </div>

          <div className='absolute right-21 top-2 hidden h-[313px] w-134 lg:block'>
            <Image src={bannerSm} fill alt='' />
          </div>
        </div>
      </div>

      <div className='mx-auto w-full max-w-[1280px] px-4 sm:px-6'>
        <div className='mb-4 mt-6 flex flex-col'>
          <ul className='flex gap-2 overflow-auto'>
            {TAB_LIST.map(({ value, label }) => (
              <li key={value} className='shrink-0'>
                <button
                  type='button'
                  onClick={() => {
                    setActiveValue(value);
                    setSortValue(null);
                    setDraftDate(undefined);
                    setAppliedDate(undefined);
                  }}
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

          <div className='mt-2 flex justify-end items-center'>
            <div className='relative'>
              <button
                type='button'
                className='cursor-pointer'
                onClick={() => setIsOpen(true)}
              >날짜 선택</button>
              {isOpen
                ?
                <Calendar
                  mode='range'
                  selected={draftDate}
                  onSelect={calendarValue}
                  onReset={() => {
                    setDraftDate(undefined);
                    setAppliedDate(undefined);
                  }}
                  onApply={() => {
                    setAppliedDate(draftDate);
                    setIsOpen(false);
                  }}
                />
                : null
              }
            </div>
            <Select
              value={sortValue ?? ''}
              onValueChange={(value) => {
                if (value === 'deadline' || value === 'participants') {
                  setSortValue(value);
                }
              }}
            >
              <SelectTrigger className='h-[50px]! w-[140px] rounded-[12px]! px-4 text-sm font-medium text-gray-800'>
                {currentSortLabel ? (
                  <span>{currentSortLabel}</span>
                ) : (
                  <SelectValue placeholder="정렬 선택" />
                )}
              </SelectTrigger>

              <SelectContent className='w-[140px]'>
                <SelectGroup>
                  {SORT_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='flex flex-col gap-4 lg:grid lg:grid-cols-2'>
          <MeetingList
            meetingList={filteredMeetingList}
            isLoading={isLoading}
            onItemClick={(item) => router.push(`/meetings/${item.id}`)}
            sortValue={sortValue}
            onHeartClick={(item) => toggleFavorite(item)}
          />
        </div>
      </div>
    </div>
  );
}
