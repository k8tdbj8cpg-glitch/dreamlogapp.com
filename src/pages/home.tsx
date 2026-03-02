import { Footer } from "@/src/components/footer";
import { Header } from "@/src/components/header";

export function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <h1 className="font-bold text-4xl">Welcome to DreamLogApp</h1>
        <p className="max-w-prose text-center text-muted-foreground">
          Your AI-powered dream journal. Start logging your dreams and discover
          patterns with the help of artificial intelligence.
        </p>
      </main>
      <Footer />
    </div>
  );
}
