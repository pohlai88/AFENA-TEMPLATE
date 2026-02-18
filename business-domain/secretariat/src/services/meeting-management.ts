/**
 * Meeting Management Service
 * Handles board meetings, agendas, minutes, and attendance
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface BoardMeeting {
  meetingId: string;
  meetingNumber: string;
  
  // Classification
  meetingType: 'BOARD' | 'COMMITTEE' | 'SHAREHOLDERS' | 'EXTRAORDINARY';
  committeeName?: string;
  
  // Scheduling
  scheduledDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  isVirtual: boolean;
  
  // Participants
  attendees: MeetingAttendee[];
  quorumRequired: number;
  quorumMet: boolean;
  
  // Documentation
  agendaId?: string;
  minutesId?: string;
  resolutions: string[];
  
  // Status
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  actualStartTime?: Date;
  actualEndTime?: Date;
}

export interface MeetingAttendee {
  personId: string;
  name: string;
  role: 'CHAIRMAN' | 'DIRECTOR' | 'OBSERVER' | 'SECRETARY' | 'INVITEE';
  
  // Participation
  invitationSent: boolean;
  responseStatus: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'TENTATIVE';
  attendanceConfirmed: boolean;
  
  // Voting
  votingRights: boolean;
  proxy?: string;
  proxyHolder?: string;
}

export interface MeetingAgenda {
  agendaId: string;
  meetingId: string;
  
  issueDate: Date;
  items: AgendaItem[];
  
  // Distribution
  distributedTo: string[];
  distributionDate?: Date;
  
  status: 'DRAFT' | 'ISSUED' | 'REVISED';
}

export interface AgendaItem {
  itemNumber: string;
  title: string;
  description: string;
  
  // Presentation
  presenter?: string;
  estimatedDuration: number; // minutes
  
  // Supporting docs
  attachments: string[];
  
  // Action
  requiresResolution: boolean;
  requiresVoting: boolean;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function scheduleBoardMeeting(
  _db: NeonHttpDatabase,
  _orgId: string,
  _meeting: Omit<BoardMeeting, 'meetingId' | 'meetingNumber' | 'quorumMet'>
): Promise<BoardMeeting> {
  // TODO: Schedule board meeting and send invitations
  throw new Error('Database integration pending');
}

export async function createMeetingAgenda(
  _db: NeonHttpDatabase,
  _orgId: string,
  _agenda: Omit<MeetingAgenda, 'agendaId'>
): Promise<MeetingAgenda> {
  // TODO: Create and distribute meeting agenda
  throw new Error('Database integration pending');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateMeetingNumber(meetingType: string, date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const typeCode = {
    BOARD: 'BM',
    COMMITTEE: 'CM',
    SHAREHOLDERS: 'SHM',
    EXTRAORDINARY: 'EGM',
  }[meetingType] || 'MTG';
  
  const sequence = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${typeCode}-${year}${month}-${sequence}`;
}

export function checkQuorum(
  attendees: MeetingAttendee[],
  quorumRequired: number
): {
  quorumMet: boolean;
  attendeeCount: number;
  eligibleVoters: number;
  quorumRequired: number;
} {
  // Count attendees who confirmed attendance
  const confirmedAttendees = attendees.filter(a => a.attendanceConfirmed);
  const attendeeCount = confirmedAttendees.length;
  
  // Count eligible voters (directors with voting rights)
  const eligibleVoters = confirmedAttendees.filter(a => 
    a.votingRights && (a.role === 'DIRECTOR' || a.role === 'CHAIRMAN')
  ).length;
  
  const quorumMet = eligibleVoters >= quorumRequired;
  
  return {
    quorumMet,
    attendeeCount,
    eligibleVoters,
    quorumRequired,
  };
}

export function generateMeetingMinutes(
  meeting: BoardMeeting,
  agenda: MeetingAgenda,
  attendees: MeetingAttendee[],
  resolutions: Array<{ resolutionNumber: string; title: string; status: string; votingRecord?: {
    votesFor: number;
    votesAgainst: number;
    votesAbstain: number;
    passed: boolean;
  } }>
): Record<string, unknown> {
  const presentAttendees = attendees.filter(a => a.attendanceConfirmed);
  const absentAttendees = attendees.filter(a => !a.attendanceConfirmed);
  
  return {
    meetingNumber: meeting.meetingNumber,
    meetingDate: meeting.scheduledDate.toISOString().split('T')[0],
    meetingType: meeting.meetingType,
    location: meeting.location,
    startTime: meeting.actualStartTime || meeting.startTime,
    endTime: meeting.actualEndTime || meeting.endTime,
    
    attendees: {
      present: presentAttendees.map(a => ({
        name: a.name,
        role: a.role,
      })),
      apologies: absentAttendees.map(a => ({
        name: a.name,
        role: a.role,
      })),
    },
    
    quorum: {
      required: meeting.quorumRequired,
      present: presentAttendees.filter(a => a.votingRights).length,
      quorumMet: meeting.quorumMet,
    },
    
    agendaItems: agenda.items.map(item => ({
      number: item.itemNumber,
      title: item.title,
      presenter: item.presenter,
      summary: item.description,
    })),
    
    resolutions: resolutions.map(res => ({
      resolutionNumber: res.resolutionNumber,
      title: res.title,
      status: res.status,
      votingRecord: res.votingRecord ? {
        votesFor: res.votingRecord.votesFor,
        votesAgainst: res.votingRecord.votesAgainst,
        votesAbstain: res.votingRecord.votesAbstain,
        result: res.votingRecord.passed ? 'PASSED' : 'REJECTED',
      } : undefined,
    })),
    
    certification: {
      preparedBy: 'Corporate Secretary',
      preparedDate: new Date().toISOString().split('T')[0],
      approvalStatus: 'DRAFT',
    },
  };
}
