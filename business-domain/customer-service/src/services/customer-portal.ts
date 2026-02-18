/**
 * Customer Portal Service
 * Manages self-service portal for customers to access tickets, FAQs, knowledge base, and account information
 */

// ============================================================================
// Interfaces
// ============================================================================

export interface CustomerPortalAccount {
  accountId: string;
  
  // Customer
  customerId: string;
  customerName: string;
  email: string;
  phone?: string;
  
  // Portal access
  username: string;
  lastLoginDate?: Date;
  loginCount: number;
  
  // Preferences
  notificationPreferences: NotificationPreferences;
  language: string;
  timezone: string;
  
  // Status
  accountStatus: 'ACTIVE' | 'SUSPENDED' | 'LOCKED';
  emailVerified: boolean;
  phoneVerified: boolean;
  
  createdDate: Date;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  
  ticketUpdates: boolean;
  productAnnouncements: boolean;
  maintenanceAlerts: boolean;
  newsletterSubscription: boolean;
}

export interface PortalTicket {
  ticketId: string;
  ticketNumber: string;
  
  // Customer
  customerId: string;
  customerName: string;
  email: string;
  
  // Issue
  subject: string;
  description: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  
  // Attachments
  attachments: FileAttachment[];
  
  // Status
  status: 'NEW' | 'OPEN' | 'IN_PROGRESS' | 'WAITING_ON_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  
  // Timeline
  createdDate: Date;
  lastUpdatedDate: Date;
  resolvedDate?: Date;
  
  // Agent
  assignedAgent?: string;
  
  // Communication
  messages: TicketMessage[];
  
  // Satisfaction
  satisfactionRating?: number; // 1-5
  feedback?: string;
}

export interface FileAttachment {
  fileId: string;
  fileName: string;
  fileSize: number; // bytes
  fileType: string;
  uploadDate: Date;
  uploadedBy: string;
  secureUrl: string;
}

export interface TicketMessage {
  messageId: string;
  ticketId: string;
  
  sender: 'CUSTOMER' | 'AGENT' | 'SYSTEM';
  senderName: string;
  
  message: string;
  attachments: FileAttachment[];
  
  timestamp: Date;
  isInternal: boolean; // Not visible to customer
}

export interface KnowledgeArticle {
  articleId: string;
  
  // Content
  title: string;
  summary: string;
  content: string;
  
  // Organization
  category: string;
  subcategory?: string;
  tags: string[];
  
  // SEO
  slug: string;
  metaDescription?: string;
  
  // Related
  relatedArticles: string[]; // Article IDs
  
  // Metadata
  author: string;
  publishedDate: Date;
  lastUpdatedDate: Date;
  version: number;
  
  // Visibility
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isPublic: boolean;
  
  // Analytics
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  helpfulnessScore: number; // Calculated
}

export interface FAQ {
  faqId: string;
  
  question: string;
  answer: string;
  
  category: string;
  tags: string[];
  
  // Display
  displayOrder: number;
  
  // Analytics
  viewCount: number;
  helpfulCount: number;
  notHelpfulCount: number;
  
  // Metadata
  createdDate: Date;
  lastUpdatedDate: Date;
  
  status: 'ACTIVE' | 'INACTIVE';
}

export interface ProductUpdate {
  updateId: string;
  
  // Content
  title: string;
  summary: string;
  description: string;
  
  // Type
  updateType: 'FEATURE' | 'BUG_FIX' | 'MAINTENANCE' | 'ANNOUNCEMENT' | 'SECURITY';
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  // Affected
  affectedProducts: string[];
  affectedVersions?: string[];
  
  // Timeline
  publishDate: Date;
  effectiveDate?: Date;
  resolvedDate?: Date;
  
  // Links
  documentationUrl?: string;
  releaseNotesUrl?: string;
  
  // Status
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  
  // Notification
  notifyCustomers: boolean;
  notifiedCount?: number;
}

export interface ServiceRequest {
  requestId: string;
  requestNumber: string;
  
  // Customer
  customerId: string;
  customerName: string;
  
  // Request
  requestType: 'ACCOUNT_CHANGE' | 'DATA_EXPORT' | 'DATA_DELETION' | 'FEATURE_REQUEST' | 'BILLING_INQUIRY' | 'OTHER';
  title: string;
  description: string;
  
  // Attachments
  attachments: FileAttachment[];
  
  // Status
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  
  // Timeline
  submittedDate: Date;
  reviewedDate?: Date;
  completedDate?: Date;
  
  // Review
  reviewedBy?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  
  // SLA
  expectedCompletionDate?: Date;
}

export interface PortalActivity {
  activityId: string;
  
  // User
  customerId: string;
  sessionId: string;
  
  // Activity
  activityType: 'PAGE_VIEW' | 'ARTICLE_VIEW' | 'SEARCH' | 'TICKET_CREATED' | 'TICKET_UPDATED' | 'DOCUMENT_DOWNLOAD' | 'FAQ_VIEW';
  resourceType?: string;
  resourceId?: string;
  
  // Details
  pageUrl?: string;
  searchQuery?: string;
  actionTaken?: string;
  
  // Metadata
  ipAddress: string;
  userAgent: string;
  
  timestamp: Date;
}

export interface PortalAnalytics {
  period: { start: Date; end: Date };
  
  // Usage
  totalLogins: number;
  uniqueUsers: number;
  avgSessionDuration: number; // seconds
  
  // Self-service
  ticketsCreated: number;
  articlesViewed: number;
  faqsViewed: number;
  searchesPerformed: number;
  
  // Engagement
  topArticles: Array<{ articleId: string; title: string; views: number }>;
  topSearches: Array<{ query: string; count: number }>;
  
  // Satisfaction
  avgTicketRating: number;
  avgArticleHelpfulness: number;
  
  // Self-service rate
  selfServiceResolutionRate: number; // Percentage of issues resolved without agent
}

// ============================================================================
// Database Operations
// ============================================================================

export async function createPortalAccount(
  account: Omit<CustomerPortalAccount, 'accountId' | 'loginCount' | 'createdDate'>
): Promise<CustomerPortalAccount> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function submitPortalTicket(
  ticket: Omit<PortalTicket, 'ticketId' | 'ticketNumber' | 'createdDate' | 'lastUpdatedDate' | 'messages'>
): Promise<PortalTicket> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function publishKnowledgeArticle(
  article: Omit<KnowledgeArticle, 'articleId' | 'publishedDate' | 'lastUpdatedDate' | 'viewCount' | 'helpfulCount' | 'notHelpfulCount' | 'helpfulnessScore'>
): Promise<KnowledgeArticle> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function createServiceRequest(
  request: Omit<ServiceRequest, 'requestId' | 'requestNumber' | 'submittedDate'>
): Promise<ServiceRequest> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function logPortalActivity(
  activity: Omit<PortalActivity, 'activityId' | 'timestamp'>
): Promise<PortalActivity> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TKT-${timestamp}-${random}`;
}

export function generateRequestNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `REQ-${timestamp}-${random}`;
}

export function calculateArticleHelpfulness(
  helpfulCount: number,
  notHelpfulCount: number
): number {
  const total = helpfulCount + notHelpfulCount;
  if (total === 0) return 0;
  
  const score = (helpfulCount / total) * 100;
  return Math.round(score);
}

export function searchKnowledgeBase(
  articles: KnowledgeArticle[],
  query: string
): KnowledgeArticle[] {
  const lowerQuery = query.toLowerCase();
  
  return articles
    .filter(article => 
      article.status === 'PUBLISHED' &&
      article.isPublic &&
      (
        article.title.toLowerCase().includes(lowerQuery) ||
        article.summary.toLowerCase().includes(lowerQuery) ||
        article.content.toLowerCase().includes(lowerQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    )
    .sort((a, b) => {
      // Sort by relevance (title match > summary match > content match)
      const aTitle = a.title.toLowerCase().includes(lowerQuery) ? 3 : 0;
      const aSummary = a.summary.toLowerCase().includes(lowerQuery) ? 2 : 0;
      const aContent = a.content.toLowerCase().includes(lowerQuery) ? 1 : 0;
      const aScore = aTitle + aSummary + aContent + (a.helpfulnessScore / 100);
      
      const bTitle = b.title.toLowerCase().includes(lowerQuery) ? 3 : 0;
      const bSummary = b.summary.toLowerCase().includes(lowerQuery) ? 2 : 0;
      const bContent = b.content.toLowerCase().includes(lowerQuery) ? 1 : 0;
      const bScore = bTitle + bSummary + bContent + (b.helpfulnessScore / 100);
      
      return bScore - aScore;
    });
}

export function findRelatedArticles(
  article: KnowledgeArticle,
  allArticles: KnowledgeArticle[],
  maxResults: number = 5
): KnowledgeArticle[] {
  return allArticles
    .filter(a => 
      a.articleId !== article.articleId &&
      a.status === 'PUBLISHED' &&
      a.isPublic &&
      (
        a.category === article.category ||
        a.tags.some(tag => article.tags.includes(tag))
      )
    )
    .map(a => {
      // Calculate relevance score
      let score = 0;
      if (a.category === article.category) score += 2;
      if (a.subcategory === article.subcategory) score += 1;
      
      const commonTags = a.tags.filter(tag => article.tags.includes(tag));
      score += commonTags.length;
      
      score += a.helpfulnessScore / 100;
      
      return { article: a, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.article);
}

export function identifyPopularArticles(
  articles: KnowledgeArticle[],
  minViews: number = 100
): Array<{ article: KnowledgeArticle; popularity: string }> {
  return articles
    .filter(a => a.status === 'PUBLISHED' && a.viewCount >= minViews)
    .map(article => {
      let popularity: string;
      if (article.viewCount >= 1000) popularity = 'VERY_HIGH';
      else if (article.viewCount >= 500) popularity = 'HIGH';
      else if (article.viewCount >= 250) popularity = 'MEDIUM';
      else popularity = 'LOW';
      
      return { article, popularity };
    })
    .sort((a, b) => b.article.viewCount - a.article.viewCount);
}

export function analyzeSearchQueries(
  activities: PortalActivity[]
): {
  topQueries: Array<{ query: string; count: number }>;
  noResultsQueries: string[];
  avgResultsPerSearch: number;
} {
  const searchActivities = activities.filter(a => a.activityType === 'SEARCH');
  
  // Count queries
  const queryMap = new Map<string, number>();
  searchActivities.forEach(activity => {
    if (activity.searchQuery) {
      const query = activity.searchQuery.toLowerCase();
      queryMap.set(query, (queryMap.get(query) || 0) + 1);
    }
  });
  
  const topQueries = Array.from(queryMap.entries())
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // This would require tracking search results in activities
  const noResultsQueries: string[] = [];
  const avgResultsPerSearch = 0;
  
  return {
    topQueries,
    noResultsQueries,
    avgResultsPerSearch,
  };
}

export function calculateSelfServiceRate(
  totalTickets: number,
  ticketsWithAgentAssignment: number
): number {
  if (totalTickets === 0) return 0;
  
  const selfServiceResolved = totalTickets - ticketsWithAgentAssignment;
  const rate = (selfServiceResolved / totalTickets) * 100;
  
  return Math.round(rate);
}

export function analyzePortalEngagement(
  accounts: CustomerPortalAccount[],
  activities: PortalActivity[],
  tickets: PortalTicket[]
): {
  activeUsers: number;
  inactiveUsers: number;
  avgLoginFrequency: number;
  topActivities: Array<{ type: string; count: number }>;
  engagementScore: number;
} {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Active vs inactive users
  const activeUsers = accounts.filter(a => 
    a.lastLoginDate && a.lastLoginDate >= thirtyDaysAgo
  ).length;
  const inactiveUsers = accounts.length - activeUsers;
  
  // Average login frequency
  const totalLogins = accounts.reduce((sum, a) => sum + a.loginCount, 0);
  const avgLoginFrequency = accounts.length > 0 
    ? totalLogins / accounts.length 
    : 0;
  
  // Top activities
  const activityMap = new Map<string, number>();
  activities.forEach(activity => {
    const type = activity.activityType;
    activityMap.set(type, (activityMap.get(type) || 0) + 1);
  });
  
  const topActivities = Array.from(activityMap.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
  
  // Engagement score (0-100)
  // Based on: login frequency (40%), activity count (30%), ticket creation (30%)
  const loginScore = Math.min((avgLoginFrequency / 10) * 40, 40);
  const activityScore = Math.min((activities.length / accounts.length / 50) * 30, 30);
  const ticketScore = Math.min((tickets.length / accounts.length / 5) * 30, 30);
  const engagementScore = Math.round(loginScore + activityScore + ticketScore);
  
  return {
    activeUsers,
    inactiveUsers,
    avgLoginFrequency: Math.round(avgLoginFrequency * 10) / 10,
    topActivities,
    engagementScore,
  };
}

export function analyzePortalMetrics(
  accounts: CustomerPortalAccount[],
  tickets: PortalTicket[],
  articles: KnowledgeArticle[],
  activities: PortalActivity[]
): PortalAnalytics {
  // Logins
  const loginActivities = activities.filter(a => a.activityType === 'PAGE_VIEW');
  const totalLogins = loginActivities.length;
  const uniqueUserIds = new Set(activities.map(a => a.customerId));
  const uniqueUsers = uniqueUserIds.size;
  
  // Self-service
  const ticketsCreated = tickets.length;
  const articleViews = activities.filter(a => a.activityType === 'ARTICLE_VIEW');
  const faqViews = activities.filter(a => a.activityType === 'FAQ_VIEW');
  const searches = activities.filter(a => a.activityType === 'SEARCH');
  
  // Top articles
  const articleViewMap = new Map<string, number>();
  articleViews.forEach(activity => {
    if (activity.resourceId) {
      articleViewMap.set(activity.resourceId, (articleViewMap.get(activity.resourceId) || 0) + 1);
    }
  });
  
  const topArticles = Array.from(articleViewMap.entries())
    .map(([articleId, views]) => {
      const article = articles.find(a => a.articleId === articleId);
      return {
        articleId,
        title: article?.title || 'Unknown',
        views,
      };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);
  
  // Top searches
  const searchAnalysis = analyzeSearchQueries(activities);
  
  // Satisfaction
  const ticketsWithRating = tickets.filter(t => t.satisfactionRating !== undefined);
  const avgTicketRating = ticketsWithRating.length > 0
    ? ticketsWithRating.reduce((sum, t) => sum + (t.satisfactionRating || 0), 0) / ticketsWithRating.length
    : 0;
  
  const publishedArticles = articles.filter(a => a.status === 'PUBLISHED');
  const avgArticleHelpfulness = publishedArticles.length > 0
    ? publishedArticles.reduce((sum, a) => sum + a.helpfulnessScore, 0) / publishedArticles.length
    : 0;
  
  // Self-service rate
  const ticketsWithAgent = tickets.filter(t => t.assignedAgent !== undefined).length;
  const selfServiceResolutionRate = calculateSelfServiceRate(ticketsCreated, ticketsWithAgent);
  
  return {
    period: { start: new Date(), end: new Date() },
    
    totalLogins,
    uniqueUsers,
    avgSessionDuration: 0, // Would need session tracking
    
    ticketsCreated,
    articlesViewed: articleViews.length,
    faqsViewed: faqViews.length,
    searchesPerformed: searches.length,
    
    topArticles,
    topSearches: searchAnalysis.topQueries,
    
    avgTicketRating: Math.round(avgTicketRating * 10) / 10,
    avgArticleHelpfulness: Math.round(avgArticleHelpfulness),
    
    selfServiceResolutionRate,
  };
}
