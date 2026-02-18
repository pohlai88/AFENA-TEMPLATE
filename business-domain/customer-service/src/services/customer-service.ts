/**
 * Customer Service Management
 * Handles support tickets, case management, SLA tracking, and customer satisfaction
 */

// ============================================================================
// Interfaces
// ============================================================================

export interface SupportTicket {
  ticketId: string;
  ticketNumber: string;
  customerId: string;
  contactId: string;
  
  // Classification
  subject: string;
  description: string;
  category: 'TECHNICAL' | 'BILLING' | 'GENERAL_INQUIRY' | 'COMPLAINT' | 'FEATURE_REQUEST';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  severity: 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4';
  
  // Assignment
  assignedTo?: string;
  assignedTeam?: string;
  
  // Status
  status: 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'PENDING_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  resolution?: string;
  resolutionCode?: string;
  
  // SLA tracking
  createdDate: Date;
  firstResponseDate?: Date;
  resolvedDate?: Date;
  closedDate?: Date;
  slaBreached: boolean;
  
  // Escalation
  escalationLevel: number;
  escalatedDate?: Date;
  escalatedTo?: string;
  escalationReason?: string;
  
  // Channel
  channel: 'EMAIL' | 'PHONE' | 'CHAT' | 'PORTAL' | 'SOCIAL';
  sourceReference?: string;
}

export interface TicketInteraction {
  interactionId: string;
  ticketId: string;
  interactionType: 'NOTE' | 'EMAIL' | 'PHONE_CALL' | 'CHAT' | 'STATUS_CHANGE';
  direction: 'INBOUND' | 'OUTBOUND' | 'INTERNAL';
  
  content: string;
  createdBy: string;
  createdDate: Date;
  
  // Time tracking
  timeSpent?: number; // minutes
  isBillable: boolean;
}

export interface SLA {
  slaId: string;
  slaName: string;
  applicableCategories: string[];
  applicablePriorities: string[];
  
  // Targets (in minutes)
  firstResponseTarget: number;
  resolutionTarget: number;
  
  // Business hours
  operatingHours: {
    start: string; // "09:00"
    end: string;   // "17:00"
  };
  operatingDays: number[]; // [1,2,3,4,5] = Mon-Fri
  
  isActive: boolean;
}

export interface CustomerSatisfaction {
  surveyId: string;
  ticketId: string;
  customerId: string;
  
  // Ratings (1-5)
  overallSatisfaction: number;
  responseTime: number;
  resolution: number;
  agentKnowledge: number;
  
  // NPS
  npsScore?: number; // 0-10
  npsCategory?: 'DETRACTOR' | 'PASSIVE' | 'PROMOTER';
  
  // Feedback
  comments?: string;
  wouldRecommend: boolean;
  
  submittedDate: Date;
}

export interface KnowledgeArticle {
  articleId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  
  // Usage
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  
  // Lifecycle
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdBy: string;
  createdDate: Date;
  lastUpdatedDate: Date;
  publishedDate?: Date;
}

export interface AgentPerformance {
  agentId: string;
  periodStart: Date;
  periodEnd: Date;
  
  // Volume
  ticketsAssigned: number;
  ticketsResolved: number;
  ticketsClosed: number;
  
  // Quality
  avgCustomerSatisfaction: number;
  avgResolutionTime: number; // minutes
  firstContactResolutionRate: number; // %
  
  // SLA
  slaMetCount: number;
  slaBreachedCount: number;
  slaComplianceRate: number; // %
  
  // Time
  totalHandleTime: number; // minutes
  avgHandleTime: number; // minutes per ticket
}

// ============================================================================
// Database Operations
// ============================================================================

export async function createTicket(
  ticket: Omit<SupportTicket, 'ticketId' | 'ticketNumber' | 'createdDate' | 'escalationLevel' | 'slaBreached'>
): Promise<SupportTicket> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function addInteraction(
  interaction: Omit<TicketInteraction, 'interactionId' | 'createdDate'>
): Promise<TicketInteraction> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function assignTicket(
  ticketId: string,
  agentId: string,
  teamId?: string
): Promise<void> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function resolveTicket(
  ticketId: string,
  resolution: string,
  resolutionCode: string
): Promise<void> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function submitSatisfactionSurvey(
  survey: Omit<CustomerSatisfaction, 'surveyId' | 'submittedDate' | 'npsCategory'>
): Promise<CustomerSatisfaction> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function getSLAByTicket(ticket: SupportTicket): Promise<SLA | null> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function getAgentPerformance(
  agentId: string,
  startDate: Date,
  endDate: Date
): Promise<AgentPerformance> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateTicketNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `TKT-${year}-${sequence}`;
}

export function calculatePriority(
  category: SupportTicket['category'],
  severity: SupportTicket['severity'],
  customerId: string,
  isVIPCustomer: boolean
): SupportTicket['priority'] {
  let score = 0;

  // Severity weight (50%)
  const severityScores = { SEV1: 50, SEV2: 35, SEV3: 20, SEV4: 10 };
  score += severityScores[severity];

  // Category weight (30%)
  const categoryScores = {
    COMPLAINT: 30,
    TECHNICAL: 20,
    BILLING: 15,
    FEATURE_REQUEST: 5,
    GENERAL_INQUIRY: 5,
  };
  score += categoryScores[category];

  // VIP customer boost (20%)
  if (isVIPCustomer) {
    score += 20;
  }

  // Determine priority
  if (score >= 80) return 'URGENT';
  if (score >= 50) return 'HIGH';
  if (score >= 25) return 'MEDIUM';
  return 'LOW';
}

export function checkSLACompliance(
  ticket: SupportTicket,
  sla: SLA
): {
  firstResponseCompliant: boolean;
  resolutionCompliant: boolean;
  firstResponseRemaining: number; // minutes
  resolutionRemaining: number; // minutes
  isBreached: boolean;
} {
  const now = new Date();

  // Calculate business minutes elapsed
  const minutesSinceCreation = calculateBusinessMinutes(
    ticket.createdDate,
    now,
    sla.operatingHours,
    sla.operatingDays
  );

  // First response
  const firstResponseCompliant = ticket.firstResponseDate !== null &&
    calculateBusinessMinutes(
      ticket.createdDate,
      ticket.firstResponseDate,
      sla.operatingHours,
      sla.operatingDays
    ) <= sla.firstResponseTarget;

  const firstResponseRemaining = Math.max(0, sla.firstResponseTarget - minutesSinceCreation);

  // Resolution
  let resolutionCompliant = true;
  let resolutionRemaining = sla.resolutionTarget;

  if (ticket.resolvedDate) {
    const resolutionTime = calculateBusinessMinutes(
      ticket.createdDate,
      ticket.resolvedDate,
      sla.operatingHours,
      sla.operatingDays
    );
    resolutionCompliant = resolutionTime <= sla.resolutionTarget;
  } else {
    resolutionRemaining = Math.max(0, sla.resolutionTarget - minutesSinceCreation);
  }

  const isBreached = !firstResponseCompliant || 
    (ticket.resolvedDate && !resolutionCompliant) ||
    (!ticket.resolvedDate && minutesSinceCreation > sla.resolutionTarget);

  return {
    firstResponseCompliant,
    resolutionCompliant,
    firstResponseRemaining,
    resolutionRemaining,
    isBreached,
  };
}

function calculateBusinessMinutes(
  start: Date,
  end: Date,
  operatingHours: { start: string; end: string },
  operatingDays: number[]
): number {
  let minutes = 0;
  const current = new Date(start);

  // Parse operating hours
  const [startHour, startMinute] = operatingHours.start.split(':').map(Number);
  const [endHour, endMinute] = operatingHours.end.split(':').map(Number);

  while (current < end) {
    const dayOfWeek = current.getDay();
    
    // Check if it's an operating day (0 = Sunday, 6 = Saturday)
    if (operatingDays.includes(dayOfWeek)) {
      const currentHour = current.getHours();
      const currentMinute = current.getMinutes();
      
      // Check if within operating hours
      const currentTotalMinutes = currentHour * 60 + currentMinute;
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      
      if (currentTotalMinutes >= startTotalMinutes && currentTotalMinutes < endTotalMinutes) {
        minutes++;
      }
    }
    
    current.setMinutes(current.getMinutes() + 1);
  }

  return minutes;
}

export function determineEscalation(
  ticket: SupportTicket,
  slaCompliance: ReturnType<typeof checkSLACompliance>,
  interactions: TicketInteraction[]
): {
  shouldEscalate: boolean;
  reason?: string;
  suggestedLevel: number;
} {
  const currentLevel = ticket.escalationLevel || 0;
  let shouldEscalate = false;
  let reason: string | undefined;

  // SLA breach
  if (slaCompliance.isBreached) {
    shouldEscalate = true;
    reason = 'SLA breach detected';
  }

  // No progress (no interactions in 24 hours)
  const lastInteractionDate = interactions.length > 0
    ? new Date(Math.max(...interactions.map(i => i.createdDate.getTime())))
    : ticket.createdDate;
  
  const hoursSinceLastInteraction = 
    (new Date().getTime() - lastInteractionDate.getTime()) / (1000 * 60 * 60);
  
  if (hoursSinceLastInteraction > 24 && ticket.status === 'OPEN') {
    shouldEscalate = true;
    reason = 'No progress in 24 hours';
  }

  // High priority, unassigned for > 1 hour
  if (ticket.priority === 'URGENT' && !ticket.assignedTo) {
    const hoursSinceCreation = 
      (new Date().getTime() - ticket.createdDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceCreation > 1) {
      shouldEscalate = true;
      reason = 'Urgent ticket unassigned for > 1 hour';
    }
  }

  // Multiple re-assignments (> 3)
  const reassignments = interactions.filter(i => 
    i.interactionType === 'STATUS_CHANGE' && i.content.includes('reassigned')
  ).length;
  
  if (reassignments > 3) {
    shouldEscalate = true;
    reason = 'Multiple re-assignments';
  }

  return {
    shouldEscalate,
    reason,
    suggestedLevel: shouldEscalate ? currentLevel + 1 : currentLevel,
  };
}

export function routeTicket(
  ticket: SupportTicket
): {
  suggestedTeam: string;
  suggestedAgent?: string;
  routingReason: string;
} {
  // Simple skill-based routing
  const teamRouting: Record<string, string> = {
    TECHNICAL: 'TECH_SUPPORT',
    BILLING: 'BILLING_TEAM',
    COMPLAINT: 'ESCALATIONS',
    FEATURE_REQUEST: 'PRODUCT_TEAM',
    GENERAL_INQUIRY: 'CUSTOMER_SERVICE',
  };

  const suggestedTeam = teamRouting[ticket.category] || 'CUSTOMER_SERVICE';

  // Priority-based routing
  let routingReason = `Category: ${ticket.category}`;
  if (ticket.priority === 'URGENT') {
    routingReason += ', Priority: URGENT - route to senior agent';
  }

  return {
    suggestedTeam,
    routingReason,
  };
}

export function calculateNPSScore(score: number): CustomerSatisfaction['npsCategory'] {
  if (score >= 9) return 'PROMOTER';
  if (score >= 7) return 'PASSIVE';
  return 'DETRACTOR';
}

export function generateSatisfactionMetrics(
  surveys: CustomerSatisfaction[]
): {
  avgOverallSatisfaction: number;
  avgResponseTime: number;
  avgResolution: number;
  avgAgentKnowledge: number;
  nps: number; // Net Promoter Score
  responseRate: number;
  detractorPercentage: number;
  promoterPercentage: number;
} {
  if (surveys.length === 0) {
    return {
      avgOverallSatisfaction: 0,
      avgResponseTime: 0,
      avgResolution: 0,
      avgAgentKnowledge: 0,
      nps: 0,
      responseRate: 0,
      detractorPercentage: 0,
      promoterPercentage: 0,
    };
  }

  const totals = surveys.reduce(
    (acc, survey) => ({
      overall: acc.overall + survey.overallSatisfaction,
      responseTime: acc.responseTime + survey.responseTime,
      resolution: acc.resolution + survey.resolution,
      knowledge: acc.knowledge + survey.agentKnowledge,
    }),
    { overall: 0, responseTime: 0, resolution: 0, knowledge: 0 }
  );

  const count = surveys.length;

  // NPS calculation
  const detractors = surveys.filter(s => s.npsCategory === 'DETRACTOR').length;
  const promoters = surveys.filter(s => s.npsCategory === 'PROMOTER').length;
  const nps = ((promoters - detractors) / count) * 100;

  return {
    avgOverallSatisfaction: Math.round((totals.overall / count) * 10) / 10,
    avgResponseTime: Math.round((totals.responseTime / count) * 10) / 10,
    avgResolution: Math.round((totals.resolution / count) * 10) / 10,
    avgAgentKnowledge: Math.round((totals.knowledge / count) * 10) / 10,
    nps: Math.round(nps),
    responseRate: 100, // Would calculate from total tickets
    detractorPercentage: (detractors / count) * 100,
    promoterPercentage: (promoters / count) * 100,
  };
}

export function suggestKnowledgeArticles(
  ticket: SupportTicket,
  articles: KnowledgeArticle[]
): KnowledgeArticle[] {
  // Simple keyword matching
  const keywords = [...ticket.subject.toLowerCase().split(/\s+/), ...ticket.description.toLowerCase().split(/\s+/)];
  
  const scored = articles
    .filter(a => a.status === 'PUBLISHED')
    .map(article => {
      let score = 0;

      // Category match
      if (article.category === ticket.category) score += 30;

      // Keyword matching in title
      const titleLower = article.title.toLowerCase();
      keywords.forEach(kw => {
        if (titleLower.includes(kw) && kw.length > 3) score += 10;
      });

      // Tag matching
      article.tags.forEach(tag => {
        if (keywords.includes(tag.toLowerCase())) score += 15;
      });

      // Helpfulness boost
      if (article.helpfulCount > 0) {
        const helpfulRatio = article.helpfulCount / (article.helpfulCount + article.notHelpfulCount);
        score += helpfulRatio * 20;
      }

      return { article, score };
    })
    .filter(item => item.score > 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.article);

  return scored;
}

export function calculateFirstContactResolution(
  ticket: SupportTicket,
  interactions: TicketInteraction[]
): boolean {
  // FCR = resolved in single interaction without escalation or re-assignment
  if (ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED') {
    return false;
  }

  // No escalations
  if (ticket.escalationLevel > 0) return false;

  // Count meaningful interactions (exclude system/status changes)
  const meaningfulInteractions = interactions.filter(i =>
    i.interactionType !== 'STATUS_CHANGE' && i.direction !== 'INTERNAL'
  );

  // Resolved in ≤ 2 interactions (initial contact + resolution)
  return meaningfulInteractions.length <= 2;
}

export function analyzeTicketTrends(
  tickets: SupportTicket[]
): {
  volumeByCategory: Array<{ category: string; count: number; percentage: number }>;
  volumeByPriority: Array<{ priority: string; count: number; percentage: number }>;
  volumeByChannel: Array<{ channel: string; count: number; percentage: number }>;
  avgResolutionTime: number; // hours
  slaComplianceRate: number; // %
} {
  const total = tickets.length;
  
  // By category
  const categoryMap = new Map<string, number>();
  const priorityMap = new Map<string, number>();
  const channelMap = new Map<string, number>();
  
  let totalResolutionTime = 0;
  let resolvedCount = 0;
  const slaMetCount = tickets.filter(t => !t.slaBreached).length;

  tickets.forEach(ticket => {
    categoryMap.set(ticket.category, (categoryMap.get(ticket.category) || 0) + 1);
    priorityMap.set(ticket.priority, (priorityMap.get(ticket.priority) || 0) + 1);
    channelMap.set(ticket.channel, (channelMap.get(ticket.channel) || 0) + 1);

    if (ticket.resolvedDate) {
      const hours = (ticket.resolvedDate.getTime() - ticket.createdDate.getTime()) / (1000 * 60 * 60);
      totalResolutionTime += hours;
      resolvedCount++;
    }
  });

  const volumeByCategory = Array.from(categoryMap.entries()).map(([category, count]) => ({
    category,
    count,
    percentage: (count / total) * 100,
  }));

  const volumeByPriority = Array.from(priorityMap.entries()).map(([priority, count]) => ({
    priority,
    count,
    percentage: (count / total) * 100,
  }));

  const volumeByChannel = Array.from(channelMap.entries()).map(([channel, count]) => ({
    channel,
    count,
    percentage: (count / total) * 100,
  }));

  return {
    volumeByCategory,
    volumeByPriority,
    volumeByChannel,
    avgResolutionTime: resolvedCount > 0 ? totalResolutionTime / resolvedCount : 0,
    slaComplianceRate: total > 0 ? (slaMetCount / total) * 100 : 0,
  };
}
