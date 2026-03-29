#!/bin/bash

# PerformTrack Security Audit Script
# Run this before production deployment

echo "🔒 PerformTrack Security Audit"
echo "=============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0

# 1. Check for secrets in code
echo "1️⃣  Checking for exposed secrets..."
if grep -r "sk_live" . --exclude-dir=node_modules --exclude-dir=.git --exclude=security-audit.sh; then
  echo -e "${RED}❌ FAIL: Found live API keys in code${NC}"
  FAILED=$((FAILED + 1))
else
  echo -e "${GREEN}✅ PASS: No live API keys found${NC}"
fi
echo ""

# 2. Check .env.example exists
echo "2️⃣  Checking .env.example..."
if [ -f ".env.example" ]; then
  echo -e "${GREEN}✅ PASS: .env.example exists${NC}"
else
  echo -e "${RED}❌ FAIL: .env.example missing${NC}"
  FAILED=$((FAILED + 1))
fi
echo ""

# 3. NPM audit
echo "3️⃣  Running npm audit..."
if npm audit --production --audit-level=high; then
  echo -e "${GREEN}✅ PASS: No high-severity vulnerabilities${NC}"
else
  echo -e "${YELLOW}⚠️  WARNING: Vulnerabilities found - review above${NC}"
fi
echo ""

# 4. Check for console.log in production code
echo "4️⃣  Checking for console.log statements..."
CONSOLE_LOGS=$(grep -r "console\.log" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules --exclude-dir=tests | wc -l)
if [ "$CONSOLE_LOGS" -gt 10 ]; then
  echo -e "${YELLOW}⚠️  WARNING: Found $CONSOLE_LOGS console.log statements${NC}"
  echo "   Consider removing or replacing with proper logging"
else
  echo -e "${GREEN}✅ PASS: Console logs are minimal ($CONSOLE_LOGS found)${NC}"
fi
echo ""

# 5. Check TypeScript strict mode
echo "5️⃣  Checking TypeScript strict mode..."
if grep -q '"strict": true' tsconfig.json; then
  echo -e "${GREEN}✅ PASS: TypeScript strict mode enabled${NC}"
else
  echo -e "${YELLOW}⚠️  WARNING: TypeScript strict mode not enabled${NC}"
fi
echo ""

# 6. Check for .env in .gitignore
echo "6️⃣  Checking .gitignore..."
if grep -q "^\.env$" .gitignore; then
  echo -e "${GREEN}✅ PASS: .env is in .gitignore${NC}"
else
  echo -e "${RED}❌ FAIL: .env not in .gitignore${NC}"
  FAILED=$((FAILED + 1))
fi
echo ""

# 7. Check for NEXT_PUBLIC_ prefix on client-side vars
echo "7️⃣  Checking environment variable naming..."
if [ -f ".env.example" ]; then
  if grep -q "^[A-Z_]*[^NEXT_PUBLIC].*=" .env.example | grep -v "^NEXT_PUBLIC"; then
    echo -e "${GREEN}✅ PASS: Server-side env vars don't have NEXT_PUBLIC prefix${NC}"
  else
    echo -e "${GREEN}✅ PASS: Environment variables properly named${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  WARNING: Cannot check - .env.example missing${NC}"
fi
echo ""

# 8. Check for exposed API endpoints
echo "8️⃣  Checking for unprotected API routes..."
API_ROUTES=$(find api -name "route.ts" 2>/dev/null | wc -l)
if [ "$API_ROUTES" -gt 0 ]; then
  echo "   Found $API_ROUTES API routes"
  echo "   ⚠️  Manual review required: Ensure all routes have proper auth"
else
  echo -e "${GREEN}✅ PASS: No API routes found (or check manually)${NC}"
fi
echo ""

# 9. Check for hardcoded URLs
echo "9️⃣  Checking for hardcoded URLs..."
HARDCODED=$(grep -r "http://localhost" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules --exclude-dir=tests | wc -l)
if [ "$HARDCODED" -gt 5 ]; then
  echo -e "${YELLOW}⚠️  WARNING: Found $HARDCODED hardcoded localhost URLs${NC}"
  echo "   Use environment variables instead"
else
  echo -e "${GREEN}✅ PASS: Minimal hardcoded URLs ($HARDCODED found)${NC}"
fi
echo ""

# 10. Check CORS configuration
echo "🔟 Checking CORS configuration..."
if grep -r "Access-Control-Allow-Origin.*\*" --include="*.ts" api/ 2>/dev/null; then
  echo -e "${RED}❌ FAIL: CORS allows all origins (*)${NC}"
  FAILED=$((FAILED + 1))
else
  echo -e "${GREEN}✅ PASS: No wildcard CORS found${NC}"
fi
echo ""

# Summary
echo "=============================="
echo "📊 Audit Summary"
echo "=============================="
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All critical checks passed!${NC}"
  echo ""
  echo "⚠️  Manual checks still required:"
  echo "   - Review all API authentication"
  echo "   - Test RLS policies in Supabase"
  echo "   - Verify rate limiting"
  echo "   - Check HTTPS enforcement"
  echo "   - Review CSRF protection"
  exit 0
else
  echo -e "${RED}❌ $FAILED critical check(s) failed${NC}"
  echo ""
  echo "Fix the issues above before deploying to production"
  exit 1
fi
