import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

type SortType = 'latest' | 'participants' | 'oldest';

type MeetingItem = {
  id: number;
  title: string;
  createdAt: string;
  participantCount: number;
};

const mockMeetingList: MeetingItem[] = [
  { id: 1, title: '모임 A', createdAt: '2024-01-01', participantCount: 5 },
  { id: 2, title: '모임 B', createdAt: '2024-01-02', participantCount: 2 },
  { id: 3, title: '모임 C', createdAt: '2024-01-03', participantCount: 10 },
  { id: 4, title: '모임 D', createdAt: '2024-01-04', participantCount: 1 },
  { id: 5, title: '모임 E', createdAt: '2024-01-05', participantCount: 8 },
  { id: 6, title: '모임 F', createdAt: '2024-01-06', participantCount: 3 },
  { id: 7, title: '모임 G', createdAt: '2024-01-07', participantCount: 7 },
  { id: 8, title: '모임 H', createdAt: '2024-01-08', participantCount: 6 },
  { id: 9, title: '모임 I', createdAt: '2024-01-09', participantCount: 4 },
  { id: 10, title: '모임 J', createdAt: '2024-01-10', participantCount: 9 },
];

function SortFilterTest() {
  const [sortType, setSortType] = useState<SortType>('latest');

  const sortedMeetingList = [...mockMeetingList].sort((a, b) => {
    if (sortType === 'latest') {
      return (
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    if (sortType === 'participants') {
      return b.participantCount - a.participantCount;
    }

    if (sortType === 'oldest') {
      return (
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    }

    return 0;
  });

  return (
    <div>
      <button type="button" onClick={() => setSortType('latest')}>
        최신순
      </button>
      <button type="button" onClick={() => setSortType('oldest')}>
        오래된순
      </button>
      <button type="button" onClick={() => setSortType('participants')}>
        참여인원순
      </button>

      <ul>
        {sortedMeetingList.map((item) => (
          <li key={item.id}>
            {item.title} / {item.createdAt} / {item.participantCount}
          </li>
        ))}
      </ul>
    </div>
  );
}

describe('모임 정렬 테스트', () => {
  test('기본값은 최신순으로 노출된다', () => {
    render(<SortFilterTest />);

    const items = screen.getAllByRole('listitem');

    expect(items).toHaveLength(10);

    expect(items[0]).toHaveTextContent('모임 J');
    expect(items[1]).toHaveTextContent('모임 I');
    expect(items[2]).toHaveTextContent('모임 H');
  });

  test('참여인원순 클릭 시 참여인원 많은 순으로 노출된다', async () => {
    const user = userEvent.setup();
    render(<SortFilterTest />);

    await user.click(screen.getByRole('button', { name: '참여인원순' }));

    const items = screen.getAllByRole('listitem');

    expect(items).toHaveLength(10);

    expect(items[0]).toHaveTextContent('모임 C');
    expect(items[1]).toHaveTextContent('모임 J');
    expect(items[2]).toHaveTextContent('모임 E');
  });

  test('오래된순 클릭 시 오래된 날짜 순으로 노출된다', async () => {
    const user = userEvent.setup();
    render(<SortFilterTest />);

    await user.click(screen.getByRole('button', { name: '오래된순' }));

    const items = screen.getAllByRole('listitem');

    expect(items).toHaveLength(10);

    expect(items[0]).toHaveTextContent('모임 A');
    expect(items[1]).toHaveTextContent('모임 B');
    expect(items[2]).toHaveTextContent('모임 C');
  });

  test('참여인원순 클릭 후 최신순 클릭 시 다시 최신순으로 노출된다', async () => {
    const user = userEvent.setup();
    render(<SortFilterTest />);

    await user.click(screen.getByRole('button', { name: '참여인원순' }));
    await user.click(screen.getByRole('button', { name: '최신순' }));

    const items = screen.getAllByRole('listitem');

    expect(items[0]).toHaveTextContent('모임 J');
    expect(items[1]).toHaveTextContent('모임 I');
    expect(items[2]).toHaveTextContent('모임 H');
  });
});