/**
 * CALENDAR EMAIL TEMPLATES
 * HTML templates for confirmation and reminder emails
 */

export interface EmailTemplateData {
  athleteName: string;
  eventTitle: string;
  eventDescription?: string;
  eventDate: string;
  eventTime: string;
  eventLocation?: string;
  coachName?: string;
  confirmationUrl: string;
  qrCodeUrl?: string;
  workspaceName?: string;
}

/**
 * Confirmation Email Template
 * Sent when event is created (24-168h before)
 */
export function getConfirmationEmailTemplate(data: EmailTemplateData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `📅 Confirme sua presença: ${data.eventTitle}`;
  
  const html = `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de Presença</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #334155;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      color: rgba(255, 255, 255, 0.9);
      margin: 10px 0 0;
      font-size: 16px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 20px;
    }
    .event-card {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border: 2px solid #bae6fd;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    .event-title {
      font-size: 22px;
      font-weight: 700;
      color: #0c4a6e;
      margin: 0 0 12px;
    }
    .event-detail {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 10px 0;
      color: #0369a1;
      font-size: 15px;
    }
    .event-detail-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }
    .event-description {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #bae6fd;
      color: #0c4a6e;
      font-size: 14px;
      line-height: 1.5;
    }
    .cta-container {
      text-align: center;
      margin: 32px 0;
    }
    .btn {
      display: inline-block;
      padding: 16px 48px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      border-radius: 12px;
      transition: all 0.2s;
    }
    .btn-primary {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    .btn-primary:hover {
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
      transform: translateY(-2px);
    }
    .btn-secondary {
      background: #ffffff;
      color: #ef4444;
      border: 2px solid #fecaca;
      margin-left: 12px;
    }
    .qr-section {
      text-align: center;
      margin: 32px 0;
      padding: 24px;
      background: #f8fafc;
      border-radius: 12px;
    }
    .qr-section h3 {
      margin: 0 0 12px;
      color: #1e293b;
      font-size: 16px;
    }
    .qr-section p {
      margin: 8px 0;
      color: #64748b;
      font-size: 14px;
    }
    .qr-code {
      margin: 16px auto;
      width: 200px;
      height: 200px;
    }
    .footer {
      background: #f8fafc;
      padding: 24px 30px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      margin: 8px 0;
      color: #64748b;
      font-size: 13px;
    }
    .footer a {
      color: #0ea5e9;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .container {
        margin: 0;
        border-radius: 0;
      }
      .header, .content, .footer {
        padding: 24px 20px;
      }
      .btn {
        display: block;
        margin: 8px 0;
      }
      .btn-secondary {
        margin-left: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>📅 ${data.workspaceName || 'PerformTrack'}</h1>
      <p>Confirmação de Presença</p>
    </div>
    
    <!-- Content -->
    <div class="content">
      <div class="greeting">
        Olá, ${data.athleteName}! 👋
      </div>
      
      <p>
        Você foi convidado(a) para participar do seguinte evento. 
        Por favor, confirme sua presença para nos ajudar no planejamento.
      </p>
      
      <!-- Event Card -->
      <div class="event-card">
        <h2 class="event-title">${data.eventTitle}</h2>
        
        <div class="event-detail">
          <span class="event-detail-icon">📅</span>
          <span><strong>${data.eventDate}</strong> às ${data.eventTime}</span>
        </div>
        
        ${data.eventLocation ? `
        <div class="event-detail">
          <span class="event-detail-icon">📍</span>
          <span>${data.eventLocation}</span>
        </div>
        ` : ''}
        
        ${data.coachName ? `
        <div class="event-detail">
          <span class="event-detail-icon">👤</span>
          <span>Coach: ${data.coachName}</span>
        </div>
        ` : ''}
        
        ${data.eventDescription ? `
        <div class="event-description">
          ${data.eventDescription}
        </div>
        ` : ''}
      </div>
      
      <!-- CTA Buttons -->
      <div class="cta-container">
        <a href="${data.confirmationUrl}?status=confirmed" class="btn btn-primary">
          ✅ Confirmar Presença
        </a>
        <a href="${data.confirmationUrl}?status=declined" class="btn btn-secondary">
          ❌ Não Posso Ir
        </a>
      </div>
      
      ${data.qrCodeUrl ? `
      <!-- QR Code Section -->
      <div class="qr-section">
        <h3>📱 Check-in com QR Code</h3>
        <p>No dia do evento, escaneie este código para fazer check-in:</p>
        <img src="${data.qrCodeUrl}" alt="QR Code" class="qr-code" />
        <p style="font-size: 12px; color: #94a3b8;">
          Você também pode fazer check-in diretamente no app
        </p>
      </div>
      ` : ''}
      
      <p style="margin-top: 32px; color: #64748b; font-size: 14px;">
        💡 <strong>Dica:</strong> Confirme sua presença o quanto antes para garantir sua vaga!
      </p>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>
        <strong>${data.workspaceName || 'PerformTrack'}</strong>
      </p>
      <p>
        Este é um email automático. 
        <a href="${data.confirmationUrl}">Ver detalhes do evento</a>
      </p>
      <p style="margin-top: 16px; font-size: 12px;">
        © ${new Date().getFullYear()} PerformTrack. Todos os direitos reservados.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Olá, ${data.athleteName}!

Você foi convidado(a) para participar do seguinte evento:

${data.eventTitle}
📅 ${data.eventDate} às ${data.eventTime}
${data.eventLocation ? `📍 ${data.eventLocation}` : ''}
${data.coachName ? `👤 Coach: ${data.coachName}` : ''}

${data.eventDescription || ''}

Por favor, confirme sua presença:

✅ Confirmar: ${data.confirmationUrl}?status=confirmed
❌ Não posso ir: ${data.confirmationUrl}?status=declined

---
${data.workspaceName || 'PerformTrack'}
© ${new Date().getFullYear()} PerformTrack
  `.trim();

  return { subject, html, text };
}

/**
 * Reminder Email Template
 * Sent 1-6h before event for pending confirmations
 */
export function getReminderEmailTemplate(data: EmailTemplateData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `⏰ Lembrete: ${data.eventTitle} acontece em breve!`;
  
  const html = `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lembrete de Evento</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #334155;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header p {
      color: rgba(255, 255, 255, 0.9);
      margin: 10px 0 0;
      font-size: 16px;
    }
    .content {
      padding: 40px 30px;
    }
    .alert-box {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 2px solid #fbbf24;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
      text-align: center;
    }
    .alert-box h2 {
      margin: 0 0 8px;
      color: #92400e;
      font-size: 20px;
    }
    .alert-box p {
      margin: 0;
      color: #78350f;
      font-size: 15px;
    }
    .event-card {
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    .event-title {
      font-size: 22px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 12px;
    }
    .event-detail {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 10px 0;
      color: #475569;
      font-size: 15px;
    }
    .cta-container {
      text-align: center;
      margin: 32px 0;
    }
    .btn {
      display: inline-block;
      padding: 16px 48px;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
      border-radius: 12px;
      transition: all 0.2s;
    }
    .btn-urgent {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      animation: pulse 2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .footer {
      background: #f8fafc;
      padding: 24px 30px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      margin: 8px 0;
      color: #64748b;
      font-size: 13px;
    }
    @media only screen and (max-width: 600px) {
      .container {
        margin: 0;
        border-radius: 0;
      }
      .header, .content, .footer {
        padding: 24px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>⏰ ${data.workspaceName || 'PerformTrack'}</h1>
      <p>Lembrete de Evento</p>
    </div>
    
    <!-- Content -->
    <div class="content">
      <div class="alert-box">
        <h2>🚨 Atenção, ${data.athleteName}!</h2>
        <p>Você ainda não confirmou presença para este evento</p>
      </div>
      
      <p style="text-align: center; font-size: 16px;">
        Seu evento acontece <strong>em breve</strong>. 
        Confirme agora para garantir sua participação!
      </p>
      
      <!-- Event Card -->
      <div class="event-card">
        <h2 class="event-title">${data.eventTitle}</h2>
        
        <div class="event-detail">
          <span>📅</span>
          <span><strong>${data.eventDate}</strong> às ${data.eventTime}</span>
        </div>
        
        ${data.eventLocation ? `
        <div class="event-detail">
          <span>📍</span>
          <span>${data.eventLocation}</span>
        </div>
        ` : ''}
        
        ${data.coachName ? `
        <div class="event-detail">
          <span>👤</span>
          <span>Coach: ${data.coachName}</span>
        </div>
        ` : ''}
      </div>
      
      <!-- CTA Button -->
      <div class="cta-container">
        <a href="${data.confirmationUrl}?status=confirmed" class="btn btn-urgent">
          ⚡ Confirmar Agora
        </a>
      </div>
      
      <p style="text-align: center; color: #64748b; font-size: 14px; margin-top: 24px;">
        Não pode comparecer? 
        <a href="${data.confirmationUrl}?status=declined" style="color: #ef4444;">Avise aqui</a>
      </p>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>
        <strong>${data.workspaceName || 'PerformTrack'}</strong>
      </p>
      <p>Este é um lembrete automático.</p>
      <p style="margin-top: 16px; font-size: 12px;">
        © ${new Date().getFullYear()} PerformTrack
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
⏰ LEMBRETE - ${data.athleteName}!

Você ainda não confirmou presença para:

${data.eventTitle}
📅 ${data.eventDate} às ${data.eventTime}
${data.eventLocation ? `📍 ${data.eventLocation}` : ''}

⚡ Confirme agora: ${data.confirmationUrl}?status=confirmed

Não pode comparecer? Avise aqui: ${data.confirmationUrl}?status=declined

---
${data.workspaceName || 'PerformTrack'}
© ${new Date().getFullYear()} PerformTrack
  `.trim();

  return { subject, html, text };
}
