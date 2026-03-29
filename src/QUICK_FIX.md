# 🔧 QUICK FIX - RESOLVER ERRO

## ❌ O ERRO:
```
ReferenceError: process is not defined
```

## ✅ A SOLUÇÃO (3 passos):

### PASSO 1: Instalar Supabase
```bash
npm install @supabase/supabase-js
```

### PASSO 2: Criar .env.local (IMPORTANTE!)
```bash
# Criar o ficheiro na raiz do projeto
touch .env.local
```

Adicionar ao ficheiro (pode deixar vazio por agora):
```bash
# Supabase Configuration (opcional - app funciona sem isto)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# App Configuration
NEXT_PUBLIC_USE_REAL_DATA=false
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### PASSO 3: Reiniciar servidor
```bash
# Parar servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

---

## ✅ RESULTADO ESPERADO:

```bash
✓ Ready in 2.5s
⚠️ Supabase not configured - app will use mock mode
```

**ISTO É PERFEITO!** ✅

---

## 🎯 VERIFICAÇÃO:

1. ✅ App abre sem erros
2. ✅ Login page aparece
3. ⚠️  Console: "using mock mode" (NORMAL!)
4. ✅ Login: coach@demo.com / coach123
5. ✅ Dashboard carrega

---

## 📝 NOTAS:

**O `.env.local` é OBRIGATÓRIO** (mesmo vazio) para o Next.js processar corretamente as variáveis de ambiente.

**Mock Mode é bom!** Permite desenvolver sem configurar Supabase.

---

## 🚀 PRÓXIMO:

**Para continuar em Mock Mode:**
- Nada! Está tudo OK ✅
- Desenvolve normalmente

**Para usar dados reais:**
- Segue `SETUP_GUIDE.md`
- ~1 hora de setup

---

**TEMPO:** 2 minutos  
**DIFICULDADE:** ⭐ Fácil

**FEITO!** 🎉
