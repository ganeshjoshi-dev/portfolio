/**
 * Client-side cron expression parser and next-run calculator.
 * Supports 5-field cron: minute, hour, day of month, month, day of week.
 * No external dependencies - all logic runs in the browser.
 */

const DOW_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface CronParseResult {
  valid: boolean;
  error?: string;
  minute: number[] | null;
  hour: number[] | null;
  dayOfMonth: number[] | null;
  month: number[] | null;
  dayOfWeek: number[] | null;
}

function parseCronField(
  str: string,
  min: number,
  max: number,
  names?: string[]
): number[] | null | false {
  const s = str.trim();
  if (s === '*' || s === '?') return null; // any

  const result: number[] = [];
  const parts = s.split(',');

  for (const part of parts) {
    const stepMatch = part.match(/^\*\/(\d+)$/);
    if (stepMatch) {
      const step = parseInt(stepMatch[1], 10);
      if (step < 1 || step > max - min + 1) return false;
      for (let i = min; i <= max; i += step) result.push(i);
      continue;
    }

    const rangeMatch = part.match(/^(\d+)-(\d+)(?:\/(\d+))?$/);
    if (rangeMatch) {
      let low = parseInt(rangeMatch[1], 10);
      let high = parseInt(rangeMatch[2], 10);
      const step = rangeMatch[3] ? parseInt(rangeMatch[3], 10) : 1;
      if (names) {
        const li = names.indexOf(part.split('-')[0]);
        const hi = names.indexOf(part.split('-')[1]);
        if (li >= 0 && hi >= 0) {
          low = li;
          high = hi;
        }
      }
      if (low < min || high > max || low > high || step < 1) return false;
      for (let i = low; i <= high; i += step) result.push(i);
      continue;
    }

    const num = parseInt(part, 10);
    if (!isNaN(num)) {
      if (num < min || num > max) return false;
      result.push(num);
      continue;
    }

    if (names) {
      const idx = names.findIndex((n) => n.toLowerCase() === part.toLowerCase());
      if (idx >= 0) {
        result.push(idx);
        continue;
      }
    }
    return false;
  }

  if (result.length === 0) return false;
  return [...new Set(result)].sort((a, b) => a - b);
}

export function parseCronExpression(expr: string): CronParseResult {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) {
    return {
      valid: false,
      error: 'Cron expression must have exactly 5 fields (minute hour day month weekday)',
      minute: null,
      hour: null,
      dayOfMonth: null,
      month: null,
      dayOfWeek: null,
    };
  }

  const minute = parseCronField(parts[0], 0, 59);
  const hour = parseCronField(parts[1], 0, 23);
  const dayOfMonth = parseCronField(parts[2], 1, 31);
  const month = parseCronField(parts[3], 1, 12);
  let dayOfWeek = parseCronField(parts[4], 0, 7, DOW_NAMES);
  if (Array.isArray(dayOfWeek)) {
    dayOfWeek = dayOfWeek.map((d) => (d === 7 ? 0 : d));
    dayOfWeek = [...new Set(dayOfWeek)].sort((a, b) => a - b);
  }

  if (minute === false || hour === false || dayOfMonth === false || month === false || dayOfWeek === false) {
    return {
      valid: false,
      error: 'Invalid value in one or more fields',
      minute: null,
      hour: null,
      dayOfMonth: null,
      month: null,
      dayOfWeek: null,
    };
  }

  return {
    valid: true,
    minute: minute ?? null,
    hour: hour ?? null,
    dayOfMonth: dayOfMonth ?? null,
    month: month ?? null,
    dayOfWeek: dayOfWeek ?? null,
  };
}

function matches(
  date: Date,
  parsed: CronParseResult
): boolean {
  const min = date.getMinutes();
  const hour = date.getHours();
  const dom = date.getDate();
  const month = date.getMonth() + 1;
  const dow = date.getDay();

  const match = (arr: number[] | null, val: number) =>
    arr === null || arr.includes(val);

  if (!match(parsed.minute, min)) return false;
  if (!match(parsed.hour, hour)) return false;
  if (!match(parsed.dayOfMonth, dom)) return false;
  if (!match(parsed.month, month)) return false;
  if (!match(parsed.dayOfWeek, dow)) return false;

  return true;
}

export function getNextRunTimes(
  expr: string,
  count: number,
  fromDate: Date = new Date()
): Date[] {
  const parsed = parseCronExpression(expr);
  if (!parsed.valid) return [];

  const results: Date[] = [];
  const start = new Date(fromDate);
  start.setSeconds(0, 0);
  if (start.getTime() <= fromDate.getTime()) {
    start.setMinutes(start.getMinutes() + 1);
  }

  const maxIterations = 60 * 24 * 366 * 2; // ~2 years of minutes
  let iterations = 0;

  while (results.length < count && iterations < maxIterations) {
    if (matches(start, parsed)) {
      results.push(new Date(start));
    }
    start.setMinutes(start.getMinutes() + 1);
    iterations++;
  }

  return results;
}

export function describeCron(expr: string): string {
  const parsed = parseCronExpression(expr);
  if (!parsed.valid) return 'Invalid expression';

  const minAny = parsed.minute === null;
  const hourAny = parsed.hour === null;
  const domAny = parsed.dayOfMonth === null;
  const monthAny = parsed.month === null;
  const dowAny = parsed.dayOfWeek === null;

  if (minAny && hourAny && domAny && monthAny && dowAny) return 'Every minute';

  if (!minAny && parsed.minute?.length === 1 && hourAny && domAny && monthAny && dowAny) {
    if (parsed.minute[0] === 0) return 'Every hour';
    return `Every hour at minute ${parsed.minute[0]}`;
  }

  if (parsed.minute?.length === 1 && parsed.minute[0] === 0 &&
      parsed.hour?.length === 1 && domAny && monthAny && dowAny) {
    return `Daily at ${String(parsed.hour[0]).padStart(2, '0')}:00`;
  }

  if (parsed.minute?.length === 1 && parsed.hour?.length === 1 &&
      domAny && monthAny && dowAny) {
    const m = String(parsed.minute[0]).padStart(2, '0');
    const h = String(parsed.hour[0]).padStart(2, '0');
    return `Daily at ${h}:${m}`;
  }

  if (parsed.minute?.length === 1 && parsed.minute[0] === 0 &&
      parsed.hour?.length === 1 && domAny && monthAny && !dowAny && parsed.dayOfWeek && parsed.dayOfWeek.length <= 5) {
    const h = String(parsed.hour[0]).padStart(2, '0');
    const days = parsed.dayOfWeek.map((d) => DOW_NAMES[d]).join(', ');
    return `At ${h}:00 on ${days}`;
  }

  const parts: string[] = [];
  if (parsed.minute !== null) parts.push(`minute ${parsed.minute.join(',')}`);
  if (parsed.hour !== null) parts.push(`hour ${parsed.hour.join(',')}`);
  if (parsed.dayOfMonth !== null) parts.push(`day ${parsed.dayOfMonth.join(',')}`);
  if (parsed.month !== null) parts.push(`month ${parsed.month.join(',')}`);
  if (parsed.dayOfWeek !== null) parts.push(`weekday ${parsed.dayOfWeek.join(',')}`);
  return parts.length > 0 ? parts.join(', ') : 'Every minute';
}

export const CRON_PRESETS: { name: string; expr: string }[] = [
  { name: 'Every minute', expr: '* * * * *' },
  { name: 'Every hour', expr: '0 * * * *' },
  { name: 'Every day at midnight', expr: '0 0 * * *' },
  { name: 'Every day at 9:00 AM', expr: '0 9 * * *' },
  { name: 'Every day at 2:30 AM', expr: '30 2 * * *' },
  { name: 'Weekdays at 9:00 AM', expr: '0 9 * * 1-5' },
  { name: 'Weekdays at 5:00 PM', expr: '0 17 * * 1-5' },
  { name: 'Every Sunday at midnight', expr: '0 0 * * 0' },
  { name: 'First day of month at midnight', expr: '0 0 1 * *' },
  { name: 'Every 15 minutes', expr: '*/15 * * * *' },
  { name: 'Every 30 minutes', expr: '*/30 * * * *' },
];
