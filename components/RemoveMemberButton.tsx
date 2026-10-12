"use client";

import { useTransition } from "react";
import { removeMemberAction } from "@/lib/workspace-actions";
import { Trash2 } from "lucide-react";

export default function RemoveMemberButton({ workspaceId, userId }: { workspaceId: string, userId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus member ini dari workspace?")) return;

    startTransition(async () => {
      try {
        const res = await removeMemberAction(workspaceId, userId);
        if (!res.success) {
          alert(res.message);
        }
      } catch (err: any) {
        alert(err.message || "Gagal menghapus member.");
      }
    });
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
      title="Hapus Member"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

