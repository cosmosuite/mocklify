// AI Credits system using localStorage
const CREDITS_STORAGE_KEY = 'user_ai_credits_balance';
const INITIAL_CREDITS = 500; // Initial credits for new users
const CREDITS_PER_GENERATION = 100; // Credits needed per image generation

export async function getUserCreditsBalance(userId: string): Promise<number | null> {
  if (!userId) return null;
  
  try {
    const storedBalance = localStorage.getItem(`${CREDITS_STORAGE_KEY}_${userId}`);
    if (!storedBalance) {
      // Initialize with initial credits
      localStorage.setItem(`${CREDITS_STORAGE_KEY}_${userId}`, INITIAL_CREDITS.toString());
      return INITIAL_CREDITS;
    }
    return parseInt(storedBalance, 10);
  } catch (error) {
    console.error('Error getting credits balance:', error);
    return null;
  }
}

export async function useCredits(userId: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    const currentBalance = await getUserCreditsBalance(userId);
    if (currentBalance === null || currentBalance < CREDITS_PER_GENERATION) return false;
    
    localStorage.setItem(`${CREDITS_STORAGE_KEY}_${userId}`, (currentBalance - CREDITS_PER_GENERATION).toString());
    return true;
  } catch (error) {
    console.error('Error using credits:', error);
    return false;
  }
}

export async function addCredits(userId: string, amount: number): Promise<boolean> {
  if (!userId || amount <= 0) return false;
  
  try {
    const currentBalance = await getUserCreditsBalance(userId);
    if (currentBalance === null) return false;
    
    localStorage.setItem(`${CREDITS_STORAGE_KEY}_${userId}`, (currentBalance + amount).toString());
    return true;
  } catch (error) {
    console.error('Error adding credits:', error);
    return false;
  }
}

export const CREDITS_CONFIG = {
  INITIAL_CREDITS,
  CREDITS_PER_GENERATION
} as const;