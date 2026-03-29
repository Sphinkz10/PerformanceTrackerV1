/**
 * Safe Formula Evaluator
 * 
 * Replaces unsafe `new Function()` calls with a whitelist-based
 * arithmetic expression evaluator. Only allows numbers, basic math
 * operators, parentheses, and the Math object.
 * 
 * @security Prevents RCE (Remote Code Execution) - SEC-001
 * @since Security Audit Phase 1
 */

/**
 * Whitelist pattern for safe arithmetic expressions.
 * Allows: digits, decimals, +, -, *, /, %, parentheses, spaces,
 * Math.* functions (abs, ceil, floor, round, pow, sqrt, min, max, log, PI, E)
 */
const SAFE_FORMULA_PATTERN = /^[\d\s\+\-\*\/\%\(\)\.\,]+(Math\.(abs|ceil|floor|round|pow|sqrt|min|max|log|PI|E)[\d\s\+\-\*\/\%\(\)\.\,]*)*$/;

/**
 * Allowed Math functions that can be used in formulas
 */
const SAFE_MATH_FUNCTIONS: Record<string, (...args: number[]) => number> = {
  'Math.abs': Math.abs,
  'Math.ceil': Math.ceil,
  'Math.floor': Math.floor,
  'Math.round': Math.round,
  'Math.pow': Math.pow,
  'Math.sqrt': Math.sqrt,
  'Math.min': Math.min,
  'Math.max': Math.max,
  'Math.log': Math.log,
};

const SAFE_MATH_CONSTANTS: Record<string, number> = {
  'Math.PI': Math.PI,
  'Math.E': Math.E,
};

/**
 * Tokenize and evaluate a simple arithmetic expression safely.
 * Does NOT use eval() or new Function().
 * 
 * Supports: +, -, *, /, %, parentheses, decimals, negative numbers
 */
function tokenize(expr: string): string[] {
  const tokens: string[] = [];
  let current = '';
  
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    
    if (ch === ' ') {
      if (current) { tokens.push(current); current = ''; }
      continue;
    }
    
    if ('+-*/%()'.includes(ch)) {
      if (current) { tokens.push(current); current = ''; }
      tokens.push(ch);
    } else if (/[\d\.]/.test(ch)) {
      current += ch;
    } else {
      current += ch;
    }
  }
  
  if (current) tokens.push(current);
  return tokens;
}

/**
 * Simple recursive descent parser for arithmetic expressions.
 * Grammar:
 *   expr     = term (('+' | '-') term)*
 *   term     = factor (('*' | '/' | '%') factor)*
 *   factor   = '-' factor | atom
 *   atom     = NUMBER | '(' expr ')'
 */
class ExpressionParser {
  private tokens: string[];
  private pos: number;

  constructor(tokens: string[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

  private peek(): string | undefined {
    return this.tokens[this.pos];
  }

  private consume(): string {
    return this.tokens[this.pos++];
  }

  parse(): number {
    const result = this.expr();
    if (this.pos < this.tokens.length) {
      throw new Error(`Caracteres inesperados na fórmula: "${this.tokens.slice(this.pos).join(' ')}"`);
    }
    return result;
  }

  private expr(): number {
    let left = this.term();
    while (this.peek() === '+' || this.peek() === '-') {
      const op = this.consume();
      const right = this.term();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  private term(): number {
    let left = this.factor();
    while (this.peek() === '*' || this.peek() === '/' || this.peek() === '%') {
      const op = this.consume();
      const right = this.factor();
      if (op === '*') left *= right;
      else if (op === '/') {
        if (right === 0) throw new Error('Divisão por zero');
        left /= right;
      }
      else left %= right;
    }
    return left;
  }

  private factor(): number {
    if (this.peek() === '-') {
      this.consume();
      return -this.factor();
    }
    if (this.peek() === '+') {
      this.consume();
      return this.factor();
    }
    return this.atom();
  }

  private atom(): number {
    if (this.peek() === '(') {
      this.consume(); // '('
      const result = this.expr();
      if (this.peek() !== ')') {
        throw new Error('Parêntesis não fechado na fórmula');
      }
      this.consume(); // ')'
      return result;
    }

    const token = this.consume();
    if (token === undefined) {
      throw new Error('Fim inesperado da fórmula');
    }

    const num = Number(token);
    if (!isNaN(num)) {
      return num;
    }

    throw new Error(`Token inválido na fórmula: "${token}"`);
  }
}

/**
 * Safely evaluate a mathematical formula string.
 * 
 * @param formula - The formula string (e.g., "value * 2.205", "100 + 5 * 3")
 * @param variables - Variable substitutions (e.g., { value: 75 })
 * @returns The numeric result
 * @throws Error if the formula contains unsafe characters or is invalid
 * 
 * @example
 * safeEvaluateFormula("value * 2.205", { value: 75 }) // 165.375
 * safeEvaluateFormula("(value - 32) * 5 / 9", { value: 100 }) // 37.78
 */
export function safeEvaluateFormula(
  formula: string,
  variables: Record<string, number> = {}
): number {
  if (!formula || typeof formula !== 'string') {
    throw new Error('Fórmula inválida: deve ser uma string não-vazia');
  }

  // Step 1: Replace Math constants
  let processed = formula;
  for (const [constant, value] of Object.entries(SAFE_MATH_CONSTANTS)) {
    processed = processed.replaceAll(constant, value.toString());
  }

  // Step 2: Replace variables with their numeric values
  for (const [name, value] of Object.entries(variables)) {
    if (typeof value !== 'number' || !isFinite(value)) {
      throw new Error(`Variável "${name}" deve ser um número finito`);
    }
    // Replace whole-word matches only (avoid partial replacements)
    const regex = new RegExp(`\\b${name}\\b`, 'g');
    processed = processed.replace(regex, value.toString());
  }

  // Step 3: Handle Math.* functions by evaluating them
  // Match patterns like Math.abs(expr), Math.sqrt(expr), Math.pow(expr, expr)
  let maxIterations = 20; // Prevent infinite loops
  while (/Math\.\w+\(/.test(processed) && maxIterations-- > 0) {
    processed = processed.replace(
      /Math\.(\w+)\(([^()]*)\)/,
      (_match, funcName: string, args: string) => {
        const fullName = `Math.${funcName}`;
        const fn = SAFE_MATH_FUNCTIONS[fullName];
        if (!fn) {
          throw new Error(`Função Math não permitida: ${fullName}`);
        }
        // Evaluate each argument
        const argValues = args.split(',').map(arg => {
          const trimmed = arg.trim();
          if (!trimmed) throw new Error(`Argumento vazio em ${fullName}()`);
          return safeEvaluateFormula(trimmed, {});
        });
        return fn(...argValues).toString();
      }
    );
  }

  // Step 4: Validate the processed formula contains only safe characters
  const sanitized = processed.trim();
  if (!/^[\d\s\+\-\*\/\%\(\)\.]+$/.test(sanitized)) {
    throw new Error(`Fórmula contém caracteres não permitidos: "${sanitized}"`);
  }

  // Step 5: Tokenize and parse with recursive descent parser
  const tokens = tokenize(sanitized);
  if (tokens.length === 0) {
    throw new Error('Fórmula vazia após processamento');
  }

  const parser = new ExpressionParser(tokens);
  const result = parser.parse();

  // Step 6: Validate result
  if (!isFinite(result)) {
    throw new Error('Fórmula produziu resultado inválido (Infinity ou NaN)');
  }

  return result;
}

/**
 * Check if a formula string passes basic safety validation
 * without executing it.
 */
export function isFormulaSafe(formula: string): boolean {
  try {
    // Quick check: no dangerous patterns
    const dangerous = [
      'import', 'require', 'eval', 'Function', 'process',
      'window', 'document', 'fetch', 'XMLHttpRequest',
      'setTimeout', 'setInterval', 'constructor', '__proto__',
      'prototype', 'exec', 'child_process', 'fs.',
    ];
    
    const lower = formula.toLowerCase();
    for (const pattern of dangerous) {
      if (lower.includes(pattern.toLowerCase())) {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
}
