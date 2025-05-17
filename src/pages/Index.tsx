
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Volume2, Baby, Info } from "lucide-react";
import { analyzeAudio } from "@/lib/audioAnalyzer";
import { CryAnalysisResult } from "@/lib/cryTypes";
import { toast } from "@/components/ui/sonner";
import AudioRecorder from "@/components/AudioRecorder";
import ResultDisplay from "@/components/ResultDisplay";
import InfoPanel from "@/components/InfoPanel";
import NavBar from "@/components/NavBar";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CryAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState("analyze");
  
  const handleAudioCaptured = async (audioData: Blob) => {
    try {
      setIsAnalyzing(true);
      setAnalysisResult(null);
      
      // In a real app, this would send the audio to a real model
      const result = await analyzeAudio(audioData);
      
      setAnalysisResult(result);
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Error analyzing audio. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-baby-blue-light/30 to-baby-purple-light/30">
      <NavBar currentPage="analyzer" />
      
      <div className="container mx-auto px-4 py-8 pt-20 max-w-4xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Volume2 className="h-8 w-8 text-baby-purple" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-baby-blue to-baby-purple">
              Baby Cry Analyzer
            </h1>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            Analyze your baby's cry to help identify what they need. 
            Record or upload an audio clip to get started.
          </p>
        </header>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full max-w-4xl mx-auto"
        >
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="analyze" className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <span>Analyze Cry</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Learn About Cries</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="analyze" className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <AudioRecorder 
                  onAudioCaptured={handleAudioCaptured} 
                  isAnalyzing={isAnalyzing} 
                />
              </CardContent>
            </Card>
            
            {(analysisResult || isAnalyzing) && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                {isAnalyzing ? (
                  <Card className="w-full max-w-lg mx-auto p-8">
                    <div className="flex flex-col items-center justify-center h-40 gap-4">
                      <div className="audio-visualizer recording-visualizer">
                        {Array(5).fill(0).map((_, i) => (
                          <div 
                            key={i}
                            className="bar h-full" 
                            style={{ animation: `wave-${i+1} 1s infinite ease-in-out` }} 
                          />
                        ))}
                      </div>
                      <p className="text-baby-purple font-medium animate-pulse">
                        Analyzing audio patterns...
                      </p>
                    </div>
                  </Card>
                ) : (
                  <ResultDisplay result={analysisResult} />
                )}
              </div>
            )}
            
            <Separator className="my-8" />
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Baby className="h-5 w-5 text-baby-pink" />
                <h2 className="text-xl font-medium">How It Works</h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Our analyzer uses advanced audio pattern recognition to identify key 
                characteristics in your baby's cry. It analyzes pitch, rhythm, intensity
                and other acoustic features to help determine what your baby might need.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="learn">
            <InfoPanel />
          </TabsContent>
        </Tabs>
        
        <footer className="mt-16 text-center text-xs text-muted-foreground">
          <p>Baby Cry Analyzer &copy; 2025 - For demonstration purposes only</p>
          <p className="mt-1">
            This tool is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
