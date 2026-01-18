import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Free Developer Tools by Ganesh Joshi';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  const tools = [
    'Gradient Generator',
    'JSON to TypeScript',
    'Regex Tester',
    'Color Palette',
    'Shadow Generator',
    'UUID Generator',
  ];

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0e27',
          backgroundImage: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #252d47 100%)',
          padding: 60,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #00D9FF 0%, #3B82F6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 'bold', color: '#0a0e27' }}>GJ</span>
            </div>
            <span style={{ fontSize: 24, color: '#64748b' }}>GJ Dev Tools</span>
          </div>
          <span style={{ fontSize: 20, color: '#10B981' }}>100% Free</span>
        </div>

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              marginBottom: 16,
            }}
          >
            Free Developer Tools
          </h1>
          <p
            style={{
              fontSize: 28,
              color: '#00D9FF',
              margin: 0,
              marginBottom: 40,
            }}
          >
            CSS Generators, Converters & Utilities
          </p>

          {/* Tool Grid */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            {tools.map((tool) => (
              <div
                key={tool}
                style={{
                  padding: '14px 24px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 10,
                  color: '#e2e8f0',
                  fontSize: 20,
                }}
              >
                {tool}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 18, color: '#64748b' }}>
            Beautiful UI • No Ads • Open Source
          </span>
          <span style={{ fontSize: 18, color: '#64748b' }}>ganeshjoshi.dev/tools</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
