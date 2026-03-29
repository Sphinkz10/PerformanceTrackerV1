/**
 * Privacy Policy Page — PerformTrack
 * CPL-002: LGPD/GDPR Compliance
 */

import { motion } from 'motion/react';
import { Shield, ArrowLeft, Mail } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
}

export function PrivacyPage({ onBack }: PrivacyPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-slate-200/80">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Voltar"
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-sky-600" />
            <h1 className="font-semibold text-slate-900">Política de Privacidade</h1>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 py-8 space-y-8"
      >
        {/* Intro block */}
        <div className="rounded-2xl bg-sky-50 border border-sky-100 p-6">
          <p className="text-sm text-sky-800 leading-relaxed">
            <strong>PerformTrack</strong> está comprometido com a protecção dos seus dados pessoais.
            Esta política descreve como recolhemos, usamos e protegemos as suas informações, em
            conformidade com a <strong>Lei Geral de Protecção de Dados (LGPD — Lei nº 13.709/2018)</strong> e o
            Regulamento Geral de Protecção de Dados da UE (<strong>RGPD/GDPR</strong>).
          </p>
          <p className="text-xs text-sky-600 mt-3">Última actualização: 29 de Março de 2026</p>
        </div>

        <Section title="1. Responsável pelo Tratamento">
          <p>
            <strong>PerformTrack</strong> é responsável pelo tratamento dos seus dados pessoais.
            Para questões relacionadas com privacidade, contacte: <a href="mailto:privacidade@performtrack.app" className="text-sky-600 hover:underline">privacidade@performtrack.app</a>
          </p>
        </Section>

        <Section title="2. Dados que Recolhemos">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Dados de identificação:</strong> nome, email, função (treinador/atleta)</li>
            <li><strong>Dados de saúde e desempenho:</strong> métricas de treino, bem-estar, carga física (apenas quando inseridos voluntariamente)</li>
            <li><strong>Dados de utilização:</strong> páginas visitadas, funcionalidades utilizadas, data e hora de acesso</li>
            <li><strong>Dados técnicos:</strong> endereço IP, tipo de dispositivo, browser (para segurança e diagnóstico)</li>
          </ul>
        </Section>

        <Section title="3. Finalidade do Tratamento">
          <ul className="list-disc pl-5 space-y-2">
            <li>Prestação dos serviços da plataforma PerformTrack</li>
            <li>Gestão da relação treinador–atleta</li>
            <li>Análise e melhoria contínua do desempenho desportivo</li>
            <li>Comunicações relacionadas com a conta e o serviço</li>
            <li>Cumprimento de obrigações legais</li>
          </ul>
        </Section>

        <Section title="4. Base Legal para o Tratamento">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Consentimento</strong> — para dados de saúde e para comunicações de marketing (art. 7.º LGPD / art. 6.º(a) RGPD)</li>
            <li><strong>Execução de contrato</strong> — para fornecer o serviço (art. 7.º, V LGPD / art. 6.º(b) RGPD)</li>
            <li><strong>Interesse legítimo</strong> — para segurança e prevenção de fraude (art. 7.º, IX LGPD)</li>
          </ul>
        </Section>

        <Section title="5. Partilha de Dados">
          <p>
            Os seus dados <strong>não são vendidos</strong> a terceiros. Partilhamos dados apenas com:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li><strong>Supabase</strong> — infraestrutura de base de dados (processador de dados autorizado)</li>
            <li><strong>Sentry</strong> — monitorização de erros (dados técnicos anónimos)</li>
            <li>Autoridades competentes, quando exigido por lei</li>
          </ul>
        </Section>

        <Section title="6. Retenção de Dados">
          <p>
            Os seus dados são conservados enquanto a sua conta estiver activa. Após eliminação da conta,
            os dados são apagados no prazo de <strong>30 dias</strong>, salvo obrigação legal de retenção mais longa.
          </p>
        </Section>

        <Section title="7. Os Seus Direitos">
          <p>Tem direito a:</p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li><strong>Acesso</strong> — obter confirmação e cópia dos seus dados</li>
            <li><strong>Rectificação</strong> — corrigir dados incompletos ou incorrectos</li>
            <li><strong>Eliminação</strong> — solicitar o apagamento dos seus dados ("direito ao esquecimento")</li>
            <li><strong>Portabilidade</strong> — receber os seus dados em formato estruturado</li>
            <li><strong>Oposição</strong> — opor-se ao tratamento em determinadas circunstâncias</li>
            <li><strong>Retirada do consentimento</strong> — a qualquer momento, sem afectar a licitude do tratamento anterior</li>
          </ul>
          <p className="mt-4 text-sm">
            Para exercer os seus direitos: <a href="mailto:privacidade@performtrack.app" className="text-sky-600 hover:underline">privacidade@performtrack.app</a>
          </p>
        </Section>

        <Section title="8. Segurança">
          <p>
            Implementamos medidas técnicas e organizativas adequadas para proteger os seus dados:
            encriptação em trânsito (TLS), controlo de acesso baseado em funções (RLS),
            autenticação segura via Supabase Auth, e monitorização de incidentes via Sentry.
          </p>
        </Section>

        <Section title="9. Cookies">
          <p>
            Utilizamos apenas cookies estritamente necessários para o funcionamento da sessão.
            Não utilizamos cookies de rastreio ou publicidade.
          </p>
        </Section>

        <Section title="10. Alterações a Esta Política">
          <p>
            Comunicaremos alterações significativas por email ou via notificação na app com
            pelo menos 30 dias de antecedência. A utilização continuada da plataforma após
            esse prazo constitui aceitação das alterações.
          </p>
        </Section>

        {/* Contact footer */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shrink-0">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-1">Contacte-nos</p>
            <p className="text-sm text-slate-600">
              Encarregado de Protecção de Dados (DPO):{' '}
              <a href="mailto:privacidade@performtrack.app" className="text-sky-600 hover:underline">
                privacidade@performtrack.app
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Helper component
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">{title}</h2>
      <div className="text-sm text-slate-700 leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
