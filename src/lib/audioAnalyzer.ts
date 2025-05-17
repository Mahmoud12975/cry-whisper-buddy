
import { CryAnalysisResult, CryType, cryTypeInfo } from "./cryTypes";

// Enhanced dummy implementation with better audio feature extraction simulation
export const analyzeAudio = async (audioFile: File | Blob): Promise<CryAnalysisResult> => {
  console.log("Analyzing audio file:", audioFile);
  
  // For demonstration purposes, we'll simulate analysis with a more sophisticated approach
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Get audio duration if possible to affect the analysis (more realistic)
      const simulateAudioFeatures = async () => {
        try {
          // Try to extract some basic properties from the audio file to make analysis more believable
          const audioURL = URL.createObjectURL(audioFile);
          const audio = new Audio();
          audio.src = audioURL;
          
          // Wait for metadata to load
          await new Promise<void>((metaResolve) => {
            audio.onloadedmetadata = () => metaResolve();
            audio.onerror = () => metaResolve(); // Continue even if we can't load metadata
          });
          
          const duration = audio.duration || 10; // Default to 10 seconds if can't determine
          
          // Use duration to influence the "analysis"
          // Shorter clips tend toward "hungry" or "discomfort" (immediate needs)
          // Longer clips tend toward more complex needs like "tired" or "lonely"
          return { duration };
        } catch (error) {
          console.log("Could not analyze audio properties:", error);
          return { duration: 10 }; // Default fallback
        }
      };
      
      simulateAudioFeatures().then(({ duration }) => {
        // Select cry types with weighted probabilities based on audio "features"
        const types: CryType[] = ['hungry', 'belly_pain', 'tired', 'discomfort', 'cold_hot', 'lonely'];
        
        // Weight distribution based on simulated audio properties
        let weights;
        if (duration < 5) {
          // Short cries tend to be immediate needs
          weights = [0.3, 0.25, 0.1, 0.2, 0.1, 0.05]; // Higher chance of hungry/pain
        } else if (duration < 10) {
          // Medium cries more balanced
          weights = [0.2, 0.2, 0.2, 0.2, 0.1, 0.1];
        } else {
          // Longer cries tend toward tired/lonely
          weights = [0.15, 0.1, 0.3, 0.15, 0.1, 0.2]; // Higher chance of tired/lonely
        }
        
        // Use weighted random selection to pick the primary type
        const primaryType = weightedRandomSelection(types, weights);
        
        // Generate confidence scores with primary type having highest confidence
        const distribution: Record<CryType, number> = {} as Record<CryType, number>;
        
        // Initialize all cry types with zero confidence
        Object.keys(cryTypeInfo).forEach(type => {
          distribution[type as CryType] = 0;
        });
        
        // Give primary type 50-80% confidence
        const primaryConfidence = 0.5 + Math.random() * 0.3;
        distribution[primaryType] = primaryConfidence;
        
        // Distribute remaining probability among other selected types
        const remainingConfidence = 1 - primaryConfidence;
        let totalAssigned = 0;
        
        // Choose 2-4 secondary types to have non-zero probabilities
        const secondaryCount = 2 + Math.floor(Math.random() * 3);
        const secondaryTypes = types
          .filter(type => type !== primaryType)
          .sort(() => Math.random() - 0.5)
          .slice(0, secondaryCount);
        
        secondaryTypes.forEach(type => {
          const typeConfidence = remainingConfidence * (Math.random() * 0.6 + 0.2); // 20-80% of remaining
          if (totalAssigned + typeConfidence > remainingConfidence) {
            distribution[type] = remainingConfidence - totalAssigned;
            totalAssigned = remainingConfidence;
          } else {
            distribution[type] = typeConfidence;
            totalAssigned += typeConfidence;
          }
        });
        
        // If we have any confidence left, add it to the last secondary type
        if (totalAssigned < remainingConfidence && secondaryTypes.length > 0) {
          distribution[secondaryTypes[secondaryTypes.length - 1]] += (remainingConfidence - totalAssigned);
        }
        
        // Generate explanation based on the primary type
        const explanation = getExplanation(primaryType, distribution[primaryType], duration);
        
        resolve({
          primaryType,
          confidence: distribution[primaryType],
          distribution,
          explanation
        });
      });
    }, 2000); // Simulate 2 second analysis time
  });
};

// Weighted random selection helper
const weightedRandomSelection = (items: any[], weights: number[]): any => {
  // Normalize weights if they don't sum to 1
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const normalizedWeights = weights.map(weight => weight / totalWeight);
  
  // Create cumulative weights
  const cumulativeWeights: number[] = [];
  let cumulative = 0;
  
  for (let i = 0; i < normalizedWeights.length; i++) {
    cumulative += normalizedWeights[i];
    cumulativeWeights.push(cumulative);
  }
  
  // Select based on random value
  const random = Math.random();
  for (let i = 0; i < cumulativeWeights.length; i++) {
    if (random <= cumulativeWeights[i]) {
      return items[i];
    }
  }
  
  // Fallback (should rarely happen)
  return items[0];
};

const getExplanation = (type: CryType, confidence: number, duration: number): string => {
  const info = cryTypeInfo[type];
  const confidenceLevel = confidence > 0.75 ? "high" : confidence > 0.6 ? "moderate" : "possible";
  
  // Select a characteristic that matches the analysis
  const characteristicIndex = Math.floor(Math.random() * info.characteristics.length);
  const characteristic = info.characteristics[characteristicIndex].toLowerCase();
  
  // More detailed explanation with audio "features"
  return `This ${duration.toFixed(1)}-second cry shows ${confidenceLevel} indicators of a ${info.title.toLowerCase()} cry. ${
    info.description} I detected ${characteristic} which is typically associated with this type of cry. ${
    confidence > 0.7 ? `You may want to try: ${info.caregiverTips[0].toLowerCase()}` : ""
  }`;
};

export const generateRandomAudioLevel = (level: number = 0.5): number[] => {
  // Generate 10 random values for visualizer bars
  return Array(10).fill(0).map(() => {
    return Math.max(0.1, Math.min(1, level * (0.5 + Math.random())));
  });
};
