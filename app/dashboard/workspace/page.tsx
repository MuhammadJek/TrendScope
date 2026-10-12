import { getActiveWorkspace } from "@/lib/workspace-actions";
import { Users, Building, Mail, ShieldAlert } from "lucide-react";
import InviteMemberModal from "@/components/InviteMemberModal";
import RemoveMemberButton from "@/components/RemoveMemberButton";
import { AppFrame } from "@/components/app-frame";

export default async function WorkspacePage() {
  const workspace = await getActiveWorkspace();

  return (
    <AppFrame title="Workspace & Team">
      <div className="max-w-5xl mx-auto space-y-8 pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
              <Building className="w-8 h-8 text-slate-400" />
              {workspace.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Kelola tim dan akses untuk workspace Anda.
            </p>
          </div>
          <div>
            <InviteMemberModal workspaceId={workspace.id} />
          </div>
        </div>

        {/* Stats/Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm">
            <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400 mb-3">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Total Anggota</span>
            </div>
            <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {workspace.members.length}
            </p>
          </div>
          
          {/* Placeholder for future features */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2.5 text-slate-400 mb-3">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-sm font-medium">Akses Keamanan</span>
            </div>
            <p className="text-sm text-slate-500">
              Dikelola oleh Owner & Admin
            </p>
          </div>
        </div>

        {/* Team Members Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Anggota Tim</h2>
            <p className="text-sm text-slate-500 mt-1">Daftar pengguna yang memiliki akses ke workspace ini.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Pengguna</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {workspace.members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                        {member.user.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      {member.user.name}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5" />
                        {member.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[11px] font-medium rounded-full border ${
                        member.role === 'OWNER' 
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                          : member.role === 'ADMIN'
                          ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                          : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {member.role !== 'OWNER' && (
                        <RemoveMemberButton workspaceId={workspace.id} userId={member.userId} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

