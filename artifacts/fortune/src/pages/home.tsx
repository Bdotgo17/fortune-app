import { useState } from "react";
import { MoonStar, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const PRICING_OPTIONS = [
  { amountCents: 100, label: "$1.00", description: "A simple glimpse" },
  { amountCents: 200, label: "$2.00", description: "A clearer path" },
  { amountCents: 500, label: "$5.00", description: "A deep revelation" },
  { amountCents: 1000, label: "$10.00", description: "The profound truth" },
];

export default function Home() {
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleReveal = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/fortune/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amountCents: selectedAmount }),
      });

      if (!response.ok) {
        throw new Error("Failed to initialize checkout.");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "The spirits are restless",
        description: "We could not connect to the ethereal plane. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in zoom-in duration-700 w-full">
      <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/5">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <MoonStar className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="font-serif text-3xl font-normal tracking-wide text-primary-foreground drop-shadow-sm">Choose Your Fate</CardTitle>
            <CardDescription className="text-muted-foreground font-sans text-base">
              The universe requires a tribute to part the veil.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {PRICING_OPTIONS.map((option) => {
              const isSelected = selectedAmount === option.amountCents;
              return (
                <button
                  key={option.amountCents}
                  onClick={() => setSelectedAmount(option.amountCents)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(255,215,0,0.15)] scale-[1.02]"
                      : "border-border/50 bg-background/50 hover:border-primary/50 hover:bg-primary/5"
                  }`}
                  data-testid={`button-price-${option.amountCents}`}
                  disabled={isLoading}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-serif text-xl ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {option.label}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {option.description}
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-primary" : "border-muted"}`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="pt-6">
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
    </div>
  );
}
