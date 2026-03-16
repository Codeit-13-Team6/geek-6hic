import LoungePostCard from "./LoungePostCard";

const MOCK_POSTS = [
  {
    id: 1,
    title: "제목1",
    content: "내용1",
    authorName: "작성자1",
    date: "2023-08-01",
    timeAgo: "1일",
    likeCount: 10,
    commentCount: 5,
    thumbnailUrl: null,
  },
];

export default function LoungePostList() {
  return (
    <div className="flex w-full flex-col rounded-[24px] bg-white px-6 py-2 shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:p-8">
      <div className="flex flex-col md:gap-12">
        {MOCK_POSTS.map((post) => (
          <LoungePostCard key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
}
