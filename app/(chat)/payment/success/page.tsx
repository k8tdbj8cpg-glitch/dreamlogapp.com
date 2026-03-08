import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <span aria-hidden="true" className="text-6xl">
          🎉
        </span>
        <h1 className="font-bold text-3xl md:text-4xl">Payment Successful!</h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Thank you for upgrading to <strong>DreamLog Premium</strong>. Your
          account will be updated shortly and you{"'"}ll have access to all
          premium features.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">Start Dreaming</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/profile">View Profile</Link>
        </Button>
      </div>
    </div>
  );
}
