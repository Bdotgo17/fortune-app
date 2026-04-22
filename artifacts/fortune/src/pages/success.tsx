import { useEffect, useState } from "react";
import { useSearch, Link } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FortuneData {
  fortune: string;
  amountCents: number;
}

export default function Success() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const sessionId = searchParams.get("session_id");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FortuneData | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found. The spirits are confused.");
      setIsLoading(false);
      return;
    }

    const fetchFortune = async () => {
      try {
        const response = await fetch(`/api/fortune/reveal?session_id=${sessionId}`);
        if (!response.ok) {
          throw new Error("Failed to reveal fortune.");
        }
        const result = await response.json();
        setData({
          fortune: result.fortune,
          amountCents: result.amountCents,
        });
      } catch (err) {
        console.error(err);
        setError("The veil remains closed. We could not retrieve your fortune.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFortune();
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-20">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full w-20 h-20 animate-pulse" />
          <Sparkles className="w-12 h-12 text-primary animate-spin-slow relative z-10" />
        </div>
        <p className="font-serif text-xl text-primary animate-pulse tracking-widest text-center">
          The spirits are reading your destiny...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="border-destructive/30 bg-destructive/5 backdrop-blur-sm">
        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <h2 className="font-serif text-2xl text-destructive">A Disturbance</h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="pt-4">
            <Link href="/">
              <Button variant="outline" className="gap-2" data-testid="link-home">
                <ArrowLeft className="w-4 h-4" />
                Return to the Mortal Realm
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full flex flex-col items-center max-w-lg mx-auto relative">
      {/* Dramatic Reveal Background Glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[100px] rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full"
      >
        <Card className="border-primary/30 bg-card/90 backdrop-blur-md shadow-2xl shadow-primary/10 relative overflow-hidden">
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/50 opacity-50" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/50 opacity-50" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/50 opacity-50" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/50 opacity-50" />

          <CardContent className="p-8 md:p-12 flex flex-col items-center text-center space-y-8">
            <div className="w-16 h-1 px-4 border-t border-primary/30" />
            
            <motion.p 
              className="font-serif text-2xl md:text-3xl leading-relaxed text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 2 }}
              data-testid="text-fortune"
            >
              "{data.fortune}"
            </motion.p>

            <div className="w-16 h-1 px-4 border-t border-primary/30" />

            <motion.div 
              className="text-sm text-muted-foreground flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5, duration: 1 }}
            >
              <p>You paid ${(data.amountCents / 100).toFixed(2)} for this revelation.</p>
              <Link href="/">
                <Button variant="ghost" className="mt-4 border-primary/20 text-primary hover:bg-primary/10 transition-colors" data-testid="button-another">
                  Seek Another Truth
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
