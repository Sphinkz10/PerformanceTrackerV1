import React, { useState } from 'react';
import { useTranslation } from '../../contexts/I18nContext';
import { Headphones, ChevronDown, Facebook } from 'lucide-react';

export function LoginV2() {
  const { t, language, setLanguage } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const brandName = t('brand.name');

  const handleLanguageChange = (lang: 'pt' | 'en' | 'es' | 'fr') => {
    setLanguage(lang);
    setIsLangOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#011C40] relative overflow-hidden flex items-center justify-center font-sans">
      {/* Background Atmospheric Lighting */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#023859] rounded-full blur-[120px] opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#023859] rounded-full blur-[150px] opacity-40 translate-x-1/3 translate-y-1/3"></div>

      {/* Background Texture (Mock Athlete Image) */}
      <div className="absolute inset-0 mix-blend-overlay opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 0%, #011C40 100%)' }}>
        {/* We can use a pattern or just leave the subtle gradient for now if no image is provided */}
      </div>

      {/* Floating Utilities (Top Right) */}
      <div className="absolute top-6 right-6 flex gap-4 z-50">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <span className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center bg-white/20 text-[10px] font-bold">
              {language === 'pt' && '🇵🇹'}
              {language === 'en' && '🇬🇧'}
              {language === 'es' && '🇪🇸'}
              {language === 'fr' && '🇫🇷'}
            </span>
            <span className="text-sm font-medium uppercase">{language}</span>
            <ChevronDown className="w-4 h-4 text-white/70" />
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-2 py-2 w-32 bg-[#011C40]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden">
              <button onClick={() => handleLanguageChange('pt')} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2">
                <span>🇵🇹</span> PT
              </button>
              <button onClick={() => handleLanguageChange('en')} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2">
                <span>🇬🇧</span> EN
              </button>
              <button onClick={() => handleLanguageChange('es')} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2">
                <span>🇪🇸</span> ES
              </button>
              <button onClick={() => handleLanguageChange('fr')} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2">
                <span>🇫🇷</span> FR
              </button>
            </div>
          )}
        </div>

        {/* Support Button */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20 transition-colors">
          <Headphones className="w-4 h-4 text-[#A7EBF2]" />
          <span className="text-sm font-medium">{t('support')}</span>
        </button>
      </div>

      {/* Central Glass Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
              {t('login.title')}
            </h1>
            <p className="text-sm text-[#94A3B8]">
              {t('login.subtitle', { brandName })}
            </p>
          </div>

          {/* Form placeholder */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-[#94A3B8]">
                {t('login.email_label')}
              </label>
              <input
                id="email"
                type="email"
                placeholder={t('login.email_placeholder')}
                className="w-full bg-black/20 border-0 rounded-xl px-4 py-3 text-white placeholder:text-[#94A3B8]/50 focus:ring-1 focus:ring-[#54ACBF] focus:outline-none transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-[#94A3B8]">
                {t('login.password_label')}
              </label>
              <input
                id="password"
                type="password"
                className="w-full bg-black/20 border-0 rounded-xl px-4 py-3 text-white placeholder:text-[#94A3B8]/50 focus:ring-1 focus:ring-[#54ACBF] focus:outline-none transition-all"
                required
              />
              <div className="flex justify-end mt-1">
                <a href="#" className="text-xs text-[#94A3B8] hover:text-white transition-colors">
                  {t('login.forgot_password')}
                </a>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#A7EBF2] to-[#54ACBF] text-[#011C40] font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(167,235,242,0.3)] hover:shadow-[0_0_25px_rgba(167,235,242,0.4)] transition-all transform hover:-translate-y-0.5"
            >
              {t('login.cta_button')}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-[#94A3B8] text-xs">
                {t('login.divider')}
              </span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Google</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-transparent border border-white/10 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <Facebook className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Facebook</span>
              </button>
            </div>

            {/* Footer Link */}
            <div className="text-center mt-6">
              <a href="#" className="text-sm text-[#94A3B8] hover:text-[#A7EBF2] transition-colors">
                {t('login.no_account')}
              </a>
            </div>

          </form>
        </div>
      </div>

      {/* Brand Slogan */}
      <div className="absolute bottom-6 w-full text-center z-10 px-6">
        <p className="text-[#94A3B8] text-xs font-medium tracking-wide opacity-60">
          {t('brand.slogan')}
        </p>
      </div>

    </div>
  );
}
