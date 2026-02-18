/**
 * Media Relations Service
 * Manages media contacts, journalist outreach, and media kit management
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface MediaContact {
  contactId: string;
  
  // Personal
  firstName: string;
  lastName: string;
  title: string;
  
  // Organization
  mediaOutlet: string;
  outletType: 'NEWSPAPER' | 'MAGAZINE' | 'TV' | 'RADIO' | 'ONLINE' | 'PODCAST' | 'AGENCY';
  beat: string[]; // Topics they cover
  
  // Contact
  email: string;
  phone?: string;
  socialMedia?: Record<string, string>;
  
  // Relationship
  relationshipStatus: 'COLD' | 'WARM' | 'HOT';
  lastContactDate?: Date;
  totalPitches: number;
  successfulPitches: number;
  
  // Reach
  estimatedReach: number;
  
  status: 'ACTIVE' | 'INACTIVE' | 'DO_NOT_CONTACT';
}

export interface MediaPitch {
  pitchId: string;
  
  // Content
  subject: string;
  pitchText: string;
  angle: string;
  
  // Target
  mediaContactId: string;
  contactName: string;
  mediaOutlet: string;
  
  // Story
  storyIdea: string;
  relevanceReason: string;
  
  // Assets
  attachments: string[];
  
  // Timing
  pitchDate: Date;
  followUpDate?: Date;
  
  // Response
  response?: 'INTERESTED' | 'NOT_INTERESTED' | 'MAYBE' | 'NO_RESPONSE';
  responseDate?: Date;
  responseNotes?: string;
  
  // Outcome
  coverageGenerated: boolean;
  coverageId?: string;
  
  status: 'DRAFTED' | 'SENT' | 'FOLLOW_UP' | 'ACCEPTED' | 'DECLINED' | 'NO_RESPONSE';
}

// ============================================================================
// Database Operations
// ============================================================================

export async function addMediaContact(
  _db: NeonHttpDatabase,
  _orgId: string,
  _contact: Omit<MediaContact, 'contactId' | 'totalPitches' | 'successfulPitches'>
): Promise<MediaContact> {
  // TODO: Add media contact
  throw new Error('Database integration pending');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function identifyTopJournalists(
  contacts: MediaContact[]
): Array<{ name: string; outlet: string; successRate: number; reach: number }> {
  return contacts
    .filter(c => c.totalPitches > 0)
    .map(c => ({
      name: `${c.firstName} ${c.lastName}`,
      outlet: c.mediaOutlet,
      successRate: (c.successfulPitches / c.totalPitches) * 100,
      reach: c.estimatedReach,
    }))
    .sort((a, b) => b.successRate - a.successRate)
    .slice(0, 20);
}
