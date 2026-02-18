import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface BoardMeeting {
  id: string;
  meetingDate: Date;
  type: 'REGULAR' | 'SPECIAL' | 'ANNUAL' | 'COMMITTEE';
  agenda: Array<{
    order: number;
    topic: string;
    presenter: string;
    duration: number; // minutes
    materialsPrepared: boolean;
  }>;
  attendees: Array<{
    memberId: string;
    role: string;
    attendance: 'PRESENT' | 'ABSENT' | 'EXCUSED';
  }>;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

export async function scheduleMeeting(
  db: NeonHttpDatabase,
  data: Omit<BoardMeeting, 'id' | 'status'>,
): Promise<BoardMeeting> {
  // TODO: Insert into database with SCHEDULED status
  throw new Error('Database integration pending');
}

export async function getMeetings(
  db: NeonHttpDatabase,
  dateFrom: Date,
  dateTo: Date,
): Promise<BoardMeeting[]> {
  // TODO: Query database with date range
  throw new Error('Database integration pending');
}

export function validateMeetingQuorum(
  meeting: BoardMeeting,
  totalBoardMembers: number,
): {
  hasQuorum: boolean;
  presentCount: number;
  requiredCount: number;
} {
  const presentCount = meeting.attendees.filter((a) => a.attendance === 'PRESENT').length;
  const requiredCount = Math.ceil(totalBoardMembers / 2); // Simple majority

  return {
    hasQuorum: presentCount >= requiredCount,
    presentCount,
    requiredCount,
  };
}

export interface Resolution {
  id: string;
  meetingId: string;
  title: string;
  description: string;
  proposedBy: string;
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  status: 'PASSED' | 'REJECTED' | 'TABLED';
  effectiveDate?: Date;
}

export async function recordResolution(
  db: NeonHttpDatabase,
  data: Omit<Resolution, 'id' | 'status'>,
): Promise<Resolution> {
  // TODO: Calculate status based on votes and insert
  throw new Error('Database integration pending');
}

export function calculateVoteOutcome(
  votesFor: number,
  votesAgainst: number,
  abstentions: number,
  requiredMajority: number = 0.5, // 50%
): {
  outcome: 'PASSED' | 'REJECTED';
  supportPercentage: number;
} {
  const totalVotes = votesFor + votesAgainst; // Abstentions don't count
  const supportPercentage = totalVotes > 0 ? (votesFor / totalVotes) * 100 : 0;

  const outcome: 'PASSED' | 'REJECTED' =
    supportPercentage > requiredMajority * 100 ? 'PASSED' : 'REJECTED';

  return { outcome, supportPercentage };
}

export function generateMeetingMinutes(meeting: BoardMeeting): string {
  const quorum = validateMeetingQuorum(meeting, meeting.attendees.length);

  return `
BOARD MEETING MINUTES
Date: ${meeting.meetingDate.toISOString().split('T')[0]}
Type: ${meeting.type}

ATTENDANCE:
${meeting.attendees
  .map((a) => `- ${a.role}: ${a.attendance}`)
  .join('\n')}

Quorum: ${quorum.hasQuorum ? 'ESTABLISHED' : 'NOT ESTABLISHED'} (${quorum.presentCount}/${quorum.requiredCount})

AGENDA:
${meeting.agenda
  .map((item) => `${item.order}. ${item.topic} (${item.presenter}, ${item.duration}min)`)
  .join('\n')}

Status: ${meeting.status}
`.trim();
}
