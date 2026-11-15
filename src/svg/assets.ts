/**
 * Original SVG assets: circular seal badge, rubber stamps, wire paperclip,
 * masking tape, perforated flag stamps, and animated checkboxes.
 */

import { esc } from '../escape';

export type FlagCode = 'IR' | 'CA' | 'DE' | 'NL' | 'US' | 'GB';

/** Personal "AB" hexagon emblem (public asset), reused by the cover seal + plain view. */
export const BADGE_EMBLEM_SRC = '/assets/badge-emblem.png';

export function renderCircularBadge(ringText: string): string {
  const safeText = esc(ringText);
  return `
    <svg class="cover-badge-svg" viewBox="0 0 120 120" width="94" height="94" role="img" aria-label="Ali Bazoubandi seal badge — click for a secret note">
      <defs>
        <path id="badge-ring-path" d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
        <clipPath id="badge-emblem-clip"><circle cx="60" cy="60" r="31" /></clipPath>
      </defs>
      <circle cx="60" cy="60" r="56" fill="#F3F0E8" stroke="#222222" stroke-width="2.2" />
      <!-- Dark navy medallion so the emblem's white letters + orange brackets keep contrast -->
      <circle cx="60" cy="60" r="34" fill="#0E1638" stroke="#222222" stroke-width="1.8" />
      <circle cx="60" cy="60" r="34" fill="none" stroke="#FF6A1A" stroke-width="1.4" opacity="0.85" />
      <g clip-path="url(#badge-emblem-clip)">
        <image href="${BADGE_EMBLEM_SRC}" x="12" y="12" width="96" height="96" preserveAspectRatio="xMidYMid meet" />
      </g>
      <text class="badge-ring-text" font-size="7.6" font-weight="700" letter-spacing="1.45" fill="#1F1F1F">
        <textPath href="#badge-ring-path" startOffset="2%">${safeText}</textPath>
      </text>
    </svg>
  `;
}

/**
 * Back portion of the wire paperclip (sits behind the polaroid, against the folder cover).
 */
export function renderPaperclipBack(): string {
  return `
    <svg class="paperclip-svg paperclip-back" viewBox="0 0 46 104" width="38" height="86" aria-hidden="true">
      <!-- Inner U-loop & right leg tucked behind the polaroid -->
      <path
        d="M27,25 L27,76 C27,86 15,86 15,76 L15,32 C15,24 23,24 23,32 L23,68"
        fill="none"
        stroke="#1C1C1C"
        stroke-width="4.4"
        stroke-linecap="round"
      />
      <path
        d="M27,25 L27,76 C27,86 15,86 15,76 L15,32 C15,24 23,24 23,32 L23,68"
        fill="none"
        stroke="#B8BEC9"
        stroke-width="1.8"
        stroke-linecap="round"
      />
    </svg>
  `;
}

/**
 * Front portion of the wire paperclip (hooks over the top edge and presses ONLY the long outer leg onto the photo).
 */
export function renderPaperclipFront(): string {
  return `
    <svg class="paperclip-svg paperclip-front" viewBox="0 0 46 104" width="38" height="86" aria-hidden="true">
      <!-- Subtle contact shadow on the polaroid -->
      <path
        d="M11,76 L11,22 C11,8 27,8 27,22 L27,28"
        fill="none"
        stroke="rgba(0,0,0,0.24)"
        stroke-width="4.6"
        stroke-linecap="round"
        transform="translate(2, 2)"
      />
      <!-- Outer hook & single long leg clamping the front of the polaroid -->
      <path
        d="M11,76 L11,22 C11,8 27,8 27,22 L27,28"
        fill="none"
        stroke="#1C1C1C"
        stroke-width="4.4"
        stroke-linecap="round"
      />
      <path
        d="M11,76 L11,22 C11,8 27,8 27,22 L27,28"
        fill="none"
        stroke="#E4E7EE"
        stroke-width="1.8"
        stroke-linecap="round"
      />
    </svg>
  `;
}

/**
 * Physical metallic binder / bulldog grip mounted at the top edge of the internal page stack.
 */
export function renderPageTopGrip(): string {
  return `
    <svg class="page-top-grip-svg" viewBox="0 0 180 56" width="164" height="50" aria-hidden="true">
      <!-- Twin steel wire handles folded up -->
      <path d="M58,24 L48,9 C45,4 52,2 58,4 L74,10 L74,24" fill="none" stroke="#1E1E1E" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" />
      <path d="M58,24 L48,9 C45,4 52,2 58,4 L74,10 L74,24" fill="none" stroke="#CFD4DD" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" />
      <path d="M122,24 L132,9 C135,4 128,2 122,4 L106,10 L106,24" fill="none" stroke="#1E1E1E" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" />
      <path d="M122,24 L132,9 C135,4 128,2 122,4 L106,10 L106,24" fill="none" stroke="#CFD4DD" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" />
      <!-- Hard offset shadow under clamp -->
      <rect x="26" y="25" width="132" height="24" rx="5" fill="rgba(0,0,0,0.2)" />
      <!-- Matte dark steel clamp body -->
      <rect x="24" y="22" width="132" height="24" rx="5" fill="#2B2E36" stroke="#141519" stroke-width="2.2" />
      <!-- Brushed metal ridge + grip rivets -->
      <rect x="30" y="26" width="120" height="5" rx="2.5" fill="#525866" />
      <circle cx="42" cy="37" r="3" fill="#B8BEC9" stroke="#141519" stroke-width="1.2" />
      <circle cx="138" cy="37" r="3" fill="#B8BEC9" stroke="#141519" stroke-width="1.2" />
      <!-- Label plate on grip -->
      <rect x="66" y="33" width="48" height="9" rx="2" fill="#E3D7C1" stroke="#141519" stroke-width="1" />
      <line x1="72" y1="37.5" x2="108" y2="37.5" stroke="#595348" stroke-width="1.4" stroke-dasharray="6 3" />
    </svg>
  `;
}

/**
 * Top-down / overhead view of a wooden & steel rubber hand stamper.
 * The rectangular stamp block sits flat against the paper (-11deg to match CASE CLOSED)
 * while the round wooden knob handle points upward directly toward the viewer.
 */
export function renderHandStamper(): string {
  return `
    <svg class="hand-stamper-svg" viewBox="0 0 280 150" width="260" height="140" aria-hidden="true">
      <g transform="translate(140, 75) rotate(-11)">
        <!-- Subtle red rubber pad peeking beneath the rectangular stamp block -->
        <rect x="-116" y="-42" width="232" height="84" rx="10" fill="#9E1B1B" stroke="#181818" stroke-width="2.4" />
        <!-- Beveled hardwood stamp block base (seen from above) -->
        <rect x="-112" y="-38" width="224" height="76" rx="8" fill="#D59B5E" stroke="#181818" stroke-width="2.4" />
        <!-- Brushed steel top mounting plate -->
        <rect x="-98" y="-28" width="196" height="56" rx="6" fill="#DCE1EA" stroke="#181818" stroke-width="2" />
        <line x1="-90" y1="-21" x2="90" y2="-21" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.8" />
        <!-- Corner rivets on mounting plate -->
        <circle cx="-86" cy="-16" r="3" fill="#8C95A6" stroke="#181818" stroke-width="1.2" />
        <circle cx="86" cy="-16" r="3" fill="#8C95A6" stroke="#181818" stroke-width="1.2" />
        <circle cx="-86" cy="16" r="3" fill="#8C95A6" stroke="#181818" stroke-width="1.2" />
        <circle cx="86" cy="16" r="3" fill="#8C95A6" stroke="#181818" stroke-width="1.2" />

        <!-- Brass ferrule collar rising toward camera -->
        <circle cx="0" cy="0" r="32" fill="#D8A441" stroke="#181818" stroke-width="2.4" />
        <!-- Handle neck shadow -->
        <circle cx="0" cy="1" r="24" fill="#9E622B" stroke="#181818" stroke-width="1.8" />
        <!-- Top dome of wooden knob handle facing directly at the viewer -->
        <circle cx="0" cy="-3" r="27" fill="#C9894B" stroke="#181818" stroke-width="2.6" />
        <circle cx="-4" cy="-7" r="19" fill="#DA9D60" />
        <ellipse cx="-8" cy="-12" rx="9" ry="6" fill="#F2C894" opacity="0.75" />
        <!-- Subtle wood grain ring -->
        <circle cx="0" cy="-3" r="13" fill="none" stroke="#A66930" stroke-width="1.3" stroke-dasharray="14 6" opacity="0.65" />
      </g>
    </svg>
  `;
}

export function renderMaskingTape(): string {
  return `
    <svg class="tape-svg" viewBox="0 0 92 34" width="76" height="28" aria-hidden="true">
      <path
        d="M6,4 L86,2 L89,9 L84,16 L88,23 L85,30 L5,31 L2,24 L7,17 L3,10 Z"
        fill="rgba(232, 214, 166, 0.86)"
        stroke="#2B2B2B"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <line x1="16" y1="8" x2="74" y2="7" stroke="rgba(255,255,255,0.45)" stroke-width="1.4" />
    </svg>
  `;
}

function renderFlagArtwork(code: FlagCode): string {
  switch (code) {
    case 'IR':
      return `
        <image href="/assets/flag-iran.jpg" x="0" y="0" width="54" height="36" preserveAspectRatio="xMidYMid slice" />
      `;
    case 'CA':
      return `
        <rect x="0" y="0" width="13.5" height="36" fill="#D52B1E" />
        <rect x="13.5" y="0" width="27" height="36" fill="#FFFFFF" />
        <rect x="40.5" y="0" width="13.5" height="36" fill="#D52B1E" />
        <path d="M27,9 L29,15 L34,14 L31,19 L34,21 L28,22 L28,27 L26,27 L26,22 L20,21 L23,19 L20,14 L25,15 Z" fill="#D52B1E" />
      `;
    case 'DE':
      return `
        <rect x="0" y="0" width="54" height="12" fill="#1F1F1F" />
        <rect x="0" y="12" width="54" height="12" fill="#DD0000" />
        <rect x="0" y="24" width="54" height="12" fill="#FFCE00" />
      `;
    case 'NL':
      return `
        <rect x="0" y="0" width="54" height="12" fill="#AE1C28" />
        <rect x="0" y="12" width="54" height="12" fill="#FFFFFF" />
        <rect x="0" y="24" width="54" height="12" fill="#21468B" />
      `;
    case 'GB':
      return `
        <rect x="0" y="0" width="54" height="36" fill="#012169" />
        <path d="M0,0 L54,36 M54,0 L0,36" stroke="#FFFFFF" stroke-width="6" />
        <path d="M0,0 L54,36 M54,0 L0,36" stroke="#C8102E" stroke-width="2.8" />
        <path d="M27,0 V36 M0,18 H54" stroke="#FFFFFF" stroke-width="9" />
        <path d="M27,0 V36 M0,18 H54" stroke="#C8102E" stroke-width="5" />
      `;
    case 'US':
    default:
      return `
        <rect x="0" y="0" width="54" height="36" fill="#FFFFFF" />
        <rect x="0" y="0" width="54" height="5.1" fill="#B22234" />
        <rect x="0" y="10.2" width="54" height="5.1" fill="#B22234" />
        <rect x="0" y="20.4" width="54" height="5.1" fill="#B22234" />
        <rect x="0" y="30.6" width="54" height="5.4" fill="#B22234" />
        <rect x="0" y="0" width="24" height="20.4" fill="#3C3B6E" />
      `;
  }
}

export function renderPostageFlagStamp(code: FlagCode, label: string): string {
  // Perforated postage stamp silhouette
  return `
    <div class="flag-stamp" aria-label="Location: ${esc(label)}">
      <svg class="flag-stamp-svg" viewBox="0 0 74 54" width="74" height="54" role="img" aria-label="${esc(label)} flag stamp">
        <defs>
          <mask id="stamp-perf-mask-${code}">
            <rect x="2" y="2" width="70" height="50" fill="white" />
            <circle cx="2" cy="8" r="2.6" fill="black" />
            <circle cx="2" cy="18" r="2.6" fill="black" />
            <circle cx="2" cy="27" r="2.6" fill="black" />
            <circle cx="2" cy="36" r="2.6" fill="black" />
            <circle cx="2" cy="46" r="2.6" fill="black" />
            <circle cx="72" cy="8" r="2.6" fill="black" />
            <circle cx="72" cy="18" r="2.6" fill="black" />
            <circle cx="72" cy="27" r="2.6" fill="black" />
            <circle cx="72" cy="36" r="2.6" fill="black" />
            <circle cx="72" cy="46" r="2.6" fill="black" />
            <circle cx="10" cy="2" r="2.6" fill="black" />
            <circle cx="21" cy="2" r="2.6" fill="black" />
            <circle cx="32" cy="2" r="2.6" fill="black" />
            <circle cx="43" cy="2" r="2.6" fill="black" />
            <circle cx="54" cy="2" r="2.6" fill="black" />
            <circle cx="64" cy="2" r="2.6" fill="black" />
            <circle cx="10" cy="52" r="2.6" fill="black" />
            <circle cx="21" cy="52" r="2.6" fill="black" />
            <circle cx="32" cy="52" r="2.6" fill="black" />
            <circle cx="43" cy="52" r="2.6" fill="black" />
            <circle cx="54" cy="52" r="2.6" fill="black" />
            <circle cx="64" cy="52" r="2.6" fill="black" />
          </mask>
        </defs>
        <rect x="2" y="2" width="70" height="50" fill="#F8F5EE" stroke="#222222" stroke-width="1.6" mask="url(#stamp-perf-mask-${code})" />
        <g transform="translate(10, 9)">
          ${renderFlagArtwork(code)}
          <rect x="0" y="0" width="54" height="36" fill="none" stroke="#222222" stroke-width="1.2" />
        </g>
        <!-- Subtle postmark cancel rings -->
        <path d="M52,32 Q62,28 69,33" fill="none" stroke="rgba(35,35,35,0.45)" stroke-width="1.2" />
        <path d="M51,37 Q62,33 69,38" fill="none" stroke="rgba(35,35,35,0.45)" stroke-width="1.2" />
      </svg>
      <span class="flag-stamp-caption">${esc(label)}</span>
    </div>
  `;
}

export function renderCheckboxIcon(checked: boolean): string {
  return `
    <svg class="cb-box-svg ${checked ? 'is-checked' : ''}" viewBox="0 0 22 22" width="17" height="17" aria-hidden="true">
      <rect x="2" y="3" width="16" height="16" rx="2.5" fill="#F8F6F0" stroke="#2B2B2B" stroke-width="1.7" />
      ${
        checked
          ? `<path class="cb-check-path" d="M5.5,11.5 L10,16 L19.5,4.5" fill="none" stroke="#1F1F1F" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />`
          : ''
      }
    </svg>
  `;
}
