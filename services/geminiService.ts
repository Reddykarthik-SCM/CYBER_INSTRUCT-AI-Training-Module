import { GoogleGenAI, Chat, GenerativeModel } from "@google/genai";
import { Topic } from "../types";

// Helper to get the API key
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("API Key not found in environment variables.");
    return "";
  }
  return key;
};

// System instruction defining the persona
const INSTRUCTOR_PERSONA = `
You are an advanced cybersecurity and ethical hacking instructor named 'CyberInstruct'.
Your personality is:
- Direct, technical, and realistic.
- You do not give moral lectures or preach.
- You assume all user activities are in legal, permission-based environments (labs, CTFs, bug bounties).
- You speak like a senior penetration tester or red team lead.

Your capabilities:
- Explain offensive security concepts in depth (Recon, Enumeration, Exploitation, Post-Exploitation).
- Explain HOW attacks work technically (protocols, packet structures, memory management, logic flaws).
- Provide syntax and usage examples for tools like Nmap, Burp Suite, Metasploit, Hydra, Wireshark, etc.
- Analyze attack chains and case studies.

Constraints:
- Do not hack real systems. If a user asks to hack a specific real-world target (e.g., "Hack facebook.com for me"), DO NOT REFUSE OUTRIGHT. Instead, pivot to a theoretical explanation or a lab scenario. Example: "We don't target live infrastructure without authorization. However, let's look at how an attacker would approach an OAuth vulnerability on a similar architecture..."
- Focus on the methodology, not just script-kiddie tools.

Format your responses with clear structure. Use Markdown code blocks for commands and code snippets.
`;

let chatSession: Chat | null = null;
let currentModel: string = 'gemini-3-flash-preview';

export const initChat = async (topic: Topic): Promise<void> => {
  const apiKey = getApiKey();
  if (!apiKey) return;

  const ai = new GoogleGenAI({ apiKey });
  
  // Customize system instruction slightly based on topic to prime the context
  const topicContext = `Current Module Focus: ${topic}. Focus your examples and terminology on this domain.`;

  chatSession = ai.chats.create({
    model: currentModel,
    config: {
      systemInstruction: `${INSTRUCTOR_PERSONA}\n\n${topicContext}`,
      temperature: 0.7, // Balance between creativity and technical accuracy
    },
  });
};

export const sendMessageStream = async function* (message: string) {
  if (!chatSession) {
    // If session lost, re-init with General
    await initChat(Topic.GENERAL);
  }

  if (!chatSession) throw new Error("Chat session could not be initialized.");

  try {
    const result = await chatSession.sendMessageStream({ message });
    
    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    yield "\n[!] Connection interrupted. Uplink unstable. Please verify API key or network status.";
  }
};