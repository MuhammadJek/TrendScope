import { Badge } from "@/components/ui/badge";
import type { Platform } from "@/lib/types";

const platformTone: Record<Platform, "indigo" | "teal" | "rose" | "slate"> = {
  "Digital Marketplace": "indigo",
  "E-Commerce": "teal",
  TikTok: "rose",
  "Envato": "slate",
};

export function DataSourceBadge({ platform }: { platform: Platform }) {
  return <Badge tone={platformTone[platform]}>{platform}</Badge>;
}
