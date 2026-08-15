import {
  Baby,
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  FileText,
  Gauge,
  HeartHandshake,
  Home,
  LayoutGrid,
  MessageCircle,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/shells/theme-toggle";
import { demoOrganization } from "@/lib/demo/data";

type NavItem = Readonly<{ href: Route; label: string; icon: LucideIcon }>;

const directorNav: readonly NavItem[] = [
  { href: "/today", label: "Today", icon: Gauge },
  { href: "/children", label: "Children", icon: Baby },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/rooms", label: "Rooms & schedule", icon: LayoutGrid },
  { href: "/families", label: "Families", icon: HeartHandshake },
  { href: "/staff", label: "Staff", icon: Users },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/incidents", label: "Safety", icon: ShieldCheck },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/documents", label: "Documents", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

const educatorNav: readonly NavItem[] = [
  { href: "/care-log", label: "Today", icon: Gauge },
  {
    href: "/rooms/44444444-4444-4444-8444-444444444441" as Route,
    label: "Room",
    icon: LayoutGrid,
  },
  { href: "/attendance", label: "Check in/out", icon: ClipboardCheck },
  { href: "/care-log", label: "Care log", icon: BookOpen },
  { href: "/incidents", label: "Incidents", icon: ShieldCheck },
  { href: "/families", label: "Messages", icon: MessageCircle },
  { href: "/documents", label: "More", icon: FileText },
];

const parentNav: readonly NavItem[] = [
  { href: "/parent", label: "Home", icon: Home },
  {
    href: "/parent/children/33333333-3333-4333-8333-333333333331" as Route,
    label: "Child timeline",
    icon: CalendarDays,
  },
  { href: "/parent/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/parent/messages", label: "Messages", icon: MessageCircle },
  { href: "/parent/invoices", label: "Invoices", icon: CreditCard },
  { href: "/parent/documents", label: "Documents", icon: FileText },
];

export function AppShell({
  children,
  mode = "director",
}: {
  children: ReactNode;
  mode?: "director" | "educator" | "parent";
}) {
  const nav = mode === "parent" ? parentNav : mode === "educator" ? educatorNav : directorNav;
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <aside className="sidebar" aria-label={`${mode} navigation`}>
        <Link
          className="brand-lockup"
          href={mode === "parent" ? "/parent" : mode === "educator" ? "/care-log" : "/today"}
        >
          <span className="brand-mark" aria-hidden="true">
            n
          </span>
          <span>
            <strong>NurtureOps</strong>
            <small>AI</small>
          </span>
        </Link>
        <div className="centre-switcher">
          <span>{demoOrganization.name}</span>
          <small>{demoOrganization.location.name}</small>
        </div>
        <nav>
          {nav.map(({ href, label, icon: Icon }) => (
            <Link href={href} key={label}>
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-foot">
          <Link href="/today#care-copilot">
            <Bot size={18} aria-hidden="true" />
            Care Copilot
          </Link>
          <p>Synthetic portfolio demo</p>
        </div>
      </aside>
      <section className="app-column">
        <div className="demo-banner" role="status">
          <span>DEMO</span>
          Synthetic identities only; no live payments, messages, or compliance claims
        </div>
        <header className="topbar">
          <div>
            <strong>
              {mode === "parent"
                ? "Family portal"
                : mode === "educator"
                  ? "Educator workspace"
                  : "Director workspace"}
            </strong>
            <span>Friday, August 14</span>
          </div>
          <div className="topbar-actions">
            <ThemeToggle />
            <button className="icon-button" type="button" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <div className="avatar" aria-label="Signed in as Jordan Lee">
              JL
            </div>
          </div>
        </header>
        <main id="main-content" className="main-content">
          {children}
        </main>
        <nav className="mobile-nav" aria-label="Mobile primary navigation">
          {(mode === "parent"
            ? parentNav.slice(0, 4)
            : mode === "educator"
              ? educatorNav.slice(0, 4)
              : directorNav.slice(0, 4)
          ).map(({ href, label, icon: Icon }) => (
            <Link href={href} key={label}>
              <Icon size={20} aria-hidden="true" />
              <span>{label.split(" ")[0]}</span>
            </Link>
          ))}
        </nav>
      </section>
    </div>
  );
}
