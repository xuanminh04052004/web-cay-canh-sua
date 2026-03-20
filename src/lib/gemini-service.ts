/**
 * Service to call backend API for Gemini 2.5 Flash
 * Supports both Flask backend (local) and serverless functions (deployment)
 */

// Auto-detect API URL based on environment
const getApiBaseUrl = () => {
  // If custom API URL is set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In production/deployment, use relative path for serverless functions
  // This works for both Vercel and Netlify
  if (import.meta.env.PROD) {
    return ''; // Use relative path - will hit serverless function
  }
  
  // Development: use Flask backend
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface LLMConfig {
  temperature?: number;
  maxTokens?: number;
}

/**
 * Call the Flask backend API to get AI response
 */
export async function callChatbotAPI(
  message: string,
  sessionId?: string
): Promise<{
  success: boolean;
  message: {
    id: string;
    sessionId: string;
    role: "assistant";
    content: string;
    timestamp: string | null;
    confidence: number;
  };
}> {
  const response = await fetch(`${API_BASE_URL}/api/chatbot/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      sessionId: sessionId || `session_${Date.now()}`,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

