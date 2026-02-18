/**
 * Proxy Voting Service
 * Manages AGM/EGM voting, proxy assignment, and voting results
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface ProxyVoting {
  votingId: string;
  shareholderId: string;
  meetingId: string;
  
  // Meeting details
  meetingType: 'AGM' | 'EGM' | 'CLASS_MEETING';
  meetingDate: Date;
  
  // Voting power
  sharesEligible: number;
  votingPower: number; // May differ from shares (e.g., weighted voting)
  
  // Proxy
  isProxy: boolean;
  proxyHolderName?: string;
  proxyDocument?: string;
  
  // Votes
  resolutions: ResolutionVote[];
  
  // Submission
  submissionDate?: Date;
  submittedBy?: string;
  
  status: 'NOT_VOTED' | 'VOTED' | 'PROXY_ASSIGNED' | 'CANCELLED';
}

export interface ResolutionVote {
  resolutionId: string;
  resolutionNumber: string;
  resolutionTitle: string;
  
  vote: 'FOR' | 'AGAINST' | 'ABSTAIN' | 'WITHHELD';
  votingPower: number;
  
  voteCastDate?: Date;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function submitProxyVote(
  _db: NeonHttpDatabase,
  _orgId: string,
  _voting: Omit<ProxyVoting, 'votingId'>
): Promise<ProxyVoting> {
  // TODO: Record proxy vote
  throw new Error('Database integration pending');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function aggregateVotingResults(
  votes: ProxyVoting[]
): Record<string, {
  resolutionNumber: string;
  resolutionTitle: string;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  votesWithheld: number;
  totalVotes: number;
  percentageFor: number;
}> {
  const results: Record<string, any> = {};
  
  votes.forEach(voting => {
    voting.resolutions.forEach(res => {
      if (!results[res.resolutionId]) {
        results[res.resolutionId] = {
          resolutionNumber: res.resolutionNumber,
          resolutionTitle: res.resolutionTitle,
          votesFor: 0,
          votesAgainst: 0,
          votesAbstain: 0,
          votesWithheld: 0,
          totalVotes: 0,
        };
      }
      
      const result = results[res.resolutionId];
      result.totalVotes += res.votingPower;
      
      switch (res.vote) {
        case 'FOR':
          result.votesFor += res.votingPower;
          break;
        case 'AGAINST':
          result.votesAgainst += res.votingPower;
          break;
        case 'ABSTAIN':
          result.votesAbstain += res.votingPower;
          break;
        case 'WITHHELD':
          result.votesWithheld += res.votingPower;
          break;
      }
    });
  });
  
  // Calculate percentages
  Object.keys(results).forEach(resId => {
    const result = results[resId];
    const votesCast = result.votesFor + result.votesAgainst;
    result.percentageFor = votesCast > 0 ? (result.votesFor / votesCast) * 100 : 0;
    result.percentageFor = Math.round(result.percentageFor * 10) / 10;
  });
  
  return results;
}
