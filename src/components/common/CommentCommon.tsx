import Image from "next/image";
import profileImg from "@/assets/img/profile/female1-m.jpg";

interface CommentCommonProps {
  name?: string;
  img?: string;
  date?: Date;
  content?: string;
}

export default function CommentCommon({
  name = "익명",
  img,
  date = new Date(),
  content = "",
}: CommentCommonProps) {
  return (
    <article className="flex flex-col py-[24px]">
      <div className="flex flex-row items-center gap-[6px] text-sm text-gray-500">
        <Image
          className="rounded-[24px]"
          src={img ?? profileImg}
          alt="프로필 이미지"
          width={24}
          height={24}
        />
        <p>{name}</p>
        <p>
          {date.getFullYear()}.{date.getMonth() + 1}.{date.getDate()}
        </p>
      </div>
      <div className="px-[2px] pt-[8px] text-lg text-gray-700">{content}</div>
    </article>
  );
}
