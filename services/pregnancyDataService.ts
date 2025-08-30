import type { AggregatedWeekData, FetalDevelopment, MaternalChanges, MedicalExplanation, WeeklyCard } from '../types';

let fetalDevelopment: FetalDevelopment[] = [];
let maternalChanges: MaternalChanges[] = [];
let medicalExplanations: MedicalExplanation[] = [];
let weeklyCards: WeeklyCard[] = [];

let initializationPromise: Promise<void> | null = null;

async function loadData() {
    try {
        const [
            fetalDevelopmentRes,
            maternalChangesRes,
            medicalExplanationsRes,
            weeklyCardsRes
        ] = await Promise.all([
            fetch('./data/fetal_system_development.json'),
            fetch('./data/maternal_changes_timeline.json'),
            fetch('./data/medical_explanations_reference.json'),
            fetch('./data/weekly_pregnancy_cards_content.json')
        ]);

        if (!fetalDevelopmentRes.ok || !maternalChangesRes.ok || !medicalExplanationsRes.ok || !weeklyCardsRes.ok) {
            console.error('Failed to fetch one or more data files.');
            throw new Error('Failed to fetch pregnancy data');
        }

        const [fetalData, maternalData, medicalData, weeklyData] = await Promise.all([
            fetalDevelopmentRes.json(),
            maternalChangesRes.json(),
            medicalExplanationsRes.json(),
            weeklyCardsRes.json()
        ]);

        fetalDevelopment = fetalData as FetalDevelopment[];
        maternalChanges = maternalData as MaternalChanges[];
        medicalExplanations = medicalData as MedicalExplanation[];
        weeklyCards = weeklyData as WeeklyCard[];
    } catch (error) {
        console.error("Error loading pregnancy data:", error);
        throw error;
    }
}

function initialize(): Promise<void> {
    if (!initializationPromise) {
        initializationPromise = loadData();
    }
    return initializationPromise;
}

export class PregnancyDataService {
  
  static async getWeeklyContent(week: number): Promise<AggregatedWeekData> {
    await initialize();
    try {
      const weekStr = week.toString();
      
      // FIX: Ensure week is compared as a string, as `item.week` can be a number or string.
      const fetal = fetalDevelopment.filter(item => item.week.toString() === weekStr);
      const maternal = maternalChanges.find(item => item.week === weekStr) || null;
      const medical = medicalExplanations.filter(item => {
        if (!item.week_range) return false;
        
        if (item.week_range.includes('-')) {
          const [start, end] = item.week_range.split('-').map(Number);
          return week >= start && week <= end;
        } else {
          return parseInt(item.week_range) === week;
        }
      });
      const card = weeklyCards.find(item => item.week.toString() === weekStr) || null;

      const hasData = !!(fetal.length || maternal || medical.length || card);

      return {
        week: week,
        fetalDevelopment: fetal,
        maternalChanges: maternal,
        medicalInfo: medical,
        weeklyCard: card,
        hasData,
      };
    } catch (error) {
      console.error(`Error processing data for week ${week}:`, error);
      return {
        week: week,
        fetalDevelopment: [],
        maternalChanges: null,
        medicalInfo: [],
        weeklyCard: null,
        hasData: false,
        error: (error as Error).message
      };
    }
  }
}