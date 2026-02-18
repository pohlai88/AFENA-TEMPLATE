/**
 * @afenda-notifications
 * 
 * Multi-channel notification delivery and alert management.
 */

export {
  sendEmail,
  sendSMS,
  sendPushNotification,
  sendInAppNotification,
  getDeliveryStatus,
  retryFailedNotification,
  type SendEmailInput,
  type SendSMSInput,
  type SendPushNotificationInput,
  type NotificationDelivery,
} from './services/notification-delivery.js';

export {
  defineTemplate,
  renderTemplate,
  testTemplate,
  getTemplate,
  listTemplates,
  updateTemplate,
  deactivateTemplate,
  type DefineTemplateInput,
  type RenderTemplateInput,
  type NotificationTemplate,
  type RenderedTemplate,
} from './services/notification-templates.js';

export {
  subscribeToEvent,
  unsubscribeFromEvent,
  configurePreferences,
  getUserPreferences,
  getUserSubscriptions,
  shouldNotifyUser,
  generateUnsubscribeToken,
  processUnsubscribeToken,
  type SubscribeToEventInput,
  type ConfigurePreferencesInput,
  type NotificationSubscription,
  type NotificationPreferences,
} from './services/subscription-management.js';

export {
  trackDeliveryStatus,
  analyzeNotificationEngagement,
  getNotificationEvents,
  getEngagementByChannel,
  getBestTimeToSend,
  identifyInactiveUsers,
  getPerformanceTrends,
  type TrackDeliveryStatusInput,
  type DeliveryEvent,
  type NotificationEngagement,
  type EngagementAnalytics,
} from './services/notification-tracking.js';

export {
  defineAlertRule,
  evaluateAlertConditions,
  escalateAlert,
  acknowledgeAlert,
  resolveAlert,
  getActiveAlerts,
  getAlertHistory,
  getAlertStatistics,
  type DefineAlertRuleInput,
  type EscalateAlertInput,
  type AlertRule,
  type Alert,
} from './services/alert-management.js';
