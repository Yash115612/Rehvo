// ==============================================================================
// REHVO V6.1 — LOCAL NOTIFICATION REMINDERS ENGINE (PRODUCTION)
// High-precision local reminder scheduling for Visits, Rent, Move-in, and
// Recurring Maintenance checks.
// ==============================================================================

import { scheduleLocalNotification, cancelScheduledNotification } from './pushNotifications';

export const localNotificationEngine = {
  /**
   * 1. Schedule Visit Reminders (24h, 1h, 15min prior to tour)
   */
  async scheduleVisitReminders(params: {
    visitId: string;
    propertyTitle: string;
    visitTime: Date | string | number;
    passCode?: string;
  }): Promise<string[]> {
    const targetMs = new Date(params.visitTime).getTime();
    const nowMs = Date.now();
    const notificationIds: string[] = [];

    const reminderOffsets = [
      { label: '24 hours', offsetSeconds: 24 * 3600 },
      { label: '1 hour', offsetSeconds: 3600 },
      { label: '15 minutes', offsetSeconds: 15 * 60 },
    ];

    for (const item of reminderOffsets) {
      const scheduledTimeMs = targetMs - item.offsetSeconds * 1000;
      const secondsFromNow = Math.floor((scheduledTimeMs - nowMs) / 1000);

      if (secondsFromNow > 10) {
        const id = await scheduleLocalNotification({
          title: `📅 Visit Reminder: ${params.propertyTitle}`,
          body: params.passCode
            ? `Your property visit starts in ${item.label}. Security Passcode: ${params.passCode}.`
            : `Your scheduled property viewing starts in ${item.label}.`,
          data: {
            type: 'visit_reminder',
            category: 'visits',
            visitId: params.visitId,
            visit_id: params.visitId,
            deepLink: '/(renter)/visits',
          },
          triggerSeconds: secondsFromNow,
          channelId: 'visits',
        });
        if (id) notificationIds.push(id);
      }
    }

    return notificationIds;
  },

  /**
   * 2. Schedule Rent Reminders (7d, 3d, 1d, same day)
   */
  async scheduleRentReminders(params: {
    propertyTitle: string;
    amount: number;
    dueDate: Date | string;
  }): Promise<string[]> {
    const dueMs = new Date(params.dueDate).getTime();
    const nowMs = Date.now();
    const notificationIds: string[] = [];

    const reminderPoints = [
      { daysLeft: 7, offsetSec: 7 * 86400 },
      { daysLeft: 3, offsetSec: 3 * 86400 },
      { daysLeft: 1, offsetSec: 1 * 86400 },
      { daysLeft: 0, offsetSec: 0 },
    ];

    for (const pt of reminderPoints) {
      const scheduledTimeMs = dueMs - pt.offsetSec * 1000;
      const secondsFromNow = Math.floor((scheduledTimeMs - nowMs) / 1000);

      if (secondsFromNow > 30) {
        const title =
          pt.daysLeft === 0
            ? '🚨 Rent Due Today!'
            : `⏰ Rent Due in ${pt.daysLeft} Days`;
        const body = `₹${params.amount.toLocaleString('en-IN')} due for ${params.propertyTitle}. Pay on time to earn R-Cash!`;

        const id = await scheduleLocalNotification({
          title,
          body,
          data: {
            type: 'rent_due',
            category: 'wallet',
            amount: params.amount,
            deepLink: '/(renter)/pay-rent',
          },
          triggerSeconds: secondsFromNow,
          channelId: 'wallet',
        });
        if (id) notificationIds.push(id);
      }
    }

    return notificationIds;
  },

  /**
   * 3. Move-in Onboarding Reminders (Checklist, Utilities, Documents)
   */
  async scheduleMoveInReminders(params: {
    moveInDate: Date | string;
    propertyTitle: string;
  }): Promise<string[]> {
    const moveInMs = new Date(params.moveInDate).getTime();
    const nowMs = Date.now();
    const notificationIds: string[] = [];

    const milestones = [
      {
        title: '📋 Move-In Checklist Ready',
        body: '3 days until move-in. Check off your essential packing and furniture list.',
        offsetSec: 3 * 86400,
      },
      {
        title: '⚡ Setup Utilities & Broadband',
        body: 'Transfer electricity meters and schedule WiFi setup before moving into ' + params.propertyTitle,
        offsetSec: 2 * 86400,
      },
      {
        title: '🔑 Key Handover & Verification',
        body: 'Tomorrow is Move-In Day! Confirm key handover with the property owner.',
        offsetSec: 1 * 86400,
      },
    ];

    for (const m of milestones) {
      const scheduledMs = moveInMs - m.offsetSec * 1000;
      const secondsFromNow = Math.floor((scheduledMs - nowMs) / 1000);

      if (secondsFromNow > 30) {
        const id = await scheduleLocalNotification({
          title: m.title,
          body: m.body,
          data: {
            type: 'move_in_reminder',
            category: 'property_updates',
            deepLink: '/(renter)/move-in',
          },
          triggerSeconds: secondsFromNow,
          channelId: 'default',
        });
        if (id) notificationIds.push(id);
      }
    }

    return notificationIds;
  },

  /**
   * 4. Monthly Recurring Maintenance Check Reminder (every 30 days)
   */
  async scheduleMonthlyMaintenanceReminder(): Promise<string | null> {
    const secondsIn30Days = 30 * 86400;

    return await scheduleLocalNotification({
      title: '🛠️ Monthly Home Maintenance Check',
      body: 'Inspect plumbing, AC filters, and electrical fittings to keep your home in prime condition.',
      data: {
        type: 'maintenance_due',
        category: 'property_updates',
        deepLink: '/(renter)/maintenance',
      },
      triggerSeconds: secondsIn30Days,
      channelId: 'default',
    });
  },
};
