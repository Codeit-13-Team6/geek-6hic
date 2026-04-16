import { ReactNode } from "react";
import { getSessionUser } from "@/lib/auth/sessionUser.server";
import { MemberProvider } from "@/providers/MemberProvider";
import { Gnb } from "@/components/layout/Gnb";

interface GnbSessionShellProps {
  children: ReactNode;
}

export default async function GnbSessionShell({
  children,
}: GnbSessionShellProps) {
  const initialUser = await getSessionUser();

  return (
    <MemberProvider initialUser={initialUser}>
      <Gnb initialUser={initialUser} />
      {children}
    </MemberProvider>
  );
}
