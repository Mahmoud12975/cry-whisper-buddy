
import { CryAnalysisResult, CryType, cryTypeInfo } from "./cryTypes";

// Dummy implementation for demo purposes
// In a real app, this would connect to a trained model
export const analyzeAudio = async (audioFile: File | Blob): Promise<CryAnalysisResult> => {
  console.log("Analyzing audio file:", audioFile);
  
  // For demo, we'll simulate analysis by generating random results
  // In production, this would use a real ML model (e.g., via TensorFlow.js)
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Generate a weighted random result
      const types: CryType[] = ['hunger', 'pain', 'sleepy', 'discomfort', 'diaper'];
      
      // Select a primary type for the demo
      const primaryIndex = Math.floor(Math.random() * types.length);
      const primaryType = types[primaryIndex];
      
      // Generate confidence scores with primary type having highest confidence
      const distribution: Record<CryType, number> = {} as Record<CryType, number>;
      let totalOthers = 0;
      
      // Give primary type 50-80% confidence
      const primaryConfidence = 0.5 + Math.random() * 0.3;
      distribution[primaryType] = primaryConfidence;
      
      // Distribute remaining probability among other types
      const remainingConfidence = 1 - primaryConfidence;
      
      types.forEach(type => {
        if (type !== primaryType) {
          const typeConfidence = remainingConfidence * Math.random();
          distribution[type] = typeConfidence;
          totalOthers += typeConfidence;
        }
      });
      
      // Normalize other values to sum to remainingConfidence
      types.forEach(type => {
        if (type !== primaryType) {
          distribution[type] = (distribution[type] / totalOthers) * remainingConfidence;
        }
      });
      
      // Generate explanation based on the primary type
      const explanation = getExplanation(primaryType, distribution[primaryType]);
      
      resolve({
        primaryType,
        confidence: distribution[primaryType],
        distribution,
        explanation
      });
    }, 2000); // Simulate 2 second analysis time
  });
};

const getExplanation = (type: CryType, confidence: number): string => {
  const info = cryTypeInfo[type];
  const confidenceLevel = confidence > 0.75 ? "high" : confidence > 0.6 ? "moderate" : "possible";
  
  return `This cry shows ${confidenceLevel} indicators of a ${info.title.toLowerCase()} cry. ${
    info.description} I detected ${
    info.characteristics[Math.floor(Math.random() * info.characteristics.length)].toLowerCase()
  } which is typically associated with this type of cry.`;
};

export const generateRandomAudioLevel = (level: number = 0.5): number[] => {
  // Generate 10 random values for visualizer bars
  return Array(10).fill(0).map(() => {
    return Math.max(0.1, Math.min(1, level * (0.5 + Math.random())));
  });
};
