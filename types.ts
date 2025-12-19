export enum Sender {
  USER = 'USER',
  AI = 'AI',
  SYSTEM = 'SYSTEM'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  isStreaming?: boolean;
}

export enum Topic {
  GENERAL = 'General Consultation',
  RECON = 'Reconnaissance & OSINT',
  WEB_EXPLOIT = 'Web Exploitation',
  NETWORK = 'Network Attacks',
  PRIV_ESC = 'Privilege Escalation',
  DEFENSE = 'Blue Team / Defense'
}

export interface ChatSession {
  id: string;
  topic: Topic;
  messages: Message[];
}

// Initial Greeting based on topic
export const TOPIC_GREETINGS: Record<Topic, string> = {
  [Topic.GENERAL]: "Session initialized. Ready for general security inquiry. What's your objective?",
  [Topic.RECON]: "Module: Reconnaissance. Target enumeration protocol active. Are we looking at passive OSINT or active scanning?",
  [Topic.WEB_EXPLOIT]: "Module: Web Exploitation. OWASP Top 10 vectors loaded. Input validation analysis ready. What's the target stack?",
  [Topic.NETWORK]: "Module: Network Security. L2/L3 protocols analysis. Man-in-the-Middle and lateral movement concepts available.",
  [Topic.PRIV_ESC]: "Module: Privilege Escalation. Checking for misconfigurations, weak permissions, and kernel exploits. Linux or Windows?",
  [Topic.DEFENSE]: "Module: Blue Team. Threat hunting and hardening protocols. Let's analyze the logs and secure the perimeter."
};