import { useState } from "react";
import { MoonStar, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [fortune, setFortune] = useState<string | null>(null);
  const { toast } = useToast();

  const handleReveal = async () => {
    setIsLoading(true);
    setFortune(null);
    try {
      const response = await fetch("/api/fortune/reveal");
      if (!response.ok) throw new Error("Failed to reveal fortune.");
      const data = await response.json();
      setFortune(data.fortune);
    } catch {
      toast({
        title: "The spirits are restless",
        description: "We could not part the veil. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in duration-700 w-full">
      <AnimatePresence mode="wait">
        {!fortune ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/5">
              <CardHeader className="text-center space-y-4 pb-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <MoonStar className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="font-serif text-3xl font-normal tracking-wide text-primary-foreground drop-shadow-sm">
                    Seek Your Fortune
                  </CardTitle>
                  <CardDescription className="text-muted-foreground font-sans text-base">
                    The universe has a message waiting for you.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardFooter className="pt-2">
                <Button
                  className="w-full font-serif text-lg py-6 tracking-wide shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] transition-all duration-500"
                  size="lg"
                  onClick={handleReveal}
                  disabled={isLoading}
                  data-testid="button-submit"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Parting the Veil...
                    </span>
                  ) : (
                    "Reveal My Fortune"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="fortune"
            className="w-full flex flex-col items-center max-w-lg mx-auto relative"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 blur-[100px] rounded-full pointer-events-none"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />

            <Card className="border-primary/30 bg-card/90 backdrop-blur-md shadow-2xl shadow-primary/10 relative overflow-hidden w-full">
              <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/50 opacity-50" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/50 opacity-50" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/50 opacity-50" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/50 opacity-50" />

              <CardContent className="p-8 md:p-12 flex flex-col items-center text-center space-y-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                >
                  <Sparkles className="w-10 h-10 text-primary" />
                </motion.div>

                <div className="w-16 h-px bg-primary/30" />

                <motion.p
                  className="font-serif text-2xl md:text-3xl leading-relaxed text-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 2 }}
                  data-testid="text-fortune"
                >
                  "{fortune}"
                </motion.p>

                <div className="w-16 h-px bg-primary/30" />

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.2, duration: 1 }}
                >
                  <Button
                    variant="ghost"
                    className="border border-primary/20 text-primary hover:bg-primary/10 transition-colors font-serif"
                    onClick={handleReveal}
                    disabled={isLoading}
                    data-testid="button-another"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Reading...
                      </span>
                    ) : (
                      "Seek Another Truth"
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
