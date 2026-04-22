import { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-background text-foreground relative overflow-hidden">
      {/* Mystical Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-purple-900/20 blur-[150px] rounded-full" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="w-full relative z-10 py-6 px-6 flex items-center justify-center">
        <Link href="/" className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors group" data-testid="link-home">
          <Sparkles className="w-6 h-6 animate-pulse" />
          <h1 className="font-serif text-2xl font-bold tracking-widest uppercase">The Fortune Teller</h1>
          <Sparkles className="w-6 h-6 animate-pulse" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full relative z-10 py-8 px-6 text-center text-muted-foreground text-sm font-sans">
        <p>Seek the truth within the stars.</p>
      </footer>
    </div>
  );
}
