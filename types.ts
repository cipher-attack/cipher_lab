export enum ProjectType {
  // DASHBOARD Removed
  PHISHING = 'PHISHING',
  TERMINAL = 'TERMINAL',
  TOOLS = 'TOOLS', 
  ENCRYPTION = 'ENCRYPTION',
  SQL_INJECTION = 'SQL_INJECTION',
  FIREWALL = 'FIREWALL',
  STEGANOGRAPHY = 'STEGANOGRAPHY',
  DDOS = 'DDOS',
  KEYLOGGER = 'KEYLOGGER',
  XSS = 'XSS',
  BRUTE_FORCE = 'BRUTE_FORCE',
  NMAP = 'NMAP',
  MITM = 'MITM',
  RANSOMWARE = 'RANSOMWARE',
  OSINT = 'OSINT',
  BUFFER_OVERFLOW = 'BUFFER_OVERFLOW',
  FILE_UPLOAD = 'FILE_UPLOAD',
  REVERSE_ENGINEERING = 'REVERSE_ENGINEERING',
  ABOUT = 'ABOUT'
}

export interface ProjectInfo {
  id: ProjectType;
  title: string;
  description: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 data URI for the image
  timestamp: Date;
}