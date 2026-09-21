import { AppFrame } from "@/components/app-frame";
import { LoadingSkeleton } from "@/components/loading-skeleton";

export default function Loading() {
  return (
    <AppFrame title="Analytics Dashboard">
      <LoadingSkeleton />
    </AppFrame>
  );
}
