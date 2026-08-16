import type { ReactNode } from "react";

import { AppShell } from "@/components/shells/app-shell";

export default function ParentLayout({ children }: { children: ReactNode }) {
  return <AppShell mode="parent">{children}</AppShell>;
}
