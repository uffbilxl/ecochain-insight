import { useState } from "react";
import { SupplyChainForm } from "@/components/SupplyChainForm";
import { EcoScoreDisplay } from "@/components/EcoScoreDisplay";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Leaf, Sparkles } from "lucide-react";

interface FormData {
  supplierName: string;
  country: string;
  transportMode: string;
  distance: string;
  materialType: string;
  quantity: string;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [ecoScoreData, setEcoScoreData] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setEcoScoreData(null);

    try {
      const { data, error } = await supabase.functions.invoke("calculate-ecoscore", {
        body: {
          supplierName: formData.supplierName,
          country: formData.country,
          transportMode: formData.transportMode,
          distance: parseFloat(formData.distance),
          materialType: formData.materialType,
          quantity: parseFloat(formData.quantity),
        },
      });

      if (error) throw error;

      setEcoScoreData(data);
      toast({
        title: "EcoScore Calculated",
        description: `Your supply chain scored ${data.ecoScore}/100`,
      });
    } catch (error) {
      console.error("Error calculating EcoScore:", error);
      toast({
        title: "Calculation Failed",
        description: "Failed to calculate EcoScore. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-eco">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">EcoChain</h1>
              <p className="text-sm text-muted-foreground">Supply Chain Sustainability Tracker</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Sustainability Analysis</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Track Your Supply Chain's
            <br />
            <span className="gradient-primary bg-clip-text text-transparent">Environmental Impact</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your EcoScore and get actionable insights to make your supply chain more sustainable
          </p>
        </div>

        {/* Form and Results */}
        <div className="max-w-6xl mx-auto space-y-8">
          <SupplyChainForm onSubmit={handleSubmit} isLoading={isLoading} />
          {ecoScoreData && <EcoScoreDisplay data={ecoScoreData} />}
        </div>

        {/* Features Section */}
        {!ecoScoreData && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-eco transition-smooth">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Carbon Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Accurate CO₂ emission calculations based on real transportation and material data
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-eco transition-smooth">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Risk Assessment</h3>
              <p className="text-sm text-muted-foreground">
                Evaluate supplier and logistics risks to identify areas for improvement
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-eco transition-smooth">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Get personalized suggestions to reduce emissions and improve sustainability
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 EcoChain. Building a sustainable future, one supply chain at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;