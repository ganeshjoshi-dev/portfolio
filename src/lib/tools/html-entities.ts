/**
 * Common HTML named entities (subset). Full list is large; this covers typical use.
 * Decode: entity -> character. Encode: character -> entity (for a few key chars we prefer named).
 */
export const namedEntities: Record<string, string> = {
  '&nbsp;': '\u00A0',
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
  '&quot;': '"',
  '&apos;': "'",
  '&copy;': '\u00A9',
  '&reg;': '\u00AE',
  '&trade;': '\u2122',
  '&ndash;': '\u2013',
  '&mdash;': '\u2014',
  '&hellip;': '\u2026',
  '&bull;': '\u2022',
  '&rarr;': '\u2192',
  '&larr;': '\u2190',
  '&uarr;': '\u2191',
  '&darr;': '\u2193',
  '&lsquo;': '\u2018',
  '&rsquo;': '\u2019',
  '&ldquo;': '\u201C',
  '&rdquo;': '\u201D',
  '&middot;': '\u00B7',
  '&deg;': '\u00B0',
  '&plusmn;': '\u00B1',
  '&times;': '\u00D7',
  '&divide;': '\u00F7',
  '&frac12;': '\u00BD',
  '&frac14;': '\u00BC',
  '&frac34;': '\u00BE',
  '&euro;': '\u20AC',
  '&pound;': '\u00A3',
  '&yen;': '\u00A5',
  '&cent;': '\u00A2',
  '&sect;': '\u00A7',
  '&para;': '\u00B6',
  '&laquo;': '\u00AB',
  '&raquo;': '\u00BB',
  '&tilde;': '\u02DC',
  '&circ;': '\u02C6',
  '&macr;': '\u00AF',
  '&acute;': '\u00B4',
  '&uml;': '\u00A8',
  '&cedil;': '\u00B8',
  '&not;': '\u00AC',
  '&infin;': '\u221E',
  '&le;': '\u2264',
  '&ge;': '\u2265',
  '&ne;': '\u2260',
  '&equiv;': '\u2261',
  '&alpha;': '\u03B1',
  '&beta;': '\u03B2',
  '&gamma;': '\u03B3',
  '&delta;': '\u03B4',
  '&epsilon;': '\u03B5',
  '&lambda;': '\u03BB',
  '&mu;': '\u03BC',
  '&pi;': '\u03C0',
  '&sigma;': '\u03C3',
  '&omega;': '\u03C9',
};

/** Characters we encode to named form when encoding to named entities */
const encodeNamedMap: Record<string, string> = {
  ' ': '&nbsp;',
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#39;',
  '\u00A0': '&nbsp;',
  '\u00A9': '&copy;',
  '\u00AE': '&reg;',
};

/** Decode HTML entities (named + numeric). */
export function decodeHtmlEntities(html: string): string {
  return html.replace(/&(?:#(\d+)|#x([0-9a-fA-F]+)|([a-zA-Z]+));/g, (_, dec, hex, name) => {
    if (dec !== undefined) return String.fromCodePoint(parseInt(dec, 10));
    if (hex !== undefined) return String.fromCodePoint(parseInt(hex, 16));
    if (name !== undefined && namedEntities[`&${name};`] !== undefined) {
      return namedEntities[`&${name};`];
    }
    return `&${name};`;
  });
}

/** Encode to numeric entities (&#decimal; and &#xhex; for non-ASCII). */
export function encodeToNumeric(text: string, useHex = false): string {
  return text.replace(/[\u0080-\uFFFF]/g, (c) => {
    const code = c.codePointAt(0)!;
    return useHex ? `&#x${code.toString(16)};` : `&#${code};`;
  });
}

/** Encode to named entities where we have a mapping, else numeric. */
export function encodeToNamed(text: string): string {
  return text
    .split('')
    .map((c) => encodeNamedMap[c] ?? (c.codePointAt(0)! > 127 ? `&#${c.codePointAt(0)};` : c))
    .join('');
}
