# 📧 EMAIL INTEGRATION GUIDE

> **Status:** Ready for Integration  
> **Version:** 1.0.0  
> **Created:** 20 Janeiro 2026  
> **Provider Options:** Resend, SendGrid, Amazon SES

---

## 🎯 OVERVIEW

This guide covers the email integration for the PerformTrack Notifications System. Email notifications are currently in **placeholder mode** and ready to be connected to a transactional email service.

---

## 📋 PREREQUISITES

### **1. Choose Email Provider**

We recommend **Resend** for simplicity and modern DX:

- ✅ **Resend** (Recommended)
  - Simple API
  - React Email support
  - Generous free tier (100 emails/day)
  - Great DX
  - [resend.com](https://resend.com)

- **SendGrid** (Alternative)
  - Enterprise-grade
  - 100 emails/day free
  - More complex setup
  - [sendgrid.com](https://sendgrid.com)

- **Amazon SES** (AWS Users)
  - Pay-as-you-go
  - Requires AWS account
  - More configuration needed

### **2. Environment Variables**

Add to `.env.local`:

```bash
# Email Provider (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@performtrack.com
RESEND_FROM_NAME=PerformTrack

# Or SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@performtrack.com
```

---

## 🚀 IMPLEMENTATION STEPS

### **STEP 1: Install Dependencies**

```bash
npm install resend @react-email/components
# or for SendGrid
npm install @sendgrid/mail
```

### **STEP 2: Create Email Templates**

We use **React Email** for beautiful, responsive HTML emails:

```tsx
// /emails/NotificationEmail.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface NotificationEmailProps {
  userName: string;
  notificationTitle: string;
  notificationMessage: string;
  actionUrl?: string;
  actionLabel?: string;
  category: string;
}

export function NotificationEmail({
  userName,
  notificationTitle,
  notificationMessage,
  actionUrl,
  actionLabel,
  category,
}: NotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{notificationTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Img
            src="https://performtrack.com/logo.png"
            width="150"
            height="50"
            alt="PerformTrack"
            style={logo}
          />

          {/* Content */}
          <Heading style={h1}>Olá {userName}!</Heading>
          
          <Section style={notificationBox}>
            <Text style={categoryLabel}>{getCategoryLabel(category)}</Text>
            <Heading as="h2" style={h2}>
              {notificationTitle}
            </Heading>
            <Text style={text}>{notificationMessage}</Text>
          </Section>

          {/* Action Button */}
          {actionUrl && (
            <Button href={actionUrl} style={button}>
              {actionLabel || 'Ver Detalhes'}
            </Button>
          )}

          {/* Footer */}
          <Text style={footer}>
            Recebeu este email porque tem notificações ativas no PerformTrack.
            <br />
            <Link href="https://app.performtrack.com/settings/notifications">
              Gerir preferências de notificações
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '16px',
  maxWidth: '600px',
};

const logo = {
  margin: '0 auto',
  marginBottom: '32px',
};

const h1 = {
  color: '#0f172a',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 24px',
  padding: '0 24px',
};

const h2 = {
  color: '#0f172a',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const text = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0',
};

const notificationBox = {
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  padding: '24px',
  margin: '0 24px 24px',
};

const categoryLabel = {
  color: '#0ea5e9',
  fontSize: '12px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  marginBottom: '8px',
};

const button = {
  backgroundColor: '#0ea5e9',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px 24px',
  margin: '0 auto 24px',
};

const footer = {
  color: '#94a3b8',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0 24px',
  textAlign: 'center' as const,
};

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    pain: 'Alerta de Dor',
    session: 'Sessão',
    form: 'Formulário',
    athlete: 'Atleta',
    calendar: 'Calendário',
    decision: 'Decisão IA',
    metric: 'Métrica',
    injury: 'Lesão',
    record: 'Recorde',
    system: 'Sistema',
  };
  return labels[category] || 'Notificação';
}

export default NotificationEmail;
```

### **STEP 3: Create Email Service**

```typescript
// /lib/email/email-service.ts
import { Resend } from 'resend';
import NotificationEmail from '@/emails/NotificationEmail';
import type { Notification } from '@/types/notifications';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendNotificationEmailOptions {
  to: string;
  userName: string;
  notification: Notification;
  baseUrl?: string;
}

/**
 * Send notification email
 */
export async function sendNotificationEmail({
  to,
  userName,
  notification,
  baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.performtrack.com',
}: SendNotificationEmailOptions) {
  try {
    // Build action URL
    const actionUrl = notification.actionUrl
      ? `${baseUrl}${notification.actionUrl}`
      : undefined;

    // Send email
    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to,
      subject: notification.title,
      react: NotificationEmail({
        userName,
        notificationTitle: notification.title,
        notificationMessage: notification.message,
        actionUrl,
        actionLabel: notification.actionLabel,
        category: notification.category,
      }),
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in sendNotificationEmail:', error);
    throw error;
  }
}

/**
 * Send digest email (daily/weekly summary)
 */
export async function sendDigestEmail({
  to,
  userName,
  notifications,
  period = 'daily',
}: {
  to: string;
  userName: string;
  notifications: Notification[];
  period?: 'daily' | 'weekly';
}) {
  // TODO: Implement digest email template
  console.log('Sending digest email to:', to, 'with', notifications.length, 'notifications');
}
```

### **STEP 4: Update Notification Creation**

```typescript
// In /hooks/useNotifications.ts or notification creation function
import { sendNotificationEmail } from '@/lib/email/email-service';

async function createNotificationWithEmail(
  payload: CreateNotificationPayload,
  userEmail: string,
  userName: string,
  emailEnabled: boolean
) {
  // Create notification in database
  const notification = await createNotification(payload);

  // Send email if enabled
  if (emailEnabled) {
    try {
      await sendNotificationEmail({
        to: userEmail,
        userName,
        notification,
      });
    } catch (error) {
      console.error('Failed to send email notification:', error);
      // Don't fail notification creation if email fails
    }
  }

  return notification;
}
```

### **STEP 5: Respect User Preferences**

```typescript
// Check user preferences before sending
async function shouldSendEmail(
  userId: string,
  workspaceId: string,
  category: string
): Promise<boolean> {
  const preferences = await getNotificationPreferences(userId, workspaceId);

  // Check global email enabled
  if (!preferences.emailEnabled) return false;

  // Check quiet hours
  if (preferences.quietHours.enabled) {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });

    const { start, end } = preferences.quietHours;

    if (isInQuietHours(currentTime, start, end)) {
      return false;
    }
  }

  // Check category preferences
  if (!preferences.categorySettings[category]) {
    return false;
  }

  return true;
}

function isInQuietHours(current: string, start: string, end: string): boolean {
  // Handle overnight ranges (e.g., 22:00 to 08:00)
  if (start > end) {
    return current >= start || current < end;
  }
  return current >= start && current < end;
}
```

---

## 📧 EMAIL TEMPLATES

### **Available Templates**

1. **Single Notification Email** ✅
   - Individual notification
   - Action button
   - Category-specific styling

2. **Digest Email** (TODO)
   - Daily/weekly summary
   - Grouped by category
   - Unread count

3. **Welcome Email** (TODO)
   - New user onboarding
   - Quick start guide

4. **Reset Password** (TODO)
   - Password reset link
   - Security notice

---

## 🧪 TESTING

### **Local Testing (Resend)**

```typescript
// Test email sending
import { sendNotificationEmail } from '@/lib/email/email-service';

// In your API route or test file
await sendNotificationEmail({
  to: 'your-email@example.com',
  userName: 'Test User',
  notification: {
    id: 'test-1',
    title: 'Test Notification',
    message: 'This is a test email notification',
    type: 'info',
    category: 'system',
    priority: 'normal',
    read: false,
    archived: false,
    createdAt: new Date(),
  },
});
```

### **Preview Emails**

React Email provides a dev server to preview emails:

```bash
npx react-email dev
```

Open `http://localhost:3000` to see all email templates.

---

## 🔐 SECURITY CONSIDERATIONS

1. **API Keys**
   - Never commit API keys to git
   - Use environment variables
   - Rotate keys regularly

2. **Email Validation**
   - Validate email addresses before sending
   - Implement rate limiting
   - Track bounces and unsubscribes

3. **User Privacy**
   - Allow users to opt-out
   - Respect quiet hours
   - Provide unsubscribe link

4. **Spam Prevention**
   - Don't send too many emails
   - Batch notifications into digests
   - Monitor sender reputation

---

## 📊 MONITORING

### **Email Metrics to Track**

1. **Delivery Rate**
   - Successful sends
   - Bounces (hard/soft)
   - Spam complaints

2. **Engagement**
   - Open rate
   - Click-through rate
   - Unsubscribe rate

3. **Performance**
   - Send time
   - Queue length
   - Error rate

### **Logging**

```typescript
// Log email events to notification_events table
await createNotificationEvent({
  notification_id: notification.id,
  event_type: 'email_sent',
  metadata: {
    to: userEmail,
    provider: 'resend',
    message_id: data.id,
  },
});
```

---

## 💰 COST ESTIMATION

### **Resend Pricing**

- **Free Tier:** 3,000 emails/month, 100/day
- **Pro:** $20/month for 50,000 emails
- **Scale:** $80/month for 500,000 emails

### **Expected Usage**

For 100 users with moderate activity:
- ~10 notifications/user/day
- 50% email enabled
- = ~500 emails/day
- = ~15,000 emails/month

**Recommendation:** Start with Free tier, upgrade to Pro at ~2,500 emails/month.

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Install email provider SDK (resend)
- [ ] Add API keys to environment variables
- [ ] Create email templates
- [ ] Implement email service
- [ ] Update notification creation logic
- [ ] Add preference checking
- [ ] Test locally
- [ ] Test in staging
- [ ] Monitor first 100 emails
- [ ] Set up error alerting
- [ ] Document for team

---

## 📚 RESOURCES

- [Resend Documentation](https://resend.com/docs)
- [React Email Components](https://react.email)
- [SendGrid Documentation](https://docs.sendgrid.com)
- [Email Best Practices](https://www.emailonacid.com/blog)

---

## 🎓 NEXT STEPS

1. **Immediate:**
   - Sign up for Resend account
   - Get API key
   - Test first email

2. **Short-term:**
   - Create digest email template
   - Implement email queue
   - Add retry logic

3. **Long-term:**
   - Push notifications (Web Push API)
   - SMS notifications (Twilio)
   - In-app notification center page

---

**Status:** 📧 Ready for Integration  
**Owner:** Development Team  
**Priority:** Medium  
**Estimated Time:** 4-6 hours
