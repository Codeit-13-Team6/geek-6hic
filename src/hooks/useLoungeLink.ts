import { useState, DragEvent } from "react";
import { getOgData } from "@/api/client/og";
import { ToastCommon } from "@/components/ui/ToastCommon";
import { LinkItem } from "@/types";
import axios, { AxiosError } from "axios";

export const useLoungeLink = () => {
  const [linkList, setLinkList] = useState<LinkItem[]>([]);
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // 1. 링크 추가 (OG 데이터 페치)
  const addLink = async (linkUrl: string) => {
    if (!linkUrl.trim()) {
      return ToastCommon({ message: "링크를 입력해주세요.", size: "sm" });
    }

    setIsLoading(true);
    try {
      const result = await getOgData(linkUrl);
      const newLink: LinkItem = {
        id: crypto.randomUUID(),
        title: result.title || "제목 없음",
        url: result.url || linkUrl,
        image: result.image || "",
      };

      setLinkList((prev) => {
        const newList = [...prev, newLink];
        // 현재 썸네일이 없을 때 이미지가 있는 링크가 들어오면 무조건 첫 썸네일로 등록
        if (!thumbnailImage && newLink.image) {
          setThumbnailImage(newLink.image);
        }
        return newList;
      });

      return true; // 성공 시 입력창 비우기 용도
    } catch (error) {
      console.error("OG Fetch Error:", error);

      // 일단은 axios error 아니면 바로 자르긴하는데 문제되면 그냥 error any 로 하고 받기
      if (!axios.isAxiosError(error)) return false;

      const status = error.response?.status;
      let errorMessage = "링크 정보를 가져올 수 없습니다.";

      if (status === 403 || status === 502) {
        errorMessage = "보안 정책상 미리보기를 제공하지 않는 사이트입니다.";
        const fallbackLink = {
          id: crypto.randomUUID(),
          title: "미리보기를 지원하지 않는 링크",
          image: "",
          url: linkUrl,
        };
        setLinkList((prev) => [...prev, fallbackLink]);
        return true; // 입력창을 비울 수 있게 true 반환
      } else if (status === 404) {
        errorMessage = "존재하지 않거나 삭제된 페이지입니다.";
      }
      ToastCommon({ message: errorMessage, size: "sm" });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 링크 삭제
  const removeLink = (id: string) => {
    const targetLink = linkList.find((link) => link.id === id);
    setLinkList((prev) => prev.filter((link) => link.id !== id));

    // 삭제한 게 대표 썸네일이었다면 초기화
    if (targetLink?.image === thumbnailImage) {
      setThumbnailImage(null);
    }
  };

  // 3. 대표 썸네일 선택
  const selectThumbnail = (imageUrl: string) => {
    if (!imageUrl) return;
    setThumbnailImage(imageUrl);
    ToastCommon({ message: "대표 썸네일로 설정되었습니다.", size: "sm" });
  };

  // 4. 드래그 앤 드롭 핸들러
  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = "move";
    (e.currentTarget as HTMLElement).style.opacity = "0.5";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;

    const newList = [...linkList];
    const draggedItem = newList[draggingIndex];
    newList.splice(draggingIndex, 1);
    newList.splice(index, 0, draggedItem);

    setDraggingIndex(index);
    setLinkList(newList);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    setDraggingIndex(null);
    (e.currentTarget as HTMLElement).style.opacity = "1";
  };

  return {
    linkList,
    thumbnailImage,
    isLoading,
    draggingIndex,
    addLink,
    removeLink,
    selectThumbnail,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    setLinkList,
    setThumbnailImage,
  };
};
