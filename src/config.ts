/**
 * Single configuration source for scroll choreography, timings, easing, and responsiveness.
 * Adjust scroll lengths or easing here without modifying timeline logic.
 */

export interface TimelineConfig {
  /** Base total scroll distance in pixels when Projects fits on 1 page (<= 4 projects). */
  baseScrollDistancePx: number;
  /** Extra scroll pixels added per additional Projects spread page (2 projects per extra page). */
  extraProjectPageScrollPx: number;
  /** GSAP ScrollTrigger scrub smoothing in seconds. */
  scrubSmoothness: number;
  /** Viewport width breakpoint (px) below which mobile portrait folder layout activates. */
  mobileBreakpointPx: number;
  /** Lenis smooth-scroll settings. */
  lenis: {
    duration: number;
    wheelMultiplier: number;
    touchMultiplier: number;
  };
  /** Proportional weights for each timeline phase (normalized automatically). */
  weights: {
    coverOpen: number;
    pageDwellDefault: number;
    pageFlip: number;
    projectsDwellPerPage: number;
    contactDwell: number;
    reverseCascade: number;
    coverClose: number;
    stampSlam: number;
    postStampHold: number;
  };
  /** Easing curves used in GSAP tweens. */
  easings: {
    coverOpen: string;
    coverClose: string;
    pageFlip: string;
    reverseCascade: string;
    stampSlam: string;
  };
  /** Low-power / reduced-motion detection thresholds. */
  performance: {
    minCores: number;
    minMemoryGb: number;
    minProbeFps: number;
  };
  /** Loader appears only if initial readiness takes longer than this delay (ms). */
  loaderDelayMs: number;
}

export const CONFIG: TimelineConfig = {
  baseScrollDistancePx: 8200,
  extraProjectPageScrollPx: 1100,
  scrubSmoothness: 0.55,
  mobileBreakpointPx: 820,
  lenis: {
    duration: 1.05,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.1,
  },
  weights: {
    coverOpen: 12,
    pageDwellDefault: 5.5,
    pageFlip: 6,
    projectsDwellPerPage: 6.5,
    contactDwell: 12,
    reverseCascade: 9,
    coverClose: 4,
    stampSlam: 1.8,
    postStampHold: 1.2,
  },
  easings: {
    coverOpen: 'power2.inOut',
    coverClose: 'power2.inOut',
    pageFlip: 'power2.inOut',
    reverseCascade: 'power3.inOut',
    stampSlam: 'power4.in',
  },
  performance: {
    minCores: 2,
    minMemoryGb: 2,
    minProbeFps: 36,
  },
  loaderDelayMs: 800,
};

