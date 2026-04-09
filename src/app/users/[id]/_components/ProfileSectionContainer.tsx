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

  return <ProfileSection initialUser={profileUser} canEdit={canEdit} />;
}
