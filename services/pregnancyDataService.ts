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
      
      const fetal = fetalDevelopment.filter(item => item.week === weekStr);
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

  static async getAllWeeks(): Promise<AggregatedWeekData[]> {
    const weekPromises = Array.from({length: 40}, (_, i) => i + 1)
      .map(week => this.getWeeklyContent(week));
    const allData = await Promise.all(weekPromises);
    return allData.filter(weekData => weekData.hasData);
  }

  static async getSystemDevelopment(systemName: string): Promise<FetalDevelopment[]> {
    await initialize();
    try {
      return fetalDevelopment.filter(item => 
        item.system_name && 
        item.system_name.toLowerCase() === systemName.toLowerCase()
      ).sort((a, b) => parseInt(a.week) - parseInt(b.week));
    } catch (error) {
      console.error(`Error filtering by system ${systemName}:`, error);
      return [];
    }
  }

  static async getDevelopmentByStatus(status: 'Forming' | 'Developing' | 'Functional'): Promise<FetalDevelopment[]> {
    await initialize();
    try {
      return fetalDevelopment.filter(item =>
        item.status && 
        item.status.toLowerCase() === status.toLowerCase()
      ).sort((a, b) => parseInt(a.week) - parseInt(b.week));
    } catch (error) {
      console.error(`Error filtering by status ${status}:`, error);
      return [];
    }
  }

  static async getCriticalWindows(): Promise<FetalDevelopment[]> {
    await initialize();
    try {
      return fetalDevelopment.filter(item => 
        item.is_critical_window === true
      ).sort((a, b) => parseInt(a.week) - parseInt(b.week));
    } catch (error) {
      console.error('Error getting critical windows:', error);
      return [];
    }
  }

  static async searchMedicalTopics(query: string): Promise<MedicalExplanation[]> {
    await initialize();
    try {
      const searchTerm = query.toLowerCase();
      return medicalExplanations.filter(item =>
        (item.topic && item.topic.toLowerCase().includes(searchTerm)) ||
        (item.category && item.category.toLowerCase().includes(searchTerm)) ||
        (item.simplified_explanation && item.simplified_explanation.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error(`Error searching medical topics for "${query}":`, error);
      return [];
    }
  }

  static async validateData() {
    await initialize();
    const validation = {
      isValid: true,
      errors: [] as string[],
      summary: {
        fetalDevelopment: fetalDevelopment.length,
        maternalChanges: maternalChanges.length,
        medicalExplanations: medicalExplanations.length,
        weeklyCards: weeklyCards.length
      }
    };

    try {
      const essentialWeeks = [4, 8, 12, 20, 28, 37, 40];
      
      for (const week of essentialWeeks) {
        const weekData = await this.getWeeklyContent(week);
        if (!weekData.hasData) {
          validation.isValid = false;
          validation.errors.push(`Missing data for essential week ${week}`);
        }
      }

    } catch (error) {
      validation.isValid = false;
      validation.errors.push(`Data validation error: ${(error as Error).message}`);
    }

    if(validation.errors.length > 0) {
        console.warn("Data validation issues:", validation.errors);
    }

    return validation;
  }
}
