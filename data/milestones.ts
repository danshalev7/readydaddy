import type { Milestone } from '../types';

export const MILESTONES: Milestone[] = [
    {
        id: 'first-heartbeat-detected',
        name: "First Heartbeat Detected",
        description: "The first time you see or hear the baby's heartbeat on an ultrasound.",
        preparationTips: [
            "Prepare for an emotional moment. It can be surprisingly powerful.",
            "The heartbeat will be very fast (120-160 bpm), which is normal.",
            "Ask the technician if you can record the sound on your phone."
        ],
        week: 6,
        category: 'Medical',
        fatherSignificance: "This is often the moment pregnancy becomes undeniably real. The abstract idea of a baby transforms into a living being with a tangible, audible sign of life. It's a profound bonding experience.",
        emotionalGuidance: "You might feel a rush of protectiveness, overwhelming joy, or even a bit of shock. All these feelings are valid. Allow yourself to be present in the moment and share your feelings with your partner.",
        celebrationPrompt: "How did hearing that tiny, rapid heartbeat for the first time make you feel?"
    },
    {
        id: 'first-trimester-complete',
        name: "First Trimester Complete",
        description: "You've successfully navigated the first 13 weeks, a major milestone after which the risk of miscarriage drops significantly.",
        preparationTips: [
            "Plan how you'll share the news more widely, if you haven't already.",
            "Prepare for your partner's energy to return and plan some activities together.",
            "Reflect on the challenges of the first trimester and how you've grown as a team."
        ],
        week: 13,
        category: 'Social',
        fatherSignificance: "This milestone often brings a huge sense of relief. You've been a key support system during a physically and emotionally challenging time. It's a moment to celebrate your resilience as a couple and look forward to the 'honeymoon' phase of pregnancy.",
        emotionalGuidance: "Feelings of relief and excitement are common. It's a great time to reconnect with your partner now that she's likely feeling better. Acknowledge the hard work you've both put in.",
        celebrationPrompt: "What was the biggest challenge you overcame together in the first trimester?"
    },
    {
        id: 'anatomy-scan',
        name: "The Anatomy Scan",
        description: "A detailed ultrasound around 20 weeks that checks the baby's physical development from head to toe.",
        preparationTips: [
            "This can be a long appointment, so clear your schedule.",
            "Decide beforehand if you want to find out the baby's sex.",
            "Prepare a few questions for the sonographer, but know they may not be able to answer everything."
        ],
        week: 20,
        category: 'Medical',
        fatherSignificance: "This is your first detailed look at your baby. You'll see tiny fingers, toes, and facial features. It's a chance to confirm the baby's health and, for many, to bond by seeing them as a complete little person.",
        emotionalGuidance: "It's normal to feel a mix of excitement and anxiety. The level of detail can be amazing but also nerve-wracking. Your calm presence is a huge support for your partner during this scan.",
        celebrationPrompt: "What was the most amazing thing you saw during the anatomy scan?"
    },
    {
        id: 'viability-week',
        name: "Viability Week",
        description: "Reaching the week (around 24 weeks) where the baby has a chance of survival if born prematurely.",
        preparationTips: [
            "Understand that this is a medical milestone; the goal is still a full-term pregnancy.",
            "Take a moment to appreciate how far you've come.",
            "This is a good time to review your hospital's NICU capabilities, just in case."
        ],
        week: 24,
        category: 'Medical',
        fatherSignificance: "Viability provides a significant psychological safety net. It marks a shift from 'if' to 'when' for many fathers, solidifying the reality that you are going to meet this baby. It's a testament to the incredible development that's taken place.",
        emotionalGuidance: "This can bring a profound sense of relief. It's okay to feel a weight lift off your shoulders. Use this milestone to fuel your excitement for the final trimester.",
        celebrationPrompt: "How does reaching this safety milestone change your perspective on the pregnancy?"
    },
    {
        id: 'packing-hospital-bag',
        name: "Pack the Go-Bag",
        description: "Getting your hospital bags packed and ready for the big day.",
        preparationTips: [
            "Pack your own bag too! Include snacks, a charger, and a change of clothes.",
            "Install the baby's car seat and have it inspected.",
            "Keep the bags in the car or by the door for a quick exit."
        ],
        week: 36,
        category: 'Preparation',
        fatherSignificance: "This is a tangible, hands-on task that makes the impending birth feel very real. Taking the lead on this preparation demonstrates your readiness and helps reduce last-minute stress. You're preparing the logistics for one of the most important days of your life.",
        emotionalGuidance: "You might feel a surge of nervous energy or a sense of calm from being prepared. It's a practical step that has a big emotional impact, signaling that the wait is almost over.",
        celebrationPrompt: "What's the one 'must-have' item you packed in your own go-bag?"
    }
];
