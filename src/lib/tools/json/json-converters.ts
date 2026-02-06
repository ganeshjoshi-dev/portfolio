import yaml from 'js-yaml';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function safeTagName(key: string): string {
  if (/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(key)) return key;
  return 'item';
}

/**
 * Convert JSON to XML. Uses a root element and recursive conversion.
 * Arrays become repeated elements; object keys become element names (sanitized).
 */
export function jsonToXml(data: unknown, rootName = 'root'): string {
  function valueToXml(val: unknown, tag: string): string {
    if (val === null || val === undefined) {
      return `<${tag}/>`;
    }
    if (typeof val === 'boolean') {
      return `<${tag}>${val}</${tag}>`;
    }
    if (typeof val === 'number') {
      return `<${tag}>${val}</${tag}>`;
    }
    if (typeof val === 'string') {
      return `<${tag}>${escapeXml(val)}</${tag}>`;
    }
    if (Array.isArray(val)) {
      return val.map((item) => valueToXml(item, tag)).join('');
    }
    if (typeof val === 'object') {
      const entries = Object.entries(val as Record<string, unknown>);
      const inner = entries
        .map(([k, v]) => valueToXml(v, safeTagName(k)))
        .join('');
      return `<${tag}>${inner}</${tag}>`;
    }
    return `<${tag}/>`;
  }
  const inner = valueToXml(data, safeTagName(rootName));
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + inner;
}

/**
 * Flatten an object for CSV: nested objects become "key.nestedKey" and arrays are JSON-stringified.
 */
function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value === null || value === undefined) {
      out[path] = '';
    } else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
      out[path] = JSON.stringify(value);
    } else {
      out[path] = String(value);
    }
  }
  return out;
}

function escapeCsvCell(str: string): string {
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Convert JSON to CSV. Works best when root is an array of objects.
 * Uses first object's keys (flattened) as headers. Single object becomes one row.
 */
export function jsonToCsv(data: unknown): string {
  let rows: Record<string, string>[];
  if (Array.isArray(data)) {
    if (data.length === 0) return '';
    const first = data[0];
    if (first !== null && typeof first === 'object' && !Array.isArray(first)) {
      rows = data.map((item) =>
        typeof item === 'object' && item !== null && !Array.isArray(item)
          ? flattenObject(item as Record<string, unknown>)
          : { value: JSON.stringify(item) }
      );
    } else {
      rows = data.map((item) => ({ value: JSON.stringify(item) }));
    }
  } else if (data !== null && typeof data === 'object' && !Array.isArray(data)) {
    rows = [flattenObject(data as Record<string, unknown>)];
  } else {
    return escapeCsvCell(String(data));
  }
  const allKeys = new Set<string>();
  rows.forEach((r) => Object.keys(r).forEach((k) => allKeys.add(k)));
  const headers = Array.from(allKeys).sort();
  const headerLine = headers.map(escapeCsvCell).join(',');
  const dataLines = rows.map((row) => headers.map((h) => escapeCsvCell(row[h] ?? '')).join(','));
  return [headerLine, ...dataLines].join('\n');
}

/**
 * Convert JSON to YAML using js-yaml.
 */
export function jsonToYaml(data: unknown): string {
  return yaml.dump(data, { lineWidth: -1 });
}
