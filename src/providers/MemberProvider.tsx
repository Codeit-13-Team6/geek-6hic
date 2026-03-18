'use client';

import { useEffect } from 'react';

interface MemberProviderProps {
  children: React.ReactNode;
}

export function MemberProvider({ children }: MemberProviderProps) {
  return <>{children}</>;
}