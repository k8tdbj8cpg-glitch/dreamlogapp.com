import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { DreamDashboard } from "@/components/dream-dashboard";
import {
  getDreamEntriesByUserId,
  getOrCreateUserStreak,
  getSleepDataByUserId,
  getUserBadges,
} from "@/lib/db/queries";

export const metadata = {
  title: "Dashboard | Dream Log",
  description: "Your sleep and dream analytics dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const [sleepData, dreamEntries, streak, badges] = await Promise.all([
    getSleepDataByUserId({ userId: session.user.id, limit: 14 }),
    getDreamEntriesByUserId({ userId: session.user.id, limit: 30 }),
    getOrCreateUserStreak({ userId: session.user.id }),
    getUserBadges({ userId: session.user.id }),
  ]);

  return (
    <DreamDashboard
      badges={badges}
      dreamEntries={dreamEntries}
      sleepData={sleepData}
      streak={streak}
    />
  );
}
