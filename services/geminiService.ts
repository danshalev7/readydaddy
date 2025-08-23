import { GoogleGenAI, Type } from "@google/genai";
import type { WeekData, UserProfile, Milestone } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const weekDataSchema = {
    type: Type.OBJECT,
    properties: {
        week: { type: Type.INTEGER },
        trimester: { type: Type.INTEGER },
        babySize: {
            type: Type.OBJECT,
            properties: {
                inches: { type: Type.NUMBER },
                grams: { type: Type.NUMBER },
                comparisonObject: { type: Type.STRING, description: "A relatable object for size comparison (e.g., 'an apple seed')." },
            },
            required: ["inches", "grams", "comparisonObject"],
        },
        fetalSystems: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the organ system." },
                    status: { type: Type.STRING, description: "Status of development: 'Forming', 'Developing', or 'Functional'." },
                    fatherFriendlyExplanation: { type: Type.STRING },
                    clinicalSignificance: { type: Type.STRING },
                    whyThisMatters: { type: Type.STRING },
                },
                required: ["name", "status", "fatherFriendlyExplanation", "clinicalSignificance", "whyThisMatters"],
            },
        },
        didYouKnowFact: { type: Type.STRING, description: "An interesting scientific fact about this week's development." },
        maternalChanges: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    symptom: { type: Type.STRING },
                    timeline: { type: Type.STRING, description: "When this symptom is most common." },
                    fatherActionItem: { type: Type.STRING, description: "A concrete action the father can take to help." },
                    isWarningSign: { type: Type.BOOLEAN },
                },
                required: ["symptom", "timeline", "fatherActionItem", "isWarningSign"],
            },
        },
        medicalGuidance: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    topic: { type: Type.STRING, description: "Medical topic for the week (e.g., 'Glucose Screening')." },
                    simplifiedExplanation: { type: Type.STRING },
                    detailedExplanation: { type: Type.STRING },
                    fatherAdvocacyScript: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Questions or statements for the father to use at appointments." },
                },
                required: ["topic", "simplifiedExplanation", "detailedExplanation", "fatherAdvocacyScript"],
            },
        },
        warningSigns: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of critical warning signs for this week that require immediate medical attention.",
        },
        paternalGuidance: {
            type: Type.OBJECT,
            properties: {
                paternalChanges: { type: Type.STRING, description: "Common emotional or psychological changes for the father." },
                bondingOpportunity: { type: Type.STRING },
                actionableTasks: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["paternalChanges", "bondingOpportunity", "actionableTasks"],
        },
    },
    required: ["week", "trimester", "babySize", "fetalSystems", "didYouKnowFact", "maternalChanges", "medicalGuidance", "warningSigns", "paternalGuidance"],
};

export const getWeekData = async (week: number, profile: UserProfile): Promise<WeekData> => {
    const cacheKey = `week_${week}_data_v2`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    try {
        const toneInstruction = 'The tone should be supportive, informative, and empowering for a first-time father. It should be sincere and playful, never condescending.';

        const prompt = `Generate a comprehensive, medically accurate, and father-centric guide for week ${week} of pregnancy. ${toneInstruction} The user's partner is named ${profile.partnerName}; refer to her by name where appropriate to make the content personal. Structure the output as a single JSON object adhering to the provided schema.

The guide must integrate four key areas:
1.  **Fetal Development:** Detail the baby's growth, including organ systems. Explain the clinical significance and why it matters to the dad.
2.  **Maternal Changes:** Describe ${profile.partnerName}'s physical and emotional changes. Provide concrete, actionable support tips for the father. Differentiate between normal symptoms and warning signs.
3.  **Medical Guidance:** Offer simplified and detailed explanations of relevant medical tests or topics. Include advocacy scripts for the father to support ${profile.partnerName} at appointments.
4.  **Father-Specific Experience:** Address the father's own emotional journey, provide unique bonding opportunities, and list actionable tasks for him.

Ensure all content is interconnected. For example, connect a maternal symptom to a fetal development milestone and explain how the father's support impacts both. Provide specific data for baby size in inches and grams. Identify critical warning signs that require immediate medical attention.`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: weekDataSchema,
            },
        });

        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString) as WeekData;
        
        localStorage.setItem(cacheKey, JSON.stringify(data));
        return data;

    } catch (error) {
        console.error(`Error fetching data for week ${week}:`, error);
        // Return a default object with an error message instead of throwing
        return {
            week,
            trimester: Math.ceil(week / 13),
            babySize: { inches: 0, grams: 0, comparisonObject: '...' },
            fetalSystems: [],
            didYouKnowFact: '',
            maternalChanges: [],
            medicalGuidance: [],
            warningSigns: [],
            paternalGuidance: { paternalChanges: '', bondingOpportunity: '', actionableTasks: [] },
            error: `We couldn't load the guide for week ${week}. Please check your connection and try again.`
        } as WeekData;
    }
};

export const refreshWeekData = (week: number, profile: UserProfile) => {
    const cacheKey = `week_${week}_data_v2`;
    localStorage.removeItem(cacheKey);
    return getWeekData(week, profile);
}

const milestoneSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: "A unique slug-style ID for the milestone, e.g., 'first-heartbeat-detected'." },
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            preparationTips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Actionable preparation tips and expectation setting for the father." },
            week: { type: Type.INTEGER, description: "The week this milestone typically occurs." },
            category: { type: Type.STRING, description: "Can be 'Medical', 'Preparation', or 'Social'." },
            fatherSignificance: { type: Type.STRING, description: "Detailed explanation of why this milestone is significant for the father." },
            emotionalGuidance: { type: Type.STRING, description: "Guidance for the father on navigating the emotions of this milestone." },
            celebrationPrompt: { type: Type.STRING, description: "A prompt to encourage the user to save a memory, e.g., 'How did hearing the heartbeat make you feel?'" }
        },
        required: ["id", "name", "description", "preparationTips", "week", "category", "fatherSignificance", "emotionalGuidance", "celebrationPrompt"],
    }
};

export const getPregnancyMilestones = async (profile: UserProfile): Promise<Milestone[]> => {
    const cacheKey = `pregnancy_milestones_v2`; // Bumped version for new schema
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    try {
        const prompt = `Generate a list of key pregnancy milestones for a first-time father. His partner's name is ${profile.partnerName}. For each milestone, provide:
1.  A unique slug-style 'id' (e.g., 'first-heartbeat-detected', 'anatomy-scan', 'viability-week').
2.  The 'name' of the milestone.
3.  A short 'description'.
4.  'preparationTips': 2-3 actionable preparation tips and expectation-setting points for the father.
5.  The typical 'week' it occurs.
6.  A 'category': 'Medical', 'Preparation', or 'Social'.
7.  'fatherSignificance': A detailed explanation of why this moment is particularly significant for the dad.
8.  'emotionalGuidance': Tips for navigating the specific emotions he might feel.
9.  'celebrationPrompt': A reflective question to encourage him to save a memory, like 'What did it feel like to see your baby for the first time?'.
Structure the output as a single JSON object adhering to the provided schema. Include major medical events like 'First Heartbeat Detected' (id: 'first-heartbeat-detected'), 'Anatomy Scan' (id: 'anatomy-scan'), and 'Viability Week' (id: 'viability-week'). Ensure a good mix of categories throughout the pregnancy.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: milestoneSchema,
            },
        });

        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString) as Milestone[];
        localStorage.setItem(cacheKey, JSON.stringify(data));
        return data;

    } catch (error) {
        console.error(`Error fetching pregnancy milestones:`, error);
        throw new Error(`Failed to get pregnancy milestones.`);
    }
};

export const getFinalCountdownTip = async (day: number, profile: UserProfile): Promise<{ tip: string }> => {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `final_tip_${day}_${today}`;
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    try {
        const prompt = `Generate a single, concise, and actionable daily preparation tip for a first-time father who is ${day} days away from his partner's due date. His partner's name is ${profile.partnerName}. The tone should be calm, supportive, and practical. Return as a single JSON object with one key "tip". For example: {"tip": "Your tip here."}`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tip: { type: Type.STRING }
                    },
                    required: ["tip"]
                }
            },
        });
        
        const jsonString = response.text.trim();
        const data = JSON.parse(jsonString);
        localStorage.setItem(cacheKey, JSON.stringify(data));
        return data;

    } catch (error) {
        console.error(`Error fetching final countdown tip for day ${day}:`, error);
        return { tip: "Take a moment to relax with your partner. A calm environment is best for everyone." };
    }
};