import ProfileSection from "@/app/users/[id]/_components/ProfileSection";

type ProfileSectionUser = {
  id: number;
  teamId?: string;
  name: string;
  image: string | null;
  email: string;
  companyName: string;
} | null;

export default async function ProfileSectionContainer({
  profileUserPromise,
  canEdit,
}: {
  profileUserPromise: Promise<ProfileSectionUser>;
  canEdit: boolean;
}) {
  const profileUser = await profileUserPromise;

  return (
    <>
      <div className="mb-3 flex items-center gap-3 px-1 lg:mt-5">
        <div className="h-4 w-[2px] rounded-full bg-slate-950/20" />
        <h2 className="text-sm font-black tracking-[0.2em] text-slate-400 uppercase">
          User
        </h2>
      </div>
      <ProfileSection initialUser={profileUser} canEdit={canEdit} />
    </>
  );
}
