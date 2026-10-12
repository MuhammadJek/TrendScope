import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CreditCard, Zap, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppFrame } from "@/components/app-frame";

// Constants for plan limits
const PLAN_LIMITS: Record<string, number> = {
  BASIC: 10,
  PRO_MONTHLY: 100,
  PRO_YEARLY: 100,
};

const PLAN_NAMES: Record<string, string> = {
  BASIC: "Basic Plan",
  PRO_MONTHLY: "Pro (Monthly)",
  PRO_YEARLY: "Pro (Yearly)",
};

export default async function BillingPage() {
  const session = await auth();
  const sessionUser = session?.user;
  
  if (!sessionUser || !sessionUser.id) {
    return <div>Unauthorized</div>;
  }

  // Get fresh user data from DB
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
  });

  if (!user) return <div>User not found</div>;

  const currentPlan = user.subscriptionPlan || "BASIC";
  const limit = PLAN_LIMITS[currentPlan] || 10;
  const used = user.monthlySearchesUsed || 0;
  const usagePercentage = Math.min(Math.round((used / limit) * 100), 100);
  
  const isNearLimit = usagePercentage >= 80;
  const isOverLimit = usagePercentage >= 100;

  // Mock billing history
  const billingHistory = [
    { id: "INV-001", date: "Oct 1, 2026", amount: "$0.00", status: "Paid", plan: "Basic Plan" },
    { id: "INV-002", date: "Sep 1, 2026", amount: "$0.00", status: "Paid", plan: "Basic Plan" },
  ];

  return (
    <AppFrame title="Billing & Plan">
      <div className="max-w-4xl mx-auto space-y-8 pb-10">
        {/* Header */}
        <div className="pb-6 border-b border-slate-100 dark:border-slate-800">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-slate-400" />
            Manajemen Penagihan
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Kelola paket langganan dan pantau penggunaan akun Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Plan Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Paket Aktif</p>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {PLAN_NAMES[currentPlan] || currentPlan}
                </h2>
              </div>
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full border border-emerald-200 dark:border-emerald-500/20">
                Active
              </span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 
                {limit} Pencarian per bulan
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 
                Akses ke Analitik TikTok & E-commerce
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 
                Workspace & Tim (Standard)
              </li>
            </ul>

            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md transition-all">
              <Zap className="w-4 h-4 mr-2" /> Upgrade Plan
            </Button>
          </div>

          {/* Usage Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Penggunaan Bulan Ini</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{used}</h2>
                  <span className="text-sm text-slate-500 dark:text-slate-400">/ {limit} pencarian</span>
                </div>
              </div>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                <ActivityIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm font-medium">
                <span className={isOverLimit ? "text-red-500" : isNearLimit ? "text-amber-500" : "text-slate-700 dark:text-slate-300"}>
                  {usagePercentage}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverLimit ? "bg-red-500" : isNearLimit ? "bg-amber-500" : "bg-indigo-500"
                  }`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            </div>

            {isNearLimit && (
              <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200 dark:border-amber-500/20">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  Anda hampir mencapai batas kuota bulanan. Upgrade paket untuk menghindari interupsi layanan.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Billing History Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#09090b] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Riwayat Penagihan</h2>
            <p className="text-sm text-slate-500 mt-1">Daftar invoice dan pembayaran Anda.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Invoice ID</th>
                  <th className="px-6 py-4 font-medium">Tanggal</th>
                  <th className="px-6 py-4 font-medium">Paket</th>
                  <th className="px-6 py-4 font-medium">Jumlah</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {billingHistory.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{inv.id}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{inv.date}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{inv.plan}</td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{inv.amount}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                        {inv.status}
                      </span>
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

function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

