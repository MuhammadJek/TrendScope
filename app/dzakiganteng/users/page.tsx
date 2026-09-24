import { redirect } from "next/navigation";
import { isSuperAdmin, superAdminLogout } from "@/lib/super-admin-auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Search, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AdminNav } from "@/components/admin-nav";
import { UserRow } from "./user-row";
import { AddUserDialog } from "./add-user-dialog";

export default async function SuperAdminUsersPage() {
  const authed = await isSuperAdmin();
  if (!authed) redirect("/dzakiganteng");

  // Fetch from the real PostgreSQL database via Prisma
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                Super Admin Dashboard
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage users and platform integrations.
              </p>
            </div>
          </div>
          <form action={async () => { "use server"; await superAdminLogout(); redirect("/dzakiganteng"); }}>
            <Button variant="ghost" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>

        <div className="mt-8">
          <AdminNav />

          <Card>
            <CardHeader className="border-b border-slate-200 bg-slate-50/50 pb-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Users</CardTitle>
                  <CardDescription>A list of all registered users in the database.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative hidden sm:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input type="search" placeholder="Search users..." className="w-64 pl-9" />
                  </div>
                  <AddUserDialog />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-semibold">Name</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Email</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Role</th>
                      <th scope="col" className="px-6 py-4 font-semibold">Joined</th>
                      <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {users.map((u) => (
                      <UserRow key={u.id} user={u} />
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          No users found. Users will appear here after they register on the platform.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

