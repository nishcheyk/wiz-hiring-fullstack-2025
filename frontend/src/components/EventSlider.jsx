import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './EventSlider.css';

const VISIBLE_CARDS = 4;
const CARD_WIDTH = 240;
const CARD_GAP = 60;
const SLIDE_WIDTH = CARD_WIDTH + CARD_GAP;
const ANIMATION_SPEED = 0.7;
const DRAG_DECAY = 0.93;
const DRAG_THRESHOLD = 5; // Minimum distance to start dragging

// Responsive configuration
const getResponsiveConfig = () => {
  const width = window.innerWidth;
  if (width < 640) { // Mobile
    return { visibleCards: 1, cardWidth: 280, cardGap: 20 };
  } else if (width < 768) { // Small tablet
    return { visibleCards: 2, cardWidth: 240, cardGap: 30 };
  } else if (width < 1024) { // Tablet
    return { visibleCards: 3, cardWidth: 240, cardGap: 40 };
  } else if (width < 1280) { // Small desktop
    return { visibleCards: 4, cardWidth: 240, cardGap: 50 };
  } else { // Large desktop
    return { visibleCards: 4, cardWidth: 240, cardGap: 60 };
  }
};

function EventSlider() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dragVelocity, setDragVelocity] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [responsiveConfig, setResponsiveConfig] = useState(getResponsiveConfig());

  const dragStartX = useRef(0);
  const lastDragX = useRef(0);
  const dragLastTime = useRef(Date.now());
  const dragVelocityRef = useRef(0);
  const animationRef = useRef();
  const sliderRef = useRef();
  const containerRef = useRef();
  const isDragStarted = useRef(false);
  const dragDistance = useRef(0);

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setResponsiveConfig(getResponsiveConfig());
      setPosition(0); // Reset position on resize
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { visibleCards, cardWidth, cardGap } = responsiveConfig;
  const slideWidth = cardWidth + cardGap;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/events`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length <= visibleCards) return;

    let pos = position;
    let velocity = dragVelocity;

    function animate() {
      const maxScroll = Math.max(0, (events.length - visibleCards) * slideWidth);

      if (isDragging) {
        return;
      } else if (Math.abs(velocity) > 0.1) {
        pos += velocity;
        velocity *= DRAG_DECAY;

        if (pos < 0) {
          pos = 0;
          velocity = 0;
          setDirection(1);
        } else if (pos > maxScroll) {
          pos = maxScroll;
          velocity = 0;
          setDirection(-1);
        }

        setPosition(pos);
        setDragVelocity(velocity);
      } else if (!paused && !isHovered) {
        pos += ANIMATION_SPEED * direction;

        if (pos <= 0) {
          pos = 0;
          setDirection(1);
        } else if (pos >= maxScroll) {
          pos = maxScroll;
          setDirection(-1);
        }

        setPosition(pos);
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [events, direction, isDragging, dragVelocity, paused, isHovered, visibleCards, slideWidth]);

  const handleMouseEnter = () => {
    if (!isDragging) {
      setIsHovered(true);
      setPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsHovered(false);
      setPaused(false);
    }
  };

  const handleTouchStart = () => {
    if (!isDragging) {
      setIsHovered(true);
      setPaused(true);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) {
      setIsHovered(false);
      setPaused(false);
    }
  };

  function setSliderCursor(cursor) {
    if (sliderRef.current) sliderRef.current.style.cursor = cursor;
  }

  function onDragStart(e) {
    e.preventDefault();
    e.stopPropagation();

    // Reset drag state
    isDragStarted.current = false;
    dragDistance.current = 0;

    dragStartX.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    lastDragX.current = dragStartX.current;
    dragLastTime.current = Date.now();
    dragVelocityRef.current = 0;

    setSliderCursor('grab');
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    document.addEventListener('mousemove', onDragMove, { passive: false });
    document.addEventListener('mouseup', onDragEnd, { passive: true });
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd, { passive: true });
  }

  function onDragMove(e) {
    e.preventDefault();
    e.stopPropagation();

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - lastDragX.current;
    const totalDeltaX = clientX - dragStartX.current;

    // Update total drag distance
    dragDistance.current = Math.abs(totalDeltaX);

    // Only start dragging if we've moved past the threshold
    if (!isDragStarted.current && dragDistance.current > DRAG_THRESHOLD) {
      isDragStarted.current = true;
      setIsDragging(true);
      setPaused(true);
      setIsHovered(false);
      setSliderCursor('grabbing');
    }

    // Only process drag if we've started dragging
    if (isDragStarted.current) {
      const maxScroll = Math.max(0, (events.length - visibleCards) * slideWidth);

      if (Math.abs(deltaX) > 0) {
        setPosition(prev => {
          let next = prev - deltaX;
          if (next < 0) next = 0;
          if (next > maxScroll) next = maxScroll;
          return next;
        });

        const now = Date.now();
        const dt = now - dragLastTime.current;
        const velocity = dt > 0 ? deltaX / dt * 16 : 0;

        setDragVelocity(velocity);
        dragVelocityRef.current = velocity;

        if (deltaX !== 0) {
          setDirection(deltaX > 0 ? -1 : 1);
        }

        lastDragX.current = clientX;
        dragLastTime.current = now;
      }
    }
  }

  function onDragEnd(e) {
    // Only process if we actually started dragging
    if (isDragStarted.current) {
      setIsDragging(false);
      setPaused(false);
      setIsHovered(false);
      setDragVelocity(dragVelocityRef.current);
    }

    // Reset drag state
    isDragStarted.current = false;
    dragDistance.current = 0;

    setSliderCursor('grab');
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.style.msUserSelect = '';

    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
  }

  useEffect(() => {
    setSliderCursor('grab');
  }, []);

  if (loading) {
    return (
      <div className="event-slider-row" style={{ overflow: 'hidden', width: '100%' }}>
        <div className="slider-row-track infinite">
          {[...Array(visibleCards)].map((_, idx) => (
            <div className="slider-card slider-skeleton" key={idx}>
              <div className="slider-img slider-skeleton-img" />
              <div className="slider-title slider-skeleton-title" />
              <div className="slider-desc slider-skeleton-desc" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="event-slider-container"
      style={{
        pointerEvents: 'auto',
        zIndex: 10,
        background: 'transparent',
        position: 'relative',
        padding: '20px 0',
        margin: '20px auto',
        cursor: isDragging ? 'grabbing' : 'grab',
        width: '100%',
        maxWidth: '1140px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
    >
      <div
        className="event-slider-row"
        style={{
          overflow: 'hidden',
          width: `${visibleCards * slideWidth}px`,
          touchAction: 'pan-y',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          position: 'relative',
          padding: '10px 0',
          margin: '0 auto',
        }}
        ref={sliderRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
      >
        <div
          className="slider-row-track infinite"
          style={{
            width: `${events.length * slideWidth}px`,
            transform: `translateX(-${position}px)`,
            transition: isDragging ? 'none' : 'transform 0.1s linear',
            display: 'flex',
            gap: `${cardGap}px`,
            cursor: isDragging ? 'grabbing' : 'grab',
            pointerEvents: 'auto',
            padding: '10px 0',
            flexShrink: 0,
          }}
        >
          {events.map((event, idx) => (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="slider-card"
                style={{
                  width: cardWidth,
                  minWidth: cardWidth,
                  maxWidth: cardWidth,
                  background: '#23272f',
                  color: '#fff',
                  borderRadius: 14,
                  boxShadow: isHovered ? '0 4px 20px 0 rgba(40,40,60,0.20)' : '0 2px 12px 0 rgba(40,40,60,0.10)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  margin: '10px 0',
                  padding: 18,
                  userSelect: 'none',
                  position: 'relative',
                  textDecoration: 'none',
                  pointerEvents: 'auto',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  flexShrink: 0,
                  cursor: 'pointer',
                }}
              >
                <img
                  src={event.image_url}
                  alt={event.title}
                  width={cardWidth}
                  height={140}
                  style={{
                    width: cardWidth,
                    height: 140,
                    objectFit: 'cover',
                    borderRadius: 8,
                    marginBottom: 10,
                    pointerEvents: 'none',
                    transition: 'transform 0.2s ease',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  }}
                />
                <div style={{
                  fontWeight: 600,
                  fontSize: 18,
                  marginBottom: 8,
                  pointerEvents: 'none',
                  color: isHovered ? '#a78bfa' : '#fff',
                  transition: 'color 0.2s ease'
                }}>
                  {event.title}
                </div>
                <div style={{
                  fontSize: 14,
                  color: isHovered ? '#ccc' : '#aaa',
                  pointerEvents: 'none',
                  transition: 'color 0.2s ease'
                }}>
                  {event.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        border: isDragging ? '2px dashed #a78bfa' : 'none',
        borderRadius: 8,
        opacity: isDragging ? 0.3 : 0,
        transition: 'opacity 0.2s ease',
        zIndex: 1
      }} />
    </div>
  );
}

export default EventSlider;