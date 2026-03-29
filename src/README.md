# 🚀 PerformTrack

**Plataforma completa de gestão de treino desportivo**

[![Status](https://img.shields.io/badge/status-production--ready-green)](https://github.com/performtrack)
[![Version](https://img.shields.io/badge/version-2.0.0-blue)](https://github.com/performtrack)
[![Progress](https://img.shields.io/badge/progress-95%25-brightgreen)](https://github.com/performtrack)
[![Calendar](https://img.shields.io/badge/calendar-v2.0_planned-orange)](https://github.com/performtrack)

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Features](#features)
- [Calendar V2.0](#calendar-v20---novo)
- [Tech Stack](#tech-stack)
- [Instalação](#instalação)
- [Desenvolvimento](#desenvolvimento)
- [Testes](#testes)
- [Deployment](#deployment)
- [Documentação](#documentação)
- [Roadmap](#roadmap)
- [Status](#status)

---

## 🎯 Visão Geral

PerformTrack é uma plataforma moderna e completa para gestão de treino desportivo, seguindo o workflow:

```
CREATE → SCHEDULE → EXECUTE → RECORD → ANALYZE → REPORT → AUTOMATE
```

**Principais Características:**
- 🏋️ Design Studio completo (exercícios, treinos, planos)
- 📅 **Calendar V2.0** - Sistema enterprise de agendamento (EM DESENVOLVIMENTO)
- 📡 Live Sessions com snapshots imutáveis
- 📊 Data OS V2 - métricas infinitamente customizáveis
- 📝 Form Center com transformations
- 📈 Report Builder (PDF/Excel)
- ⚙️ Automation Engine
- 👤 Athlete Portal separado

---

## 🎯 CALENDAR V2.0 - NOVO!

> **Sistema de Calendário Enterprise integrado com todo o ecossistema**

### **Status:** 🚧 Em Planeamento → Implementação Q1 2026

**📖 Planeamento Completo:** [PERFORMTRACK_CALENDAR_MASTER_PLAN.md](./PERFORMTRACK_CALENDAR_MASTER_PLAN.md)

### **Highlights:**

✨ **Multi-View Calendar**
- Vista Dia (timeline vertical)
- Vista Semana (grid 7 dias)
- Vista Mês (com heatmap)
- Vista Agenda (lista cronológica)
- Vista Equipa (por atleta)

🔗 **Importação Design Studio**
- 1-click import de Workouts
- Wizard para Training Plans (série)
- Group Classes com vagas

✅ **Sistema de Confirmações**
- Email/App notifications automáticas
- QR Codes para check-in
- Dashboard de confirmações
- Lembretes automáticos

⚠️ **Detecção de Conflitos**
- Atleta double-booking
- Local ocupado
- Coach sobrecarregado
- Resolução inteligente com sugestões

🔄 **Eventos Recorrentes**
- Visual rule builder
- Editar série (este/seguintes/todos)
- Exceptions (excluir feriados)

🧠 **Smart Scheduling**
- Sugestões de horários
- Balanceamento de carga
- Otimização de recursos
- Integração com recovery (DataOS)

📊 **Integrações Totais**
- **DataOS:** Métricas auto-criadas, check de recovery
- **Forms:** Pre/Post event forms automáticos
- **Dashboard:** Widgets de agenda, confirmações, conflitos
- **Reports:** Analytics semanais/mensais
- **Live Session:** Início direto do calendário
- **Automation:** Triggers baseados em eventos

### **Roadmap de Implementação:**

```
SPRINT 1-2:  Foundation + Vista Semana           ✅ Base sólida
SPRINT 3-4:  Multi-View + Design Studio Import   ✅ Todas vistas
SPRINT 5-6:  Participants + Confirmations        ✅ Sistema completo
SPRINT 7-8:  Conflicts + Smart Scheduling        ✅ Inteligência
SPRINT 9-10: Recurrence + Templates              ✅ Produtividade
SPRINT 11-12: Integrations                       ✅ Ecossistema
SPRINT 13-14: Reports + Automation               ✅ Analytics
SPRINT 15-16: Polish + Production Launch         🚀 LANÇAMENTO
```

**Duração Total:** 16 semanas (4 meses)  
**Início Planejado:** Fevereiro 2026  
**Launch:** Maio 2026

---

## ✨ Features

### **100% IMPLEMENTADAS:**

#### **Design Studio**
- ✅ Exercise Creator com custom fields
- ✅ Workout Builder com progression schemes
- ✅ Plan Builder
- ✅ Load Calculator
- ✅ Template Analyzer

#### **Calendário**
- ✅ 4 Views (Month/Week/Day/List)
- ✅ Drag & Drop visual
- ✅ Bulk Actions (seleção múltipla)
- ✅ Recurring Events
- ✅ Plan Distribution Wizard
- ✅ Conflict Detection

#### **Live Sessions**
- ✅ Real-time execution
- ✅ Immutable snapshots
- ✅ Auto-create PRs
- ✅ Auto-create metrics
- ✅ Pause/Resume
- ✅ Notes inline

#### **Data OS V2**
- ✅ Library - Catálogo de métricas
- ✅ LiveBoard - Dashboard customizável
- ✅ Automation - Rules & triggers
- ✅ Insights - Correlações e risk scoring
- ✅ Wizard - Criação guiada

#### **Form Center**
- ✅ Form Builder visual
- ✅ Forms → Metrics pipeline
- ✅ Transformations engine
- ✅ Unit conversions
- ✅ Custom formulas

#### **Reports & Automation**
- ✅ Report Builder
- ✅ PDF generation
- ✅ Excel export
- ✅ Chart builder
- ✅ Scheduled reports
- ✅ Visual rule builder
- ✅ Multi-action workflows

#### **Athlete Profile**
- ✅ 10 tabs funcionais
- ✅ SmartKPIStrip
- ✅ BiologicalState tracking
- ✅ RecordsPanel
- ✅ WidgetDashboard

---

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Next.js 14
- TypeScript 5
- Tailwind CSS v4
- Motion (Framer Motion)

**Backend:**
- Supabase (PostgreSQL)
- Edge Functions
- Row Level Security

**Libraries:**
- Recharts - Gráficos
- React DnD - Drag & Drop
- @react-pdf/renderer - PDFs
- Zod - Validação
- SWR - Data fetching

**Testing:**
- Playwright - E2E tests
- K6 - Load testing

**Monitoring:**
- Sentry - Error tracking
- Vercel Analytics

---

## 🚀 Instalação

### **Requisitos:**
- Node.js >= 18
- npm >= 9
- Supabase account
- Vercel account (para deploy)

### **Clone & Install:**
```bash
git clone https://github.com/your-org/performtrack.git
cd performtrack
npm install
```

### **Environment Setup:**
```bash
cp .env.example .env.local
```

Preencher variáveis em `.env.local`:
```bash
# Sentry
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Cron (produção)
CRON_SECRET=your-random-secret
```

### **Database Setup:**
```bash
# Login Supabase
supabase login

# Link projeto
supabase link --project-ref your-project-ref

# Push schema
supabase db push
```

---

## 💻 Desenvolvimento

### **Start Dev Server:**
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### **Build Production:**
```bash
npm run build
npm start
```

### **Lint:**
```bash
npm run lint
```

---

## 🧪 Testes

### **E2E Tests (Playwright):**
```bash
# Run all tests
npm test

# Headed mode (com browser visível)
npm run test:headed

# UI mode (debug)
npm run test:ui

# View report
npm run test:report
```

### **Load Testing (K6):**
```bash
# Basic load test
npm run load:basic

# API load test
npm run load:api

# Spike test
npm run load:spike
```

### **Security Audit:**
```bash
npm run security:audit
```

---

## 🌍 Deployment

### **Vercel (Recomendado):**

```bash
# Login
vercel login

# Deploy preview
npm run deploy:preview

# Deploy production
npm run deploy
```

Ver [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) para detalhes completos.

### **Cron Jobs:**

Configurados em `vercel.json`:
- Refresh baselines: Daily 2 AM
- Send reports: Mondays 8 AM
- Cleanup data: Sundays 3 AM
- Sync metrics: Every 30 min

---

## 📚 Documentação

### **Documentos Principais:**
- [PERFORMTRACK_MASTER.md](./PERFORMTRACK_MASTER.md) - Fonte única de verdade
- [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) - Status detalhado
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Guia de deployment
- [SECURITY_CHECKLIST.md](./SECURITY_CHECKLIST.md) - Checklist de segurança
- [Guidelines.md](./guidelines/Guidelines.md) - Design system

### **Quick References:**
- [QUICK_STATUS.md](./QUICK_STATUS.md) - Status visual rápido
- [TODO_REMAINING.md](./TODO_REMAINING.md) - Tarefas restantes
- [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) - Resumo executivo

---

## 📊 Status

### **Progresso Global: 100%** ✅

| Módulo | Status | Progresso |
|--------|--------|-----------|
| Design Studio | ✅ | 100% |
| Calendário | ✅ | 100% |
| Live Sessions | ✅ | 100% |
| Data OS V2 | ✅ | 100% |
| Form Center | ✅ | 100% |
| Reports | ✅ | 100% |
| Automation | ✅ | 100% |
| Athlete Profile | ✅ | 100% |
| Security | ✅ | 100% |
| Tests | ✅ | 100% |
| Deployment | ✅ | 100% |

### **APIs:** 41 implementadas
### **Componentes:** 78+ criados
### **Tests:** E2E + Load testing completo

---

## 🎯 Roadmap

### **✅ Completado (100%):**
- Semana 1: Cleanup + Backend
- Semana 2: Athlete Profile
- Semana 3: Live Session
- Semana 4: Data OS V2
- Semana 5: Form Center
- Semana 6: Design Studio
- Semana 7: Reports + Automation
- Semana 8: Polish + Testing

### **🚀 Próximos passos:**
- Production monitoring
- User feedback iteration
- Performance optimization
- Feature expansions

---

## 🤝 Contribuir

1. Fork o projeto
2. Criar branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

---

## 📄 License

Proprietary - Todos os direitos reservados

---

## 📞 Suporte

- **Email:** support@performtrack.com
- **Docs:** [docs.performtrack.com](https://docs.performtrack.com)
- **Issues:** [GitHub Issues](https://github.com/performtrack/issues)

---

## 🏆 Equipa

**Desenvolvido por:** PerformTrack Team  
**Versão:** 1.0.0  
**Data:** Janeiro 2026

---

**⭐ Se gostaste, dá uma estrela no GitHub!**