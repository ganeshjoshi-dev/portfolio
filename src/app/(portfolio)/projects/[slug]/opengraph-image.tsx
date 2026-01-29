import { ImageResponse } from 'next/og';
import { projects } from '@/lib/data/projects';

export const alt = 'Project by Ganesh Joshi';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);

  return [
    {
      id: params.slug,
      alt: project ? `${project.title} - Project by Ganesh Joshi` : 'Project',
      size,
      contentType,
    },
  ];
}

export default async function Image({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0e27',
            color: 'white',
            fontSize: 48,
          }}
        >
          Project Not Found
        </div>
      ),
      { ...size }
    );
  }

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
            <span style={{ fontSize: 24, color: '#64748b' }}>Ganesh Joshi</span>
          </div>
          <span style={{ fontSize: 20, color: '#64748b' }}>Project</span>
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
              fontSize: 56,
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              marginBottom: 24,
              lineHeight: 1.2,
            }}
          >
            {project.title}
          </h1>
          <p
            style={{
              fontSize: 28,
              color: '#94a3b8',
              margin: 0,
              lineHeight: 1.5,
              maxWidth: 900,
            }}
          >
            {project.description}
          </p>
        </div>

        {/* Tech Stack */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          {project.technologies.slice(0, 5).map((tech) => (
            <div
              key={tech}
              style={{
                padding: '10px 20px',
                backgroundColor: 'rgba(0, 217, 255, 0.1)',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                borderRadius: 8,
                color: '#00D9FF',
                fontSize: 18,
              }}
            >
              {tech}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 40,
          }}
        >
          <span style={{ fontSize: 18, color: '#64748b' }}>ganeshjoshi.dev</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
