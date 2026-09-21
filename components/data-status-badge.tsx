import type { DataStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const statusTone: Record<DataStatus, "teal" | "amber" | "rose" | "slate"> = {
  Observed: "teal",
  Estimated: "amber",
  Unavailable: "rose",
  Demo: "slate",
};

export function DataStatusBadge({ status }: { status: DataStatus }) {
  return <Badge tone={statusTone[status]}>{status}</Badge>;
}
