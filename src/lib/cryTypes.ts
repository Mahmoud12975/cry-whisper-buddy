
export type CryType = 'hunger' | 'pain' | 'sleepy' | 'discomfort' | 'diaper';

export interface CryAnalysisResult {
  primaryType: CryType;
  confidence: number;
  distribution: Record<CryType, number>;
  explanation: string;
}

interface CryTypeInfo {
  title: string;
  description: string;
  characteristics: string[];
  caregiverTips: string[];
  color: string;
}

export const cryTypeInfo: Record<CryType, CryTypeInfo> = {
  hunger: {
    title: "Hunger",
    description: "Rhythmic, persistent cry that builds in intensity and may come in short bursts.",
    characteristics: [
      "Low-pitched, rhythmic pattern",
      "Builds gradually in intensity",
      "Often accompanied by rooting reflex or sucking motions",
      "May start and stop in short intervals"
    ],
    caregiverTips: [
      "Offer feeding promptly",
      "Check when baby last ate",
      "Look for hunger cues: rooting, sucking on fists",
      "Feed in a calm, quiet environment"
    ],
    color: "baby-blue"
  },
  pain: {
    title: "Pain",
    description: "Sudden, high-pitched, intense cry with little build-up and minimal pauses.",
    characteristics: [
      "High-pitched, piercing quality",
      "Sudden onset without warning",
      "Sustained intensity with few breaks",
      "May be accompanied by physical tension"
    ],
    caregiverTips: [
      "Check for physical causes (pins, tight clothing)",
      "Look for signs of illness (fever, swelling)",
      "Gently examine baby's body for reactions",
      "Consult healthcare provider if persistent"
    ],
    color: "baby-pink"
  },
  sleepy: {
    title: "Sleepiness",
    description: "Whiny, intermittent cry that builds and fades, often with yawning and eye-rubbing.",
    characteristics: [
      "Lower intensity, whiny quality",
      "Intermittent fading pattern",
      "Often accompanied by yawning or eye-rubbing",
      "May include fussiness or restlessness"
    ],
    caregiverTips: [
      "Create a calm, dimly lit environment",
      "Establish a consistent sleep routine",
      "Swaddle younger babies if appropriate",
      "Use gentle motion like rocking or swaying"
    ],
    color: "baby-purple"
  },
  discomfort: {
    title: "Discomfort",
    description: "Varied pitch with grunting sounds, often changing when position is altered.",
    characteristics: [
      "Variable pitch with occasional grunts",
      "Changes intensity with movement",
      "Intermittent rather than continuous",
      "Often stops when position changes"
    ],
    caregiverTips: [
      "Check room temperature (too hot/cold)",
      "Look for uncomfortable clothing or positions",
      "Change baby's position or location",
      "Offer gentle massage or movement"
    ],
    color: "baby-blue-light"
  },
  diaper: {
    title: "Diaper Change",
    description: "Agitated cry with squirming, often with specific facial expressions of disgust.",
    characteristics: [
      "Sharp, agitated sound quality",
      "Often accompanied by squirming",
      "May include specific facial expressions",
      "Frequently includes leg movement"
    ],
    caregiverTips: [
      "Check diaper for wetness or soiling",
      "Change diaper promptly and thoroughly",
      "Apply appropriate barrier cream if needed",
      "Check for signs of diaper rash"
    ],
    color: "baby-purple-light"
  }
};
