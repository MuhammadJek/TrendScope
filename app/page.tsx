import Link from "next/link";
import { auth } from "@/auth";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  LineChart,
  PackageSearch,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Video,
} from "lucide-react";
import { CategoryDistributionChart, ProductRankingChart, TrendChart } from "@/components/charts";
import { DemoDataBanner } from "@/components/demo-data-banner";
import { SearchCommand } from "@/components/search-command";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/services";

const features = [
  { title: "Product Discovery", icon: PackageSearch, text: "Explore demo products across normalized categories and sources." },
  { title: "Ranking", icon: BarChart3, text: "Compare available metrics without implying unsupported cross-platform parity." },
  { title: "Trend Monitoring", icon: LineChart, text: "Track fictional category movement from clearly labeled sample signals." },
  { title: "Price Intelligence", icon: ShoppingBag, text: "Separate observed prices from estimates and unavailable fields." },
  { title: "Source Transparency", icon: ShieldCheck, text: "Inspect source references, timestamps, and metric status." },
];

const steps = ["Collect", "Normalize", "Analyze", "Discover"];

export default async function Home() {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const dashboard = getDashboardData();

  return (
    <main className="bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <section className="relative isolate min-h-[92vh] overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-35" aria-hidden="true">
          <div className="absolute left-[8%] top-24 h-48 w-80 rounded-xl border border-white/15 bg-white/10 p-4 shadow-2xl">
            <div className="h-3 w-28 rounded bg-white/30" />
            <div className="mt-8 flex h-24 items-end gap-3">
              {[44, 72, 56, 88, 64, 96].map((height, index) => (
                <span key={index} className="w-8 rounded-t bg-teal-300/80" style={{ height }} />
              ))}
            </div>
          </div>
          <div className="absolute right-[10%] top-20 h-64 w-[30rem] rounded-xl border border-white/15 bg-white/10 p-5 shadow-2xl">
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-20 rounded-lg bg-white/15" />
              ))}
            </div>
            <div className="mt-5 h-24 rounded-lg border border-white/15 bg-slate-900/70" />
          </div>
          <div className="absolute bottom-10 left-[22%] h-48 w-[34rem] rounded-xl border border-white/15 bg-white/10 p-5 shadow-2xl">
            <div className="space-y-3">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-amber-300/70" />
                  <span className="h-3 flex-1 rounded bg-white/25" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sm font-bold text-slate-950">TS</span>
            <span className="font-semibold">TrendScope</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
            <Link href="/products" className="hover:text-white">Products</Link>
            <Link href="/rankings" className="hover:text-white">Rankings</Link>
            <Link href="/pricing" className="hover:text-white">Pricing</Link>
          </nav>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button href="/dashboard" variant="secondary" size="sm">
                Open dashboard
              </Button>
            ) : (
              <>
                <Button href="/login" variant="secondary" size="sm">
                  Sign in
                </Button>
                <Button href="/register" size="sm">
                  Get started
                </Button>
              </>
            )}
          </div>
        </header>
        <div className="relative z-10 mx-auto flex min-h-[calc(92vh-5rem)] max-w-7xl flex-col justify-center px-4 pb-20 pt-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-teal-100">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Multi-platform product analytics prototype
            </span>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              Discover What Is Trending Across Digital Marketplaces
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              TrendScope helps teams explore product trends, rankings, prices, and authorized public metrics across marketplaces, e-commerce sources, and TikTok-style content signals.
            </p>
            <form action="/products" className="mt-8 max-w-2xl rounded-xl bg-white p-2 shadow-2xl">
              <div className="flex flex-col gap-2 sm:flex-row">
                <SearchCommand />
                <Button type="submit" className="shrink-0">
                  Search
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </form>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button href="/trends" variant="accent">Explore Trends</Button>
              <Button href="/dashboard" variant="secondary">View Dashboard</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <DemoDataBanner />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { title: "Digital Marketplaces", icon: Database, text: "Templates, plugins, and creative assets with source-aware metadata." },
            { title: "E-Commerce", icon: ShoppingBag, text: "Product catalog, price, category, and feed freshness signals." },
            { title: "TikTok", icon: Video, text: "Authorized creator/content metrics with unavailable fields clearly marked." },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.title}>
                <CardHeader>
                  <Icon className="h-5 w-5 text-teal-700" aria-hidden="true" />
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.text}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-16 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold">Analytics preview</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">A dashboard-oriented workspace for scanning movement, source health, and ranked demo records.</p>
            <div className="mt-8 grid gap-4">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-teal-700 shadow-sm dark:bg-slate-950">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="font-semibold">{feature.title}</p>
                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{feature.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Trend overview</CardTitle>
              </CardHeader>
              <CardContent><TrendChart data={dashboard.trendSeries} /></CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2">
              <Card><CardContent className="p-5"><ProductRankingChart products={dashboard.products} /></CardContent></Card>
              <Card><CardContent className="p-5"><CategoryDistributionChart data={dashboard.categoryShares} /></CardContent></Card>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-semibold">How it works</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-4">
              {steps.map((step, index) => (
                <div key={step} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                  <span className="text-sm font-semibold text-teal-700">0{index + 1}</span>
                  <p className="mt-3 font-semibold">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <Card>
            <CardHeader>
              <CheckCircle2 className="h-5 w-5 text-teal-700" aria-hidden="true" />
              <CardTitle>Source permissions vary</CardTitle>
              <CardDescription>TrendScope marks data availability and methodology so teams can tell observed facts from estimates, placeholders, or inaccessible fields.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-12 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {["Free", "Pro", "Business"].map((plan) => (
            <Card key={plan}>
              <CardHeader>
                <CardTitle>{plan}</CardTitle>
                <CardDescription>Placeholder pricing for prototype validation.</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
        TrendScope demo prototype. No live marketplace integrations are included.
      </footer>
    </main>
  );
}
