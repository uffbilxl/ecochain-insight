import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface FormData {
  supplierName: string;
  country: string;
  transportMode: string;
  distance: string;
  materialType: string;
  quantity: string;
}

interface SupplyChainFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export const SupplyChainForm = ({ onSubmit, isLoading }: SupplyChainFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    supplierName: "",
    country: "",
    transportMode: "",
    distance: "",
    materialType: "",
    quantity: "",
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = Object.values(formData).every((value) => value !== "");

  return (
    <Card className="shadow-eco border-primary/20 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Supply Chain Input</CardTitle>
        <CardDescription>Enter your supply chain data to calculate the EcoScore</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplierName">Supplier Name</Label>
              <Input
                id="supplierName"
                placeholder="e.g., Green Materials Co."
                value={formData.supplierName}
                onChange={(e) => handleChange("supplierName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="e.g., Germany"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transportMode">Transportation Mode</Label>
              <Select value={formData.transportMode} onValueChange={(value) => handleChange("transportMode", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="ship">Ship</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                  <SelectItem value="air">Air</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km)</Label>
              <Input
                id="distance"
                type="number"
                placeholder="e.g., 2500"
                value={formData.distance}
                onChange={(e) => handleChange("distance", e.target.value)}
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="materialType">Material Type</Label>
              <Select value={formData.materialType} onValueChange={(value) => handleChange("materialType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plastic">Plastic</SelectItem>
                  <SelectItem value="metal">Metal</SelectItem>
                  <SelectItem value="wood">Wood</SelectItem>
                  <SelectItem value="textile">Textile</SelectItem>
                  <SelectItem value="glass">Glass</SelectItem>
                  <SelectItem value="paper">Paper</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (kg)</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="e.g., 1000"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                required
                min="0"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary hover:opacity-90 transition-smooth font-semibold"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              "Calculate EcoScore"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};