import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

type MeetingType = '팀미팅' | '스터디' | '프로젝트' | '취준생' | '기타';

type MeetingItem = {
  id: number;
  title: string;
  type: MeetingType;
};

const mockMeetingList: MeetingItem[] = [
  { id: 1, title: '팀 회의 A', type: '팀미팅' },
  { id: 2, title: '스터디 A', type: '스터디' },
  { id: 3, title: '프로젝트 A', type: '프로젝트' },
  { id: 4, title: '취업 준비 A', type: '취준생' },
  { id: 5, title: '기타 모임 A', type: '기타' },
  { id: 6, title: '팀 회의 B', type: '팀미팅' },
  { id: 7, title: '스터디 B', type: '스터디' },
  { id: 8, title: '프로젝트 B', type: '프로젝트' },
  { id: 9, title: '취업 준비 B', type: '취준생' },
  { id: 10, title: '기타 모임 B', type: '기타' },
];

function MeetingTabsFilterTest() {
  const [activeType, setActiveType] = useState<'전체' | MeetingType>('전체');

  const visibleMeetingList =
    activeType === '전체'
      ? mockMeetingList
      : mockMeetingList.filter((item) => item.type === activeType);

  return (
    <div>
      <div>
        <button onClick={() => setActiveType('전체')}>전체</button>
        <button onClick={() => setActiveType('팀미팅')}>팀미팅</button>
        <button onClick={() => setActiveType('스터디')}>스터디</button>
        <button onClick={() => setActiveType('프로젝트')}>프로젝트</button>
        <button onClick={() => setActiveType('취준생')}>취준생</button>
        <button onClick={() => setActiveType('기타')}>기타</button>
      </div>

      <ul>
        {visibleMeetingList.map((item) => (
          <li key={item.id}>
            {item.title} - {item.type}
          </li>
        ))}
      </ul>
    </div>
  );
}

describe('Meeting tab filter', () => {
  test('초기에 전체 탭', () => {
    render(<MeetingTabsFilterTest />);
    // 초기에 리스트 10개 들어오는지 확인
    expect(screen.getAllByRole('listitem')).toHaveLength(10);

    // 리스트 3개 샘플로 확인
    expect(screen.getByText('팀 회의 A - 팀미팅')).toBeInTheDocument();
    expect(screen.getByText('스터디 A - 스터디')).toBeInTheDocument();
    expect(screen.getByText('프로젝트 A - 프로젝트')).toBeInTheDocument();
  });

  test('팀미팅 탭 클릭 시 팀미팅 카드만 노출된다', async () => {
    const user = userEvent.setup(); // 사용자 행동 최신방식
    render(<MeetingTabsFilterTest />);

    await user.click(screen.getByRole('button', { name: '팀미팅' }));
    
    // 팀미팅 클릭 시 있는지 확인 
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('팀 회의 A - 팀미팅')).toBeInTheDocument();
    expect(screen.getByText('팀 회의 B - 팀미팅')).toBeInTheDocument();

    // 팀미팅 클릭 시 없는지 확인
    expect(screen.queryByText('스터디 A - 스터디')).not.toBeInTheDocument();
    expect(screen.queryByText('프로젝트 A - 프로젝트')).not.toBeInTheDocument();
    expect(screen.queryByText('취업 준비 A - 취준생')).not.toBeInTheDocument();
    expect(screen.queryByText('기타 모임 A - 기타')).not.toBeInTheDocument();
  });

  test('스터디 탭 클릭 시 스터디 카드만 노출된다', async () => {
    const user = userEvent.setup();
    render(<MeetingTabsFilterTest />);

    await user.click(screen.getByRole('button', { name: '스터디' }));
    
    // 스터디 클릭 시 있는지 확인 
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('스터디 A - 스터디')).toBeInTheDocument();
    expect(screen.getByText('스터디 B - 스터디')).toBeInTheDocument();
    
    // 스터디 클릭 시 없는지 확인 
    expect(screen.queryByText('팀 회의 A - 팀미팅')).not.toBeInTheDocument();
    expect(screen.queryByText('프로젝트 A - 프로젝트')).not.toBeInTheDocument();
  });

  test('기타 탭 클릭 후 전체 탭 클릭 시 전체 카드가 다시 노출된다', async () => {
    const user = userEvent.setup();
    render(<MeetingTabsFilterTest />);

    await user.click(screen.getByRole('button', { name: '기타' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: '전체' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(10);
  });
});