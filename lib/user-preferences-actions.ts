"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

import {
  UserDashboardPreferences,
  DEFAULT_PREFERENCES,
} from "./user-preferences-constants";

export type { UserDashboardPreferences };

export async function getUserDashboardPreferences(): Promise<UserDashboardPreferences> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return DEFAULT_PREFERENCES;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferences: true },
    });

    if (user?.preferences && typeof user.preferences === "object") {
      const prefs = user.preferences as Record<string, any>;
      return {
        country: typeof prefs.country === "string" ? prefs.country : DEFAULT_PREFERENCES.country,
        categories: Array.isArray(prefs.categories) && prefs.categories.length > 0 
          ? prefs.categories 
          : DEFAULT_PREFERENCES.categories,
        timeRange: (["24h", "7d", "30d", "90d"].includes(prefs.timeRange) 
          ? prefs.timeRange 
          : DEFAULT_PREFERENCES.timeRange) as "24h" | "7d" | "30d" | "90d",
        searchQuery: typeof prefs.searchQuery === "string" ? prefs.searchQuery : "",
      };
    }

    return DEFAULT_PREFERENCES;
  } catch (error) {
    console.error("Error loading user dashboard preferences:", error);
    return DEFAULT_PREFERENCES;
  }
}

export async function saveUserDashboardPreferences(
  newPreferences: Partial<UserDashboardPreferences>
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required to persist preferences." };
    }

    const current = await getUserDashboardPreferences();
    const updated: UserDashboardPreferences = {
      country: newPreferences.country ?? current.country,
      categories: newPreferences.categories && newPreferences.categories.length > 0 
        ? newPreferences.categories 
        : current.categories,
      timeRange: newPreferences.timeRange ?? current.timeRange,
      searchQuery: newPreferences.searchQuery !== undefined ? newPreferences.searchQuery : current.searchQuery,
    };

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        preferences: updated as any,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving user dashboard preferences:", error);
    return { success: false, error: error.message || "Failed to save preferences." };
  }
}
