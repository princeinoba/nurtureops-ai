import { WifiOff } from "lucide-react";

import { CareLogDemo } from "@/components/care/care-log-demo";
import { Callout, PageHeader } from "@/components/ui/primitives";

export default function CareLogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Educator - Willow Room"
        title="Daily care log"
        description="Record a structured event privately, review it, then explicitly publish a daily report."
      />
      <Callout title="Offline-safe structured drafts">
        <WifiOff size={15} /> Only minimum synthetic event fields are retained locally. Complete
        profiles and restricted notes are not cached.
      </Callout>
      <div style={{ height: 16 }} />
      <CareLogDemo />
    </>
  );
}
