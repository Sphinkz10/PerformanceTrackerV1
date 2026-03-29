/**
 * Seed Script - Form Submissions
 * 
 * Seeds initial form submissions data to test the Form Submissions History page.
 * Run this to populate the database with realistic test data.
 * 
 * @author PerformTrack Team
 * @since Fase 2.2
 */

import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b183f0a7/api/submissions`;

const sampleSubmissions = [
  {
    workspaceId: 'workspace-1',
    athleteId: 'athlete-1',
    formTemplateId: 'form-1',
    responses: [
      { question: 'Como se sente hoje?', answer: 'Muito bem!' },
      { question: 'Qualidade do sono (1-10)', answer: '8' },
      { question: 'Nível de energia (1-10)', answer: '7' },
      { question: 'Alguma dor ou desconforto?', answer: 'Não' },
    ],
  },
  {
    workspaceId: 'workspace-1',
    athleteId: 'athlete-2',
    formTemplateId: 'form-1',
    responses: [
      { question: 'Como se sente hoje?', answer: 'Um pouco cansado' },
      { question: 'Qualidade do sono (1-10)', answer: '6' },
      { question: 'Nível de energia (1-10)', answer: '5' },
      { question: 'Alguma dor ou desconforto?', answer: 'Leve dor no joelho esquerdo' },
    ],
  },
  {
    workspaceId: 'workspace-1',
    athleteId: 'athlete-3',
    formTemplateId: 'form-2',
    responses: [
      { question: 'Localização da dor', answer: 'Ombro direito' },
      { question: 'Intensidade (1-10)', answer: '4' },
      { question: 'Tipo de dor', answer: 'Aguda ao levantar o braço' },
      { question: 'Quanto tempo tem a dor?', answer: '3 dias' },
    ],
  },
  {
    workspaceId: 'workspace-1',
    athleteId: 'athlete-1',
    formTemplateId: 'form-3',
    responses: [
      { question: 'Como correu a semana de treino?', answer: 'Excelente! Consegui completar todos os treinos' },
      { question: 'Objetivos alcançados?', answer: 'Sim, aumentei 2.5kg no back squat' },
      { question: 'Sugestões de melhoria', answer: 'Podíamos ter mais treinos de mobilidade' },
    ],
  },
  {
    workspaceId: 'workspace-1',
    athleteId: 'athlete-2',
    formTemplateId: 'form-3',
    responses: [
      { question: 'Como correu a semana de treino?', answer: 'Bem, mas faltei a uma sessão' },
      { question: 'Objetivos alcançados?', answer: 'Parcialmente' },
      { question: 'Sugestões de melhoria', answer: 'Gostaria de ter mais feedback em tempo real' },
    ],
  },
];

async function seedSubmissions() {
  console.log('🌱 Seeding form submissions...');
  
  for (const submission of sampleSubmissions) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(submission),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Failed to create submission:', error);
        continue;
      }

      const result = await response.json();
      console.log('✅ Created submission:', result.data.id);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }

  console.log('🎉 Seeding complete!');
}

// Run if called directly
if (typeof window === 'undefined') {
  seedSubmissions();
}

export { seedSubmissions };
