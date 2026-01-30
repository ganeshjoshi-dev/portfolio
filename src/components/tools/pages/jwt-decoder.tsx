'use client';

import { useState, useMemo } from 'react';
import { Clock, Key, AlertCircle } from 'lucide-react';
import { ToolLayout, CodeOutput, CopyButton } from '@/components/tools/shared';
import { getToolById, toolCategories } from '@/config/tools';

function base64UrlDecode(str: string): string {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    if (pad) base64 += '===='.slice(0, 4 - pad);
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return '';
  }
}

interface JWTDecoded {
  valid: true;
  header: string;
  payload: string;
  headerJson: Record<string, unknown>;
  payloadJson: Record<string, unknown>;
  exp?: number;
  iat?: number;
  iss?: string;
  sub?: string;
  expired?: boolean;
  expiresIn?: string;
}

interface JWTError {
  valid: false;
  error: string;
}

function decodeJwt(token: string): JWTDecoded | JWTError {
  const trimmed = token.trim();
  if (!trimmed) return { valid: false, error: 'Enter a JWT to decode.' };
  const parts = trimmed.split('.');
  if (parts.length !== 3) return { valid: false, error: 'Invalid JWT: expected 3 parts (header.payload.signature).' };
  try {
    const [headerB64, payloadB64] = parts;
    const headerStr = base64UrlDecode(headerB64);
    const payloadStr = base64UrlDecode(payloadB64);
    if (!headerStr || !payloadStr) return { valid: false, error: 'Failed to decode base64url segments.' };
    const headerJson = JSON.parse(headerStr) as Record<string, unknown>;
    const payloadJson = JSON.parse(payloadStr) as Record<string, unknown>;
    const header = JSON.stringify(headerJson, null, 2);
    const payload = JSON.stringify(payloadJson, null, 2);
    const exp = typeof payloadJson.exp === 'number' ? payloadJson.exp : undefined;
    const iat = typeof payloadJson.iat === 'number' ? payloadJson.iat : undefined;
    const iss = typeof payloadJson.iss === 'string' ? payloadJson.iss : undefined;
    const sub = typeof payloadJson.sub === 'string' ? payloadJson.sub : undefined;
    const now = Math.floor(Date.now() / 1000);
    const expired = exp != null ? now > exp : undefined;
    let expiresIn: string | undefined;
    if (exp != null && !expired) {
      const sec = exp - now;
      if (sec < 60) expiresIn = `${sec}s`;
      else if (sec < 3600) expiresIn = `${Math.floor(sec / 60)}m`;
      else if (sec < 86400) expiresIn = `${Math.floor(sec / 3600)}h`;
      else expiresIn = `${Math.floor(sec / 86400)}d`;
    } else if (exp != null && expired) {
      expiresIn = 'Expired';
    }
    return {
      valid: true,
      header,
      payload,
      headerJson,
      payloadJson,
      exp,
      iat,
      iss,
      sub,
      expired,
      expiresIn,
    };
  } catch (e) {
    return {
      valid: false,
      error: e instanceof Error ? e.message : 'Failed to parse JWT segments as JSON.',
    };
  }
}

function formatTimestamp(sec: number): string {
  try {
    return new Date(sec * 1000).toISOString();
  } catch {
    return String(sec);
  }
}

const exampleJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MDAwMDAwMDB9.signature';

export default function JwtDecoderPage({ slug }: { slug: string }) {
  const tool = getToolById(slug)!;
  const category = toolCategories[tool.category];
  const [input, setInput] = useState('');

  const decoded = useMemo(() => (input.trim() ? decodeJwt(input) : null), [input]);

  return (
    <ToolLayout
      title="JWT Decoder"
      description="Decode JWT header and payload. View claims, expiration, and issuer. All processing in your browser."
      tool={tool}
      category={category}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-slate-300">JWT Token</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JWT here (e.g. eyJhbGciOiJIUzI1NiIs...)"
            className="w-full h-24 px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300 resize-none font-mono text-sm"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={() => setInput(exampleJwt)}
            className="text-xs text-slate-400 hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
          >
            Load example JWT
          </button>
        </div>

        {decoded === null && (
          <div className="p-6 bg-slate-900/40 border border-slate-700/60 rounded-xl text-center text-slate-500 text-sm">
            Paste a JWT above to decode header and payload. Signature is not verified (client-side only).
          </div>
        )}

        {decoded !== null && !decoded.valid && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400">Invalid JWT</p>
              <p className="text-sm text-slate-300 mt-1">{decoded.error}</p>
            </div>
          </div>
        )}

        {decoded !== null && decoded.valid && (
          <div className="space-y-6">
            {(decoded.exp != null || decoded.iat != null || decoded.iss != null || decoded.sub != null) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {decoded.iss != null && (
                  <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg">
                    <p className="text-xs text-slate-400">Issuer (iss)</p>
                    <p className="text-sm text-slate-200 font-mono truncate" title={decoded.iss}>
                      {decoded.iss}
                    </p>
                  </div>
                )}
                {decoded.sub != null && (
                  <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg">
                    <p className="text-xs text-slate-400">Subject (sub)</p>
                    <p className="text-sm text-slate-200 font-mono truncate" title={decoded.sub}>
                      {decoded.sub}
                    </p>
                  </div>
                )}
                {decoded.iat != null && (
                  <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg">
                    <p className="text-xs text-slate-400">Issued At (iat)</p>
                    <p className="text-sm text-slate-200 font-mono">{formatTimestamp(decoded.iat)}</p>
                  </div>
                )}
                {decoded.exp != null && (
                  <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-400">Expires (exp)</span>
                    </div>
                    <p className="text-sm text-slate-200 font-mono mt-1">{formatTimestamp(decoded.exp)}</p>
                    {decoded.expiresIn && (
                      <span
                        className={
                          decoded.expired
                            ? 'text-xs text-red-400 font-medium'
                            : 'text-xs text-emerald-400'
                        }
                      >
                        {decoded.expired ? 'Expired' : `Expires in ${decoded.expiresIn}`}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-300">Header</h3>
                  <CopyButton text={decoded.header} />
                </div>
                <CodeOutput code={decoded.header} language="json" title="Header" showLineNumbers />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-slate-300">Payload</h3>
                  <CopyButton text={decoded.payload} />
                </div>
                <CodeOutput code={decoded.payload} language="json" title="Payload" showLineNumbers />
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-900/40 border border-slate-700/60 rounded-xl">
          <h3 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Key className="w-4 h-4" />
            Privacy
          </h3>
          <p className="text-xs text-slate-400">
            Decoding runs entirely in your browser. We do not verify the signature (that would require your secret).
            Do not paste tokens that contain sensitive data into untrusted sites.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
