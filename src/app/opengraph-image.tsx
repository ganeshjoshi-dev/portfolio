import { ImageResponse } from 'next/og';

export const alt = 'Ganesh Joshi - Full Stack Developer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0e27',
          backgroundImage: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #252d47 100%)',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 217, 255, 0.15) 0%, transparent 70%)',
              position: 'absolute',
            }}
          />
        </div>

        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #00D9FF 0%, #3B82F6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20,
            }}
          >
            <span style={{ fontSize: 48, fontWeight: 'bold', color: '#0a0e27' }}>GJ</span>
          </div>
        </div>

        {/* Main Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
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
            Ganesh Joshi
          </h1>
          <p
            style={{
              fontSize: 32,
              color: '#00D9FF',
              margin: 0,
              marginBottom: 24,
            }}
          >
            Full Stack Developer
          </p>
          <p
            style={{
              fontSize: 24,
              color: '#94a3b8',
              margin: 0,
              maxWidth: 800,
            }}
          >
            Building fast, scalable web experiences with Next.js, React & TypeScript
          </p>
        </div>

        {/* Tech Stack */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 48,
          }}
        >
          {['Next.js', 'React', 'TypeScript', 'eCommerce'].map((tech) => (
            <div
              key={tech}
              style={{
                padding: '12px 24px',
                backgroundColor: 'rgba(0, 217, 255, 0.1)',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                borderRadius: 8,
                color: '#00D9FF',
                fontSize: 20,
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        {/* URL */}
        <p
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 20,
            color: '#64748b',
          }}
        >
          ganeshjoshi.dev
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
