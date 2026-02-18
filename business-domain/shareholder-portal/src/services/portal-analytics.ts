/**
 * Portal Analytics Service
 * Manages user engagement, service usage, and satisfaction metrics
 */

import type { ShareholderAccount } from './account-management.js';
import type { ShareholderCommunication } from './communications.js';
import type { ProxyVoting } from './proxy-voting.js';

// ============================================================================
// Analytics Functions
// ============================================================================

export function analyzeShareholderEngagement(
  accounts: ShareholderAccount[],
  communications: ShareholderCommunication[],
  votes: ProxyVoting[]
): {
  totalShareholders: number;
  portalEnabledCount: number;
  portalAdoptionRate: number;
  activeShareholders: number;
  avgCommunicationReadRate: number;
  votingParticipationRate: number;
  topShareholdersByOwnership: Array<{
    name: string;
    shares: number;
    ownershipPercentage: number;
  }>;
} {
  const totalShareholders = accounts.length;
  const portalEnabledCount = accounts.filter(a => a.portalEnabled).length;
  const portalAdoptionRate = totalShareholders > 0 
    ? (portalEnabledCount / totalShareholders) * 100 
    : 0;
  
  // Active shareholders (logged in within last 90 days)
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90);
  const activeShareholders = accounts.filter(a => 
    a.lastLoginDate && a.lastLoginDate >= cutoffDate
  ).length;
  
  // Communication read rate
  let totalSent = 0;
  let totalRead = 0;
  communications.forEach(comm => {
    totalSent += comm.sentCount;
    totalRead += comm.readCount;
  });
  const avgCommunicationReadRate = totalSent > 0 ? (totalRead / totalSent) * 100 : 0;
  
  // Voting participation
  const totalEligibleVoters = accounts.filter(a => a.status === 'ACTIVE').length;
  const uniqueVoters = new Set(votes.filter(v => v.status === 'VOTED').map(v => v.shareholderId)).size;
  const votingParticipationRate = totalEligibleVoters > 0 
    ? (uniqueVoters / totalEligibleVoters) * 100 
    : 0;
  
  // Top shareholders
  const topShareholdersByOwnership = accounts
    .filter(a => a.status === 'ACTIVE')
    .sort((a, b) => b.totalShares - a.totalShares)
    .slice(0, 10)
    .map(a => ({
      name: a.holderName,
      shares: a.totalShares,
      ownershipPercentage: a.percentageOwnership,
    }));
  
  return {
    totalShareholders,
    portalEnabledCount,
    portalAdoptionRate: Math.round(portalAdoptionRate),
    activeShareholders,
    avgCommunicationReadRate: Math.round(avgCommunicationReadRate),
    votingParticipationRate: Math.round(votingParticipationRate),
    topShareholdersByOwnership,
  };
}
