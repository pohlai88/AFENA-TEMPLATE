import { desc, sql } from 'drizzle-orm';
import { boolean, check, index, integer, pgTable, primaryKey, text, unique, uuid } from 'drizzle-orm/pg-core';

import { erpEntityColumns } from '../helpers/erp-entity';
import { tenantPolicy } from '../helpers/tenant-policy';

/**
 * Global Defaults — system-wide default values.
 * Source: global-defaults.spec.json (adopted from ERPNext Global Defaults).
 * Singleton config entity for organization-wide defaults.
 * 
 * NOTE: All FK columns are nullable with NO .references() - constraints deferred.
 * FK constraints will be added in refinement migration when target tables are adopted.
 */
export const globalDefaults = pgTable(
  'global_defaults',
  {
    ...erpEntityColumns,

    // === Company & Location Defaults ===
    /** Default company for new transactions. FK deferred: companies(id) */
    defaultCompany: uuid('default_company'),
    /** Default country for address forms and tax calculations. FK deferred: countries(id) */
    country: uuid('country'),

    // === Unit of Measure Defaults ===
    /** Default unit for distance measurements (km, miles, etc). FK deferred: uoms(id) */
    defaultDistanceUnit: uuid('default_distance_unit'),

    // === Currency Defaults ===
    /** Default currency for new transactions and reports. FK deferred: currencies(id) */
    defaultCurrency: uuid('default_currency'),

    // === Party & Location Defaults ===
    /** Default customer group for new customers. FK deferred: customer_groups(id) */
    defaultCustomerGroup: uuid('default_customer_group'),
    /** Default supplier group for new suppliers. FK deferred: supplier_groups(id) */
    defaultSupplierGroup: uuid('default_supplier_group'),
    /** Default warehouse for stock operations. FK deferred: warehouses(id) */
    defaultWarehouse: uuid('default_warehouse'),
    /** Default cost center for postings. FK deferred: cost_centers(id) */
    defaultCostCenter: uuid('default_cost_center'),

    // === Authentication & Security Settings ===
    /** Hide the "Login with Email Link" option from login page */
    hideLoginWithEmailLink: boolean('hide_login_with_email_link').default(false),
    /** Session timeout duration for web users (e.g., "240:00", "06:00") */
    sessionExpiry: text('session_expiry'),
    /** Session timeout duration for mobile users */
    sessionExpiryMobile: text('session_expiry_mobile'),
    /** Require two-factor authentication for all users */
    enableTwoFactorAuth: boolean('enable_two_factor_auth').default(false),
    /** Skip IP restriction check if user has 2FA enabled */
    bypassRestrictIpCheckIfTwoFactorAuth: boolean('bypass_restrict_ip_check_if_two_factor_auth').default(false),
    /** Disable notifications about system updates */
    disableSystemUpdateNotifications: boolean('disable_system_update_notifications').default(false),
    /** Disable notifications about changelog updates */
    disableChangeLogNotification: boolean('disable_change_log_notification').default(false),
    /** Disable password-based login (force SSO/OAuth only) */
    disableUserPass: boolean('disable_user_pass').default(false),
    /** Allow users to login using mobile number instead of email */
    allowLoginUsingMobileNumber: boolean('allow_login_using_mobile_number').default(false),
    /** Allow users to login using username instead of email */
    allowLoginUsingUserName: boolean('allow_login_using_user_name').default(false),
    /** Allow same user to login from multiple devices simultaneously */
    allowConsecutiveLogin: boolean('allow_consecutive_login').default(false),
    /** Enable error tracking services (Sentry, etc) */
    allowErrorTrackers: boolean('allow_error_trackers').default(false),
    /** Enforce password complexity requirements */
    enablePasswordPolicy: boolean('enable_password_policy').default(false),
    /** Minimum password strength score (0-4, based on zxcvbn) */
    minimumPasswordScore: integer('minimum_password_score'),

    // === Localization & Formatting ===
    /** Use letterhead matching document's print language */
    enableLetterheadOnPrintingLanguage: boolean('enable_letterhead_on_printing_language').default(false),
    /** Allow using exchange rates older than configured threshold */
    allowStaleExchangeRates: boolean('allow_stale_exchange_rates').default(false),
    /** System setup wizard has been completed */
    setupComplete: boolean('setup_complete').default(false),
    /** Date format for display (e.g., "dd-mm-yyyy", "mm/dd/yyyy") */
    dateFormat: text('date_format'),
    /** Time format for display (e.g., "HH:mm:ss", "HH:mm") */
    timeFormat: text('time_format'),
    /** Default timezone for organization (e.g., "America/New_York") */
    timeZone: text('time_zone'),
    /** Decimal places for float numbers (2-9) */
    floatPrecision: integer('float_precision'),
    /** Decimal places for currency amounts (2-9) */
    currencyPrecision: integer('currency_precision'),
    /** Number format pattern (e.g., "#,###.##", "#.###,##") */
    numberFormat: text('number_format'),
    /** First day of week for calendar (Sunday, Monday, etc) */
    firstDayOfTheWeek: text('first_day_of_the_week'),

    // === Print & Document Defaults ===
    /** Default letterhead for printed documents. FK deferred: letterheads(id) */
    defaultLetterhead: uuid('default_letterhead'),
    /** Default print format template name */
    defaultPrintFormat: text('default_print_format'),
    /** Default print style (Standard, Modern, Classic, etc) */
    defaultPrintStyle: text('default_print_style'),
    /** Default workspace view for users */
    defaultWorkspace: text('default_workspace'),
    /** Default language for UI and documents */
    defaultLanguage: text('default_language'),

    // === Number Rounding Settings ===
    /** Rounding method (Banker's Rounding, Commercial Rounding, etc) */
    rounding: text('rounding'),
    /** Disable rounded total row in documents */
    disableRoundedTotal: boolean('disable_rounded_total').default(false),
    /** Disable "amount in words" on printed documents */
    disableInWords: boolean('disable_in_words').default(false),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('global_defaults_org_singleton').on(table.orgId), // SINGLETON
    index('global_defaults_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('global_defaults_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);

export type GlobalDefaults = typeof globalDefaults.$inferSelect;
export type NewGlobalDefaults = typeof globalDefaults.$inferInsert;
