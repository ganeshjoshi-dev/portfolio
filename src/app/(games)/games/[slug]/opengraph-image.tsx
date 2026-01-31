import { ImageResponse } from 'next/og';
import { getGameById } from '@/config/games';
import { siteConfig } from '@/lib/utils/seo';

export const alt = 'Free Online Game by Ganesh Joshi';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

type Props = { params: Promise<{ slug: string }> };

export async function generateImageMetadata({ params }: Props) {
  const { slug } = await params;
  const game = getGameById(slug);

  return [
    {
      id: slug,
      alt: game ? `${game.name} - Free Online Game` : 'Game',
      size,
      contentType,
    },
  ];
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const game = getGameById(slug);

  if (!game) {
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
          Game Not Found
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
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
          <span style={{ fontSize: 24, color: '#64748b' }}>{siteConfig.name}</span>
          <span style={{ fontSize: 20, color: '#475569', marginLeft: 16 }}>Games</span>
        </div>

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
          {game.name}
        </h1>
        <p
          style={{
            fontSize: 26,
            color: '#94a3b8',
            margin: 0,
            lineHeight: 1.5,
            maxWidth: 900,
          }}
        >
          {game.description}
        </p>

        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            marginTop: 40,
          }}
        >
          {game.keywords?.slice(0, 4).map((keyword) => (
            <div
              key={keyword}
              style={{
                padding: '10px 18px',
                backgroundColor: 'rgba(0, 217, 255, 0.1)',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                borderRadius: 8,
                color: '#00D9FF',
                fontSize: 18,
              }}
            >
              {keyword}
            </div>
          ))}
        </div>

        <p
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 18,
            color: '#64748b',
          }}
        >
          ganeshjoshi.dev{game.path}
        </p>
      </div>
    ),
    { ...size }
  );
}
