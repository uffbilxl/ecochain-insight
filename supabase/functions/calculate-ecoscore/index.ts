import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SupplyChainData {
  supplierName: string;
  country: string;
  transportMode: string;
  distance: number;
  materialType: string;
  quantity: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: SupplyChainData = await req.json();
    console.log('Received supply chain data:', data);

    // Calculate carbon emissions based on transport mode (kg CO2 per km per ton)
    const transportEmissionFactors: Record<string, number> = {
      'truck': 0.062,
      'ship': 0.008,
      'train': 0.022,
      'air': 0.602,
    };

    // Material carbon intensity (kg CO2 per kg of material)
    const materialEmissionFactors: Record<string, number> = {
      'plastic': 3.5,
      'metal': 2.8,
      'wood': 0.5,
      'textile': 2.1,
      'glass': 1.2,
      'paper': 1.8,
    };

    // Calculate transportation emissions
    const transportFactor = transportEmissionFactors[data.transportMode.toLowerCase()] || 0.062;
    const transportationEmissions = (data.distance * data.quantity * transportFactor) / 1000;

    // Calculate material emissions
    const materialFactor = materialEmissionFactors[data.materialType.toLowerCase()] || 2.0;
    const materialEmissions = (data.quantity * materialFactor) / 1000;

    // Total carbon emissions
    const totalCarbonEmissions = transportationEmissions + materialEmissions;

    // Calculate supplier risk based on country (simplified risk assessment)
    const highRiskCountries = ['china', 'india', 'bangladesh', 'vietnam', 'indonesia'];
    const mediumRiskCountries = ['mexico', 'brazil', 'thailand', 'turkey', 'poland'];
    
    const countryLower = data.country.toLowerCase();
    let supplierRisk = 'low';
    let riskScore = 90;

    if (highRiskCountries.includes(countryLower)) {
      supplierRisk = 'high';
      riskScore = 40;
    } else if (mediumRiskCountries.includes(countryLower)) {
      supplierRisk = 'medium';
      riskScore = 65;
    }

    // Calculate overall risk level
    const emissionRisk = totalCarbonEmissions > 50 ? 'high' : totalCarbonEmissions > 20 ? 'medium' : 'low';
    const distanceRisk = data.distance > 5000 ? 'high' : data.distance > 2000 ? 'medium' : 'low';

    // Calculate EcoScore (0-100, higher is better)
    let ecoScore = 100;
    
    // Deduct points for emissions
    ecoScore -= Math.min(totalCarbonEmissions * 0.5, 40);
    
    // Deduct points for distance
    ecoScore -= Math.min(data.distance / 200, 20);
    
    // Deduct points for supplier risk
    if (supplierRisk === 'high') ecoScore -= 20;
    else if (supplierRisk === 'medium') ecoScore -= 10;
    
    // Deduct points for air transport (most polluting)
    if (data.transportMode.toLowerCase() === 'air') ecoScore -= 15;
    
    // Ensure score is between 0 and 100
    ecoScore = Math.max(0, Math.min(100, Math.round(ecoScore)));

    // Determine overall risk level
    let overallRiskLevel = 'low';
    if (ecoScore < 40) overallRiskLevel = 'high';
    else if (ecoScore < 70) overallRiskLevel = 'medium';

    const response = {
      ecoScore,
      carbonEmissions: Math.round(totalCarbonEmissions * 10) / 10,
      riskLevel: overallRiskLevel,
      details: {
        transportation: Math.round(transportationEmissions * 10) / 10,
        materials: Math.round(materialEmissions * 10) / 10,
        supplierRisk,
        distanceRisk,
        emissionRisk,
        supplierScore: riskScore,
      },
      recommendations: generateRecommendations(data, ecoScore, supplierRisk),
    };

    console.log('Calculated EcoScore response:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in calculate-ecoscore function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: 'Failed to calculate EcoScore. Please check your input data.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function generateRecommendations(
  data: SupplyChainData, 
  ecoScore: number, 
  supplierRisk: string
): string[] {
  const recommendations: string[] = [];

  if (data.transportMode.toLowerCase() === 'air') {
    recommendations.push('Consider switching to sea or rail transport to reduce emissions by up to 90%');
  }

  if (data.distance > 5000) {
    recommendations.push('Look for local suppliers to significantly reduce transportation emissions');
  }

  if (supplierRisk === 'high') {
    recommendations.push('Conduct supplier sustainability audit and consider diversifying supply sources');
  }

  if (ecoScore < 50) {
    recommendations.push('Implement carbon offset programs for your supply chain');
  }

  if (data.materialType.toLowerCase() === 'plastic') {
    recommendations.push('Explore recycled or bio-based alternative materials');
  }

  if (recommendations.length === 0) {
    recommendations.push('Great job! Continue monitoring and optimizing your supply chain');
  }

  return recommendations;
}