// SearchInput.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

// 테스트 파일 안에 컴포넌트 정의
type SearchItem = {
  id: number;
  title: string;
};

interface SearchInputProps {
  items: SearchItem[];
}

function SearchInput({ items }: SearchInputProps) {
  const [searchText, setSearchText] = useState('');

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="검색어 입력"
      />
      <ul>
        {filteredItems.length === 0 ? (
          <li>검색 결과가 없습니다</li>
        ) : (
          filteredItems.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))
        )}
      </ul>
    </div>
  );
}

describe('SearchInput', () => {
  const mockData = [
    { id: 1, title: 'Apple' },
    { id: 2, title: 'Banana' },
    { id: 3, title: 'Melon' },
    { id: 4, title: 'Blueberry' },
    { id: 5, title: 'Cherry' },
    { id: 6, title: 'Avocado' },
    { id: 7, title: 'Mango' },
    { id: 8, title: 'Peach' },
    { id: 9, title: 'Pineapple' },
    { id: 10, title: 'Strawberry' },
  ];

  test('검색어 "a" 입력 시 포함된 항목만 표시', async () => {
    render(<SearchInput items={mockData} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'a');
    
    // 'a'가 포함된 항목들
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Avocado')).toBeInTheDocument();
    expect(screen.getByText('Peach')).toBeInTheDocument();
    
    // 'a'가 없는 항목들은 없어야 함
    expect(screen.queryByText('Cherry')).not.toBeInTheDocument();
    expect(screen.queryByText('Blueberry')).not.toBeInTheDocument();
  });

  test('검색어 "berry" 입력 시 해당 항목만 표시', async () => {
    render(<SearchInput items={mockData} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'berry');
    
    expect(screen.getByText('Blueberry')).toBeInTheDocument();
    expect(screen.getByText('Strawberry')).toBeInTheDocument();
    expect(screen.queryByText('Apple')).not.toBeInTheDocument();
  });

  test('대소문자 구분 없이 검색', async () => {
    render(<SearchInput items={mockData} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'APPLE');
    
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  test('검색어 없을 때 모든 항목 표시', () => {
    render(<SearchInput items={mockData} />);
    
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
  });

  test('검색 결과가 없을 때 메시지 표시', async () => {
    render(<SearchInput items={mockData} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'xyz');
    
    expect(screen.getByText(/검색 결과가 없습니다/i)).toBeInTheDocument();
  });

  test('입력값 초기화 시 모든 항목 다시 표시', async () => {
    render(<SearchInput items={mockData} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'apple');
    await userEvent.clear(input);
    
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
  });
});