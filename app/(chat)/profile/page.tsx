import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/app/(auth)/auth";
import { UpgradeButton } from "@/components/upgrade-button";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12 md:px-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-3xl">Profile</h1>
        <p className="text-muted-foreground">Manage your DreamLog account</p>
      </div>

      <div className="flex items-center gap-4 rounded-xl border bg-card p-6">
        <Image
          alt={user.email ?? "User Avatar"}
          className="rounded-full"
          height={64}
          src={`https://avatar.vercel.sh/${user.email}`}
          width={64}
        />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-lg">{user.email}</p>
          <p className="capitalize text-muted-foreground text-sm">
            {user.type ?? "regular"} plan
          </p>
        </div>
      </div>

      {user.type !== "premium" && (
        <div className="flex flex-col gap-4 rounded-xl border bg-card p-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold text-xl">Upgrade to Premium</h2>
            <p className="text-muted-foreground text-sm">
              Unlock all premium features for a one-time payment of{" "}
              <strong>$29.99</strong>.
            </p>
          </div>
          <ul className="flex flex-col gap-2 text-sm">
            <li>✅ End-to-end encrypted dream entries</li>
            <li>✅ Advanced AI dream analysis</li>
            <li>✅ Unlimited dream history</li>
            <li>✅ Priority support</li>
          </ul>
          <div>
            <UpgradeButton />
          </div>
        </div>
      )}
    </div>
  );
}
