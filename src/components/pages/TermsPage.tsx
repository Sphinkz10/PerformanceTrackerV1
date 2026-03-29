/**
 * Terms of Service Page — PerformTrack
 * CPL-002: LGPD/GDPR Compliance
 */

import { motion } from 'motion/react';
import { FileText, ArrowLeft } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

export function TermsPage({ onBack }: TermsPageProps) {
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
            <FileText className="h-5 w-5 text-sky-600" />
            <h1 className="font-semibold text-slate-900">Termos de Utilização</h1>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 py-8 space-y-8"
      >
        {/* Intro */}
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
          <p className="text-sm text-slate-700 leading-relaxed">
            Bem-vindo ao <strong>PerformTrack</strong>. Ao criar uma conta e utilizar a plataforma,
            aceita os presentes Termos de Utilização. Leia-os com atenção.
          </p>
          <p className="text-xs text-slate-500 mt-3">Última actualização: 29 de Março de 2026</p>
        </div>

        <Section title="1. Definições">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>"Plataforma"</strong> — o serviço PerformTrack, incluindo aplicação web e móvel</li>
            <li><strong>"Utilizador"</strong> — qualquer pessoa com conta registada (treinador ou atleta)</li>
            <li><strong>"Conteúdo"</strong> — dados, métricas, planos de treino e outros materiais inseridos na plataforma</li>
          </ul>
        </Section>

        <Section title="2. Condições de Acesso">
          <ul className="list-disc pl-5 space-y-2">
            <li>Deve ter pelo menos 16 anos para utilizar o PerformTrack</li>
            <li>Os dados fornecidos no registo devem ser verdadeiros e actualizados</li>
            <li>Cada conta é pessoal e intransmissível</li>
            <li>É responsável por manter a sua palavra-passe confidencial</li>
          </ul>
        </Section>

        <Section title="3. Utilização Permitida">
          <p>O PerformTrack destina-se exclusivamente a fins legítimos de acompanhamento desportivo.</p>
          <p className="mt-2 font-medium">É proibido:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Usar a plataforma para fins ilegais ou fraudulentos</li>
            <li>Aceder a dados de outros utilizadores sem autorização</li>
            <li>Tentar comprometer a segurança ou integridade do serviço</li>
            <li>Fazer engenharia reversa ou reproduzir o software</li>
            <li>Inserir conteúdo false, difamatório ou que viole direitos de terceiros</li>
          </ul>
        </Section>

        <Section title="4. Propriedade dos Dados">
          <p>
            Os seus dados pessoais e de treino <strong>pertencem-lhe</strong>. O PerformTrack não
            reivindica propriedade sobre o seu conteúdo. Concede-nos uma licença limitada para
            processar esses dados com o único propósito de fornecer o serviço.
          </p>
        </Section>

        <Section title="5. Dados de Saúde">
          <p>
            Alguns dados inseridos na plataforma (métricas de bem-estar, carga física, RPE)
            podem ser considerados dados de saúde. O tratamento destes dados é feito exclusivamente:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Com base no seu consentimento explícito, prestado no momento do registo</li>
            <li>Para fins de acompanhamento desportivo, com acesso restrito ao seu treinador</li>
          </ul>
          <p className="mt-3">
            Pode retirar este consentimento a qualquer momento, o que resultará na impossibilidade
            de utilizar funcionalidades dependentes desses dados.
          </p>
        </Section>

        <Section title="6. Disponibilidade do Serviço">
          <p>
            Esforçamo-nos por manter o serviço disponível 99,5% do tempo. Podem ocorrer
            interrupções para manutenção, que serão comunicadas com antecedência sempre que possível.
            Não somos responsáveis por perdas resultantes de indisponibilidade do serviço.
          </p>
        </Section>

        <Section title="7. Limitação de Responsabilidade">
          <p>
            O PerformTrack fornece as métricas e análises como <strong>apoio informativo</strong> e
            não como aconselhamento médico. Qualquer decisão relacionada com saúde deve ser tomada
            com base no julgamento de profissionais qualificados. Não assumimos responsabilidade
            por lesões ou danos resultantes do uso da plataforma.
          </p>
        </Section>

        <Section title="8. Cancelamento e Eliminação de Conta">
          <p>
            Pode eliminar a sua conta a qualquer momento através das Definições da Conta.
            Após eliminação, os seus dados serão apagados no prazo de 30 dias.
            Operações legítimas de acompanhamento desportivo previamente acordadas com o seu
            treinador podem manter registos anonimizados por período legalmente exigido.
          </p>
        </Section>

        <Section title="9. Alterações aos Termos">
          <p>
            Podemos actualizar estes termos. Alterações significativas serão comunicadas com
            30 dias de antecedência. A continuação do uso constitui aceitação.
          </p>
        </Section>

        <Section title="10. Lei Aplicável e Foro">
          <p>
            Estes termos são regidos pela lei portuguesa e, subsidiariamente, pelo direito da
            União Europeia. Qualquer litígio será submetido aos tribunais competentes de Lisboa,
            sem prejuízo do recurso a meios alternativos de resolução de conflitos.
          </p>
        </Section>

        <Section title="11. Contactos">
          <p>
            Para questões sobre estes termos:{' '}
            <a href="mailto:info@performtrack.app" className="text-sky-600 hover:underline">
              info@performtrack.app
            </a>
          </p>
        </Section>
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
