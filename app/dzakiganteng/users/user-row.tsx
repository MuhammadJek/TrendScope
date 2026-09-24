"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Shield, ShieldOff } from "lucide-react";
import { deleteUserAction, toggleUserRoleAction } from "./actions";

export function UserRow({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
      startTransition(async () => {
        await deleteUserAction(user.id);
      });
    }
  };

  const handleToggleRole = () => {
    startTransition(async () => {
      await toggleUserRoleAction(user.id, user.role);
    });
  };

  return (
    <tr className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors ${isPending ? "opacity-50" : ""}`}>
      <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-950 dark:text-slate-50">
        {user.name}
      </td>
      <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
      <td className="whitespace-nowrap px-6 py-4">
        <Badge tone={user.role === "SUPER_ADMIN" ? "teal" : user.role === "PRO_USER" ? "amber" : "slate"}>
          {user.role === "FREE_USER" ? "Biasa" : user.role === "PRO_USER" ? "Berbayar" : "Super Admin"}
        </Badge>
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-slate-500">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleToggleRole}
            disabled={isPending}
            title="Change Role"
          >
            {user.role === "SUPER_ADMIN" ? <ShieldOff className="h-4 w-4 text-teal-600" /> : <Shield className="h-4 w-4 text-slate-400" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete}
            disabled={isPending}
            className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

