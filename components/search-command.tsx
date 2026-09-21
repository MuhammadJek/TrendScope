import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchCommand({ defaultValue = "", name = "q" }: { defaultValue?: string; name?: string }) {
  return (
    <label className="relative block">
      <span className="sr-only">Search</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <Input name={name} defaultValue={defaultValue} placeholder="Search products, categories, or creators" className="pl-10" />
    </label>
  );
}
