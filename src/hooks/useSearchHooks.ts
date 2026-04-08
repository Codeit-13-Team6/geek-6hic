import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export const useSearchFilter = (queryKey: string = "keyword") => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentKeyword = searchParams.get(queryKey) || "";

  const [keyword, setKeyword] = useState(currentKeyword);

  // 뒤로가기/앞으로가기 시 주소창 값과 input 값을 동기화
  useEffect(() => {
    setKeyword(searchParams.get(queryKey) || "");
  }, [searchParams, queryKey]);

  const handleSearch = (searchWord: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchWord.trim()) {
      params.set(queryKey, searchWord.trim());
    } else {
      params.delete(queryKey);
    }

    // 주소창 변경 (페이지 전체 새로고침 없이 쿼리만 변경)
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return { keyword, setKeyword, handleSearch };
};
