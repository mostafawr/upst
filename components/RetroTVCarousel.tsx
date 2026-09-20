"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";

export interface TVChannel {
  id: string;
  brand: string;
  tagline: string;
  subtitle: string;
  category: string;
  services: readonly string[];
  technology: readonly string[];
  image: string;
  /** Live storefront, shown as verifiable proof in the expanded view. */
  href?: string;
}

interface RetroTVCarouselProps {
  channels: TVChannel[];
}

/** Horizontal travel, in px, before a touch is treated as a swipe not a tap. */
const SWIPE_THRESHOLD = 40;

export default function RetroTVCarousel({ channels }: RetroTVCarouselProps) {
  const [currentChannel, setCurrentChannel] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showOSD, setShowOSD] = useState(true);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [expandedChannel, setExpandedChannel] = useState<number | null>(null);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const osdTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Where a touch began, and whether it travelled far enough to count as a
  // swipe rather than a tap. Without this the swipe would also open the
  // project, because a touch that moves still fires a click.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const didSwipe = useRef(false);

  const channel = channels[currentChannel];
  const totalChannels = channels.length;

  const triggerGlitch = useCallback(() => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 350);
  }, []);

  const showChannelOSD = useCallback(() => {
    setShowOSD(true);
    if (osdTimeout.current) clearTimeout(osdTimeout.current);
    osdTimeout.current = setTimeout(() => setShowOSD(false), 2500);
  }, []);

  const goToChannel = useCallback(
    (direction: "next" | "prev") => {
      if (expandedChannel !== null) return; // Don't switch when expanded
      triggerGlitch();
      showChannelOSD();
      setTimeout(() => {
        setCurrentChannel((prev) => {
          if (direction === "next") return (prev + 1) % totalChannels;
          return (prev - 1 + totalChannels) % totalChannels;
        });
      }, 150);
    },
    [totalChannels, triggerGlitch, showChannelOSD, expandedChannel]
  );

  // Click to expand
  const handleScreenClick = useCallback(() => {
    if (expandedChannel !== null) return;
    if (didSwipe.current) {
      didSwipe.current = false;
      return;
    }
    setIsExpanding(true);
    // Brief glitch before expand
    triggerGlitch();
    setTimeout(() => {
      setExpandedChannel(currentChannel);
      setIsExpanding(false);
    }, 400);
  }, [currentChannel, expandedChannel, triggerGlitch]);

  // Swiping is how people expect to change a slide on a phone; the arrows are
  // small and sit over the image. A gesture counts as a swipe only when it is
  // mostly horizontal, so it does not fight the page's vertical scroll.
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    didSwipe.current = false;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const start = touchStart.current;
      touchStart.current = null;
      if (!start || expandedChannel !== null) return;

      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;

      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return;

      didSwipe.current = true;
      goToChannel(dx < 0 ? "next" : "prev");
    },
    [expandedChannel, goToChannel]
  );

  // Close expanded view
  const handleClose = useCallback(() => {
    setIsCollapsing(true);
    triggerGlitch();
    setTimeout(() => {
      setExpandedChannel(null);
      setIsCollapsing(false);
    }, 400);
  }, [triggerGlitch]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (expandedChannel !== null) {
        if (e.key === "Escape") {
          e.preventDefault();
          handleClose();
        }
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goToChannel("next");
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goToChannel("prev");
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleScreenClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToChannel, handleScreenClick, handleClose, expandedChannel]);

  // Hide OSD after initial display
  useEffect(() => {
    const t = setTimeout(() => setShowOSD(false), 3000);
    return () => clearTimeout(t);
  }, []);

  const screenFilter = `brightness(${brightness}%) contrast(${contrast}%)`;

  // Knob drag handlers
  const handleKnobDrag = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<number>>,
      min: number,
      max: number
    ) => {
      return (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const startY = e.clientY;
        const startVal = setter === setBrightness ? brightness : contrast;

        const onMove = (me: MouseEvent) => {
          const delta = startY - me.clientY;
          const newVal = Math.min(max, Math.max(min, startVal + delta * 0.5));
          setter(Math.round(newVal));
        };

        const onUp = () => {
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      };
    },
    [brightness, contrast]
  );

  const expandedData = expandedChannel !== null ? channels[expandedChannel] : null;
  const expandedChannelLabel =
    expandedChannel !== null ? String(expandedChannel + 1).padStart(2, "0") : "";

  return (
    <>
      {/* Expanded overlay */}
      {(expandedChannel !== null || isCollapsing) && expandedData && (
        <div
          className={`retro-tv-overlay ${isCollapsing ? "retro-tv-overlay--closing" : "retro-tv-overlay--open"}`}
          onClick={handleClose}
        >
          <div
            className="retro-tv-overlay__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="retro-tv-overlay__close"
              onClick={handleClose}
              aria-label="Close project view"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M8 8L20 20M20 8L8 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {/* Scanline overlay on expanded view too */}
            <div className="retro-tv-overlay__scanlines" aria-hidden="true" />

            <div className="retro-tv-overlay__layout">
              <div className="retro-tv-overlay__image">
                <Image
                  src={expandedData.image}
                  alt={`${expandedData.brand} website mockup`}
                  width={1200}
                  height={800}
                  unoptimized={process.env.NODE_ENV !== "production"}
                  className="retro-tv-overlay__img"
                />
              </div>

              <div className="retro-tv-overlay__details">
                <span className="retro-tv-overlay__category">{expandedData.category}</span>
                <h2 className="retro-tv-overlay__brand">{expandedData.brand}</h2>
                <p className="retro-tv-overlay__tagline">{expandedData.tagline}</p>
                <p className="retro-tv-overlay__subtitle">{expandedData.subtitle}</p>

                <div className="retro-tv-overlay__meta">
                  <div>
                    <span className="retro-tv-overlay__meta-label">Services</span>
                    <ul className="retro-tv-overlay__tag-list">
                      {expandedData.services.map((s) => (
                        <li key={s} className="retro-tv-overlay__tag">{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="retro-tv-overlay__meta-label">Technology</span>
                    <ul className="retro-tv-overlay__tag-list">
                      {expandedData.technology.map((t) => (
                        <li key={t} className="retro-tv-overlay__tag retro-tv-overlay__tag--tech">{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="retro-tv-overlay__cta-row">
                  {expandedData.href ? (
                    <a
                      className="retro-tv-overlay__visit"
                      href={expandedData.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit the live store →
                    </a>
                  ) : (
                    <span className="retro-tv-overlay__built-by">Built by UPSTACK</span>
                  )}
                  <span className="retro-tv-overlay__channel-num">CH {expandedChannelLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* The TV */}
      <div
        className={`retro-tv ${isExpanding ? "retro-tv--expanding" : ""}`}
        aria-label="Retro TV project viewer"
      >
        {/* TV Casing Top */}
        <div className="retro-tv__top-grille">
          <div className="retro-tv__brand">UPSTACK</div>
        </div>

        {/* Screen Area */}
        <div
          className="retro-tv__screen-wrapper"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Navigation arrows */}
          <button
            className="retro-tv__nav retro-tv__nav--prev"
            onClick={(e) => { e.stopPropagation(); goToChannel("prev"); }}
            aria-label="Previous channel"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            className="retro-tv__nav retro-tv__nav--next"
            onClick={(e) => { e.stopPropagation(); goToChannel("next"); }}
            aria-label="Next channel"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* The actual screen — clickable */}
          <div
            className="retro-tv__screen"
            onClick={handleScreenClick}
            role="button"
            tabIndex={0}
            aria-label={`View ${channel.brand} project details`}
          >
            {/* Scanlines */}
            <div className="retro-tv__scanlines" aria-hidden="true" />
            {/* Vignette */}
            <div className="retro-tv__vignette" aria-hidden="true" />
            {/* Static */}
            <div
              className={`retro-tv__static ${isGlitching ? "retro-tv__static--active" : ""}`}
              aria-hidden="true"
            />

            {/* OSD */}
            <div
              className={`retro-tv__osd ${showOSD ? "retro-tv__osd--visible" : ""}`}
              aria-live="polite"
            >
              <span className="retro-tv__osd-channel">
                CH {String(currentChannel + 1).padStart(2, "0")}
              </span>
              <span className="retro-tv__osd-total">/ {String(totalChannels).padStart(2, "0")}</span>
            </div>

            {/* "Click to view" hint */}
            <div className="retro-tv__click-hint">
              <span>View project</span>
            </div>

            {/* Channel content — now full-screen image */}
            <div className="retro-tv__channel" style={{ filter: screenFilter }}>
              <Image
                src={channel.image}
                alt={`${channel.brand} website mockup`}
                width={1200}
                height={800}
                unoptimized={process.env.NODE_ENV !== "production"}
                className="retro-tv__channel-fullimg"
                priority
              />
              {/* Brand label overlay at bottom */}
              <div className="retro-tv__channel-brand-bar">
                <span className="retro-tv__channel-brand-name">{channel.brand}</span>
                <span className="retro-tv__channel-brand-cat">{channel.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom control panel */}
        <div className="retro-tv__controls">
          <div className="retro-tv__control-group">
            <span className="retro-tv__control-label">BRIGHTNESS</span>
            <div
              className="retro-tv__knob"
              onMouseDown={handleKnobDrag(setBrightness, 30, 170)}
              style={{ transform: `rotate(${(brightness - 100) * 2.7}deg)` }}
              role="slider"
              aria-label="Brightness control"
              aria-valuenow={brightness}
              aria-valuemin={30}
              aria-valuemax={170}
              tabIndex={0}
            >
              <div className="retro-tv__knob-indicator" />
            </div>
          </div>

          {/* Channel dots */}
          <div className="retro-tv__channel-dots">
            {channels.map((ch, i) => (
              <button
                key={ch.id}
                className={`retro-tv__dot ${i === currentChannel ? "retro-tv__dot--active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (i !== currentChannel) {
                    triggerGlitch();
                    showChannelOSD();
                    setTimeout(() => setCurrentChannel(i), 150);
                  }
                }}
                aria-label={`Go to channel ${i + 1}: ${ch.brand}`}
              />
            ))}
          </div>

          <div className="retro-tv__control-group">
            <span className="retro-tv__control-label">CONTRAST</span>
            <div
              className="retro-tv__knob"
              onMouseDown={handleKnobDrag(setContrast, 50, 150)}
              style={{ transform: `rotate(${(contrast - 100) * 2.7}deg)` }}
              role="slider"
              aria-label="Contrast control"
              aria-valuenow={contrast}
              aria-valuemin={50}
              aria-valuemax={150}
              tabIndex={0}
            >
              <div className="retro-tv__knob-indicator" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
