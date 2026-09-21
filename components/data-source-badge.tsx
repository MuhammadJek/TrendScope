import { Badge } from "@/components/ui/badge";
import type { Platform } from "@/lib/types";

const platformTone: Record<Platform, "indigo" | "teal" | "rose"> = {
  "Digital Marketplace": "indigo",
  "E-Commerce": "teal",
  TikTok: "rose",
};

export function DataSourceBadge({ platform }: { platform: Platform }) {
  return <Badge tone={platformTone[platform]}>{platform}</Badge>;
}
