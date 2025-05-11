
import { CryAnalysisResult, cryTypeInfo } from "@/lib/cryTypes";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, Volume2 } from "lucide-react";

interface ResultDisplayProps {
  result: CryAnalysisResult | null;
}

const ResultDisplay = ({ result }: ResultDisplayProps) => {
  if (!result) return null;
  
  const primaryInfo = cryTypeInfo[result.primaryType];
  const colorClass = `bg-${primaryInfo.color}`;
  
  const formatPercent = (val: number) => {
    return `${Math.round(val * 100)}%`;
  };
  
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className={`rounded-t-lg ${colorClass} bg-opacity-30`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Baby className="h-6 w-6" />
            <span>{primaryInfo.title}</span>
          </CardTitle>
          <div className="text-xl font-bold">{formatPercent(result.confidence)}</div>
        </div>
        <CardDescription className="text-foreground text-opacity-90 mt-1">
          {result.explanation}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">Analysis Confidence</h3>
          <div className="space-y-2">
            {Object.entries(result.distribution).sort((a, b) => b[1] - a[1]).map(([type, value]) => (
              <div key={type} className="flex items-center gap-2">
                <div className="w-24 text-sm">{cryTypeInfo[type as keyof typeof cryTypeInfo].title}</div>
                <Progress value={value * 100} className={`h-2 flex-1 bg-${cryTypeInfo[type as keyof typeof cryTypeInfo].color}-light`} />
                <div className="w-12 text-right text-sm">{formatPercent(value)}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Characteristics</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {primaryInfo.characteristics.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Caregiver Tips</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {primaryInfo.caregiverTips.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
