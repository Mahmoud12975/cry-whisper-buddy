export type CryType =
  | 'hungry'
  | 'belly_pain'
  | 'burping'
  | 'discomfort'
  | 'cold_hot'
  | 'laugh'
  | 'lonely'
  | 'noise'
  | 'scared'
  | 'silence'
  | 'tired';

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
  hungry: {
    title: "Hungry",
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
  belly_pain: {
    title: "Belly Pain",
    description: "Sudden, high-pitched, intense cry with little build-up and minimal pauses.",
    characteristics: [
      "High-pitched, piercing quality",
      "Sudden onset without warning",
      "Sustained intensity with few breaks",
      "May be accompanied by physical tension"
    ],
    caregiverTips: [
      "Check for signs of gas or constipation",
      "Gently massage the belly in circular motions",
      "Bicycle baby's legs to release gas",
      "Consult a healthcare provider if pain persists"
    ],
    color: "baby-pink"
  },
  burping: {
    title: "Needs Burping",
    description: "Fussy, squirmy cry that often follows feeding and includes discomfort signals.",
    characteristics: [
      "Intermittent crying with grunting",
      "Squirming or arching of the back",
      "More common after feeding",
      "May include spit-up or gas release"
    ],
    caregiverTips: [
      "Hold baby upright and gently pat the back",
      "Try different burping positions (shoulder, seated, face-down on lap)",
      "Pause feeding to burp midway",
      "Avoid overfeeding"
    ],
    color: "light-yellow"
  },
  discomfort: {
    title: "General Discomfort",
    description: "Varied pitch with grunting sounds, often changing when position is altered.",
    characteristics: [
      "Variable pitch with occasional grunts",
      "Changes intensity with movement",
      "Intermittent rather than continuous",
      "Often stops when position changes"
    ],
    caregiverTips: [
      "Check for uncomfortable clothing or positions",
      "Look for hair wrapped around fingers or toes",
      "Change baby's position or location",
      "Offer gentle massage or skin-to-skin contact"
    ],
    color: "light-blue"
  },
  cold_hot: {
    title: "Too Cold or Too Hot",
    description: "Agitated cry with squirming, fussing, and discomfort due to temperature.",
    characteristics: [
      "Fussy, restless cry",
      "Baby may feel too warm or too cold to touch",
      "Facial expression shows discomfort",
      "May calm down after adjusting clothing"
    ],
    caregiverTips: [
      "Check the room temperature",
      "Feel baby's neck or back for sweat or coldness",
      "Adjust layers of clothing or blankets",
      "Avoid overdressing indoors"
    ],
    color: "light-teal"
  },
  laugh: {
    title: "Laughing or Happy Sounds",
    description: "Joyful vocalizations that may sound like rhythmic giggles or excited coos.",
    characteristics: [
      "Rhythmic, melodic sounds",
      "Often associated with play or interaction",
      "Facial expression is smiling or excited",
      "No signs of distress or discomfort"
    ],
    caregiverTips: [
      "Engage in play and respond warmly",
      "Encourage interaction with toys or faces",
      "Maintain eye contact and smile back",
      "Use this time to bond and stimulate the baby"
    ],
    color: "mint-green"
  },
  lonely: {
    title: "Feeling Lonely",
    description: "Soft, intermittent cry that escalates if ignored, seeking attention or presence.",
    characteristics: [
      "Mild crying that intensifies over time",
      "Often starts with whining or fussing",
      "Stops when picked up or comforted",
      "Occurs when alone or after quiet time"
    ],
    caregiverTips: [
      "Hold or talk to your baby",
      "Provide skin-to-skin contact",
      "Use gentle rocking or carry the baby",
      "Stay near the baby during quiet play"
    ],
    color: "peach"
  },
  noise: {
    title: "Sensitive to Noise",
    description: "Startled or fussy crying triggered by sudden or loud environmental sounds.",
    characteristics: [
      "Abrupt cry following loud noises",
      "Startle reflex may be observed",
      "Crying may stop once the noise ceases",
      "Often includes wide eyes or flailing arms"
    ],
    caregiverTips: [
      "Minimize sudden loud noises near the baby",
      "Create a quieter environment",
      "Use white noise to soothe and mask background noise",
      "Comfort baby if startled"
    ],
    color: "grey-light"
  },
  scared: {
    title: "Fear or Anxiety",
    description: "High-pitched cry often following a new or threatening experience.",
    characteristics: [
      "Sharp, intense cry",
      "May include trembling or stiff body posture",
      "Crying starts suddenly after a trigger",
      "Baby seeks comfort from caregiver"
    ],
    caregiverTips: [
      "Hold the baby close and reassure gently",
      "Avoid overwhelming stimuli",
      "Use calming tones and physical touch",
      "Gradually introduce new experiences"
    ],
    color: "light-orange"
  },
  silence: {
    title: "Unusual Silence",
    description: "A quiet, withdrawn state that may indicate fatigue, sadness, or illness.",
    characteristics: [
      "Absence of usual vocalizations",
      "Lack of movement or eye contact",
      "Appears unusually passive",
      "May signal sleepiness or illness"
    ],
    caregiverTips: [
      "Monitor for signs of illness or fatigue",
      "Encourage gentle interaction",
      "Create a comforting, familiar environment",
      "Consult a pediatrician if concerned"
    ],
    color: "light-grey"
  },
  tired: {
    title: "Tired or Sleepy",
    description: "Whiny, intermittent cry that builds and fades, often with yawning and eye-rubbing.",
    characteristics: [
      "Low-energy, fussy cry",
      "Yawning and rubbing eyes",
      "Cranky behavior and lack of focus",
      "May resist sleep even when overtired"
    ],
    caregiverTips: [
      "Create a calm, dimly lit environment",
      "Establish a consistent sleep routine",
      "Swaddle younger babies if appropriate",
      "Use gentle motion like rocking or swaying"
    ],
    color: "baby-purple"
  }
};
