import type { ReactNode } from "react";

import { AppShell } from "@/components/shells/app-shell";

export default function EducatorLayout({ children }: { children: ReactNode }) {
  return <AppShell mode="educator">{children}</AppShell>;
}
