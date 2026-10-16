const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createBanner() {
  const width = 1200;
  const height = 480;

  const svgBanner = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#090D16" />
        <stop offset="50%" stop-color="#0F172A" />
        <stop offset="100%" stop-color="#1E1B4B" />
      </linearGradient>

      <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38BDF8" />
        <stop offset="50%" stop-color="#6366F1" />
        <stop offset="100%" stop-color="#8B5CF6" />
      </linearGradient>

      <linearGradient id="accentGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#06B6D4" />
        <stop offset="100%" stop-color="#38BDF8" />
      </linearGradient>

      <radialGradient id="glow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#6366F1" stop-opacity="0.35" />
        <stop offset="60%" stop-color="#38BDF8" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#0F172A" stop-opacity="0" />
      </radialGradient>

      <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#6366F1" flood-opacity="0.6" />
      </filter>
    </defs>

    <!-- Deep Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGradient)" rx="16" />

    <!-- Ambient Glow -->
    <rect width="${width}" height="${height}" fill="url(#glow)" rx="16" />

    <!-- Subtle Grid Lines -->
    <g stroke="#334155" stroke-opacity="0.15" stroke-width="1">
      <line x1="0" y1="80" x2="${width}" y2="80" />
      <line x1="0" y1="160" x2="${width}" y2="160" />
      <line x1="0" y1="240" x2="${width}" y2="240" />
      <line x1="0" y1="320" x2="${width}" y2="320" />
      <line x1="0" y1="400" x2="${width}" y2="400" />
      <line x1="150" y1="0" x2="150" y2="${height}" />
      <line x1="300" y1="0" x2="300" y2="${height}" />
      <line x1="450" y1="0" x2="450" y2="${height}" />
      <line x1="600" y1="0" x2="600" y2="${height}" />
      <line x1="750" y1="0" x2="750" y2="${height}" />
      <line x1="900" y1="0" x2="900" y2="${height}" />
      <line x1="1050" y1="0" x2="1050" y2="${height}" />
    </g>

    <!-- Centered Kairon Vector Emblem (scale 2.2x) -->
    <g transform="translate(530, 48) scale(2.2)" filter="url(#logoShadow)">
      <!-- Precision Stem -->
      <rect x="10" y="8" width="9" height="48" rx="4.5" fill="url(#brandGradient)" />
      <!-- Upper Chevron -->
      <path d="M23 34 L45 10 H54 L32 34 Z" fill="url(#brandGradient)" />
      <!-- Lower Chevron -->
      <path d="M28 30 L54 54 H45 L21 32 Z" fill="url(#brandGradient)" opacity="0.95" />
      <!-- Central Kairos Temporal Core -->
      <polygon points="26,32 32,26 38,32 32,38" fill="url(#accentGradient)" />
      <circle cx="32" cy="32" r="2" fill="#FFFFFF" opacity="0.95" />
    </g>

    <!-- Brand Typography -->
    <text x="600" y="260" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="900" letter-spacing="6" fill="#FFFFFF" text-anchor="middle">
      KAIRON<tspan fill="#38BDF8">TASK</tspan>
    </text>

    <!-- Tagline -->
    <text x="600" y="305" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="500" letter-spacing="1.5" fill="#94A3B8" text-anchor="middle">
      Productivity Reimagined • Local-First Precision Time Tracking &amp; Task Management
    </text>

    <!-- Feature Pills -->
    <g transform="translate(250, 345)">
      <!-- Pill 1 -->
      <rect x="0" y="0" width="150" height="38" rx="19" fill="#1E293B" stroke="#38BDF8" stroke-opacity="0.4" stroke-width="1.2" />
      <text x="75" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#38BDF8" text-anchor="middle">⚡ Local-First</text>

      <!-- Pill 2 -->
      <rect x="170" y="0" width="165" height="38" rx="19" fill="#1E293B" stroke="#6366F1" stroke-opacity="0.4" stroke-width="1.2" />
      <text x="252" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#818CF8" text-anchor="middle">🔒 Zero Telemetry</text>

      <!-- Pill 3 -->
      <rect x="355" y="0" width="165" height="38" rx="19" fill="#1E293B" stroke="#06B6D4" stroke-opacity="0.4" stroke-width="1.2" />
      <text x="437" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#22D3EE" text-anchor="middle">⏳ Pomodoro &amp; Focus</text>

      <!-- Pill 4 -->
      <rect x="540" y="0" width="160" height="38" rx="19" fill="#1E293B" stroke="#8B5CF6" stroke-opacity="0.4" stroke-width="1.2" />
      <text x="620" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#C084FC" text-anchor="middle">🔄 E2EE Vector Sync</text>
    </g>

    <!-- Platform Icons Bar (Web, Windows, macOS, Linux, Android, iOS) -->
    <text x="600" y="430" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" letter-spacing="1" fill="#64748B" text-anchor="middle">
      WINDOWS • MACOS • LINUX • ANDROID • IOS • WEB &amp; PWA
    </text>
  </svg>
  `;

  const bannerPath = path.join(__dirname, '../docs/assets/kairontask-hero-banner.png');
  await sharp(Buffer.from(svgBanner)).png().toFile(bannerPath);

  console.log('✅ Hero banner generated successfully at:', bannerPath);
}

createBanner().catch(console.error);
