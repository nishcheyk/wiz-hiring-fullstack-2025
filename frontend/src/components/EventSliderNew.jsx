import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './EventSlider.css';

const SLIDES_TO_SHOW = 4;
const CARD_WIDTH = 260;
const CARD_GAP = 28;
const SLIDE_WIDTH = CARD_WIDTH + CARD_GAP;
const SLIDE_SPEED = 0.7;
const DRAG_FRICTION = 0.93;

function EventSlider() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1); // 1: right, -1: left
  const [isDragging, setIsDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dragVelocity, setDragVelocity] = useState(0);

  const dragStartX = useRef(0);
  const lastDragX = useRef(0);
  const dragLastTime = useRef(Date.now());
  const dragVelocityRef = useRef(0);
  const animationRef = useRef();
  const sliderRef = useRef();
  const isHovering = useRef(false);

  // GUARANTEED WORKING MOCK DATA
  useEffect(() => {
    setEvents(Array.from({ length: 10 }).map((_, i) => ({
      id: i + 1,
      title: `Event ${i + 1}`,
      description: `Description for event ${i + 1}`,
      image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80'
    })));
    setLoading(false);
  }, []);

  // Animation loop
  useEffect(() => {
    if (events.length <= SLIDES_TO_SHOW) return;
    let pos = position;
    let velocity = dragVelocity;
    function animate() {
      const maxScroll = Math.max(0, (events.length - SLIDES_TO_SHOW) * SLIDE_WIDTH);
      if (isDragging) {
        // Drag handled by onDragMove
      } else if (Math.abs(velocity) > 0.1) {
        pos += velocity;
        velocity *= DRAG_FRICTION;
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
      } else if (!paused && !isHovering.current) {
        pos += SLIDE_SPEED * direction;
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
    // eslint-disable-next-line
  }, [events, direction, isDragging, dragVelocity, paused]);

  // Pause on hover/touch
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleMouseEnter = (e) => {
      console.log('HOVER: pause');
      isHovering.current = true;
      setPaused(true);
    };

    const handleMouseLeave = (e) => {
      console.log('HOVER: resume');
      isHovering.current = false;
      setPaused(false);
    };

    const handleTouchStart = () => {
      console.log('TOUCH: pause');
      isHovering.current = true;
      setPaused(true);
    };

    const handleTouchEnd = () => {
      console.log('TOUCH: resume');
      isHovering.current = false;
      setPaused(false);
    };

    slider.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    slider.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Drag logic
  function setSliderCursor(cursor) {
    if (sliderRef.current) sliderRef.current.style.cursor = cursor;
  }

  function onDragStart(e) {
    console.log('DRAG: start');
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setPaused(true); // Pause animation during drag

    dragStartX.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    lastDragX.current = dragStartX.current;
    dragLastTime.current = Date.now();
    dragVelocityRef.current = 0;

    setSliderCursor('grabbing');
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    document.addEventListener('mousemove', onDragMove, { passive: false });
    document.addEventListener('mouseup', onDragEnd, { passive: true });
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd, { passive: true });
  }

  function onDragMove(e) {
    if (!isDragging) return;

    e.preventDefault();
    e.stopPropagation();

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - lastDragX.current;
    const maxScroll = Math.max(0, (events.length - SLIDES_TO_SHOW) * SLIDE_WIDTH);

    setPosition(prev => {
      let next = prev - deltaX;
      if (next < 0) next = 0;
      if (next > maxScroll) next = maxScroll;
      return next;
    });

    // Calculate velocity for inertia
    const now = Date.now();
    const dt = now - dragLastTime.current;
    const velocity = dt > 0 ? deltaX / dt * 16 : 0;

    setDragVelocity(velocity);
    dragVelocityRef.current = velocity;

    // Set direction based on drag movement
    if (deltaX !== 0) {
      setDirection(deltaX > 0 ? -1 : 1);
    }

    lastDragX.current = clientX;
    dragLastTime.current = now;
  }

  function onDragEnd(e) {
    console.log('DRAG: end');
    if (!isDragging) return;

    setIsDragging(false);
    setPaused(false); // Resume animation after drag

    setSliderCursor('grab');
    setDragVelocity(dragVelocityRef.current);

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
          {[...Array(SLIDES_TO_SHOW)].map((_, idx) => (
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
      className="event-slider-container"
      style={{
        pointerEvents: 'auto',
        zIndex: 10,
        background: 'transparent',
        position: 'relative'
      }}
    >
      <div
        className="event-slider-row"
        style={{
          overflow: 'hidden',
          width: '100%',
          touchAction: 'pan-y',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          position: 'relative'
        }}
        ref={sliderRef}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
      >
        <div
          className="slider-row-track infinite"
          style={{
            width: events.length * SLIDE_WIDTH,
            transform: `translateX(-${position}px)`,
            transition: isDragging ? 'none' : 'transform 0.1s linear',
            display: 'flex',
            gap: CARD_GAP,
            cursor: isDragging ? 'grabbing' : 'grab',
            pointerEvents: 'auto',
          }}
        >
          {events.map((event, idx) => (
            <div
              key={event.id}
              className="slider-card"
              style={{
                width: CARD_WIDTH,
                minWidth: CARD_WIDTH,
                maxWidth: CARD_WIDTH,
                background: '#23272f',
                color: '#fff',
                borderRadius: 14,
                boxShadow: '0 2px 12px 0 rgba(40,40,60,0.10)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: 0,
                padding: 18,
                userSelect: 'none',
                position: 'relative',
                textDecoration: 'none',
                pointerEvents: 'none', // Prevent card clicks from interfering with drag
              }}
            >
              <img
                src={event.image_url}
                alt={event.title}
                width={CARD_WIDTH}
                height={140}
                style={{
                  width: CARD_WIDTH,
                  height: 140,
                  objectFit: 'cover',
                  borderRadius: 8,
                  marginBottom: 10,
                  pointerEvents: 'none'
                }}
              />
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8, pointerEvents: 'none' }}>{event.title}</div>
              <div style={{ fontSize: 14, color: '#aaa', pointerEvents: 'none' }}>{event.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventSlider;