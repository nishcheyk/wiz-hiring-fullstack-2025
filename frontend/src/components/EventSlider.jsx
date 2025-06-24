import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './EventSlider.css';

const SLIDES_TO_SHOW = 4;
const CARD_WIDTH = 260;
const CARD_GAP = 28;
const SLIDE_WIDTH = CARD_WIDTH + CARD_GAP;
const SLIDE_SPEED = 0.7; // px per frame (smooth)
const DRAG_FRICTION = 0.93; // for inertia

function EventSlider() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for left-to-right, -1 for right-to-left
  const [isDragging, setIsDragging] = useState(false);
  const [dragVelocity, setDragVelocity] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragStartX = useRef(0);
  const dragStartPos = useRef(0);
  const lastDragX = useRef(0);
  const animationRef = useRef();
  const sliderRef = useRef();

  useEffect(() => {
    setLoading(true);
    fetch(import.meta.env.VITE_API_URL + '/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  // Animation loop for smooth ping-pong and drag inertia
  useEffect(() => {
    if (events.length <= SLIDES_TO_SHOW) return;
    let pos = position;
    let velocity = dragVelocity;
    function animate() {
      const maxScroll = (events.length - SLIDES_TO_SHOW) * SLIDE_WIDTH;
      if (isDragging) {
        // Drag is handled by onDragMove
      } else if (Math.abs(velocity) > 0.1) {
        pos += velocity;
        velocity *= DRAG_FRICTION;
        if (pos < 0) {
          pos = 0;
          velocity = 0;
        } else if (pos > maxScroll) {
          pos = maxScroll;
          velocity = 0;
        }
        setPosition(pos);
        setDragVelocity(velocity);
      } else if (!paused) {
        pos += SLIDE_SPEED * direction;
        if (pos < 0) {
          pos = 0;
          setDirection(1);
        } else if (pos > maxScroll) {
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
    const handleMouseEnter = () => setPaused(true);
    const handleMouseLeave = () => setPaused(false);
    const handleTouchStart = () => setPaused(true);
    const handleTouchEnd = () => setPaused(false);
    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('touchstart', handleTouchStart);
    slider.addEventListener('touchend', handleTouchEnd);
    return () => {
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('touchstart', handleTouchStart);
      slider.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Drag/swipe handlers with inertia
  function onDragStart(e) {
    setIsDragging(true);
    setPaused(true);
    dragStartX.current = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    dragStartPos.current = position;
    lastDragX.current = dragStartX.current;
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);
  }
  function onDragMove(e) {
    if (!isDragging) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    let delta = clientX - dragStartX.current;
    let newPos = dragStartPos.current - delta;
    const maxScroll = (events.length - SLIDES_TO_SHOW) * SLIDE_WIDTH;
    if (newPos < 0) newPos = 0;
    if (newPos > maxScroll) newPos = maxScroll;
    setPosition(newPos);
    // For inertia
    setDragVelocity(clientX - lastDragX.current);
    lastDragX.current = clientX;
    if (e.cancelable) e.preventDefault();
  }
  function onDragEnd() {
    setIsDragging(false);
    setPaused(false);
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    document.body.style.msUserSelect = '';
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('touchmove', onDragMove);
    document.removeEventListener('touchend', onDragEnd);
  }

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
      className="event-slider-row"
      style={{ overflow: 'hidden', width: '100%', touchAction: 'pan-y', WebkitUserSelect: 'none', userSelect: 'none' }}
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
        }}
      >
        {events.map((event, idx) => {
          const isFull = event.available_spots === 0;
          const linkTo = isFull ? '#' : `/events/${event.id}`;
          return (
            <Link
              to={linkTo}
              key={event.id + '-' + idx}
              className="slider-card"
              style={{
                width: CARD_WIDTH,
                minWidth: CARD_WIDTH,
                maxWidth: CARD_WIDTH,
                opacity: isFull ? 0.7 : 1,
                pointerEvents: isFull ? 'none' : 'auto',
                position: 'relative',
                textDecoration: 'none',
                color: 'inherit',
              }}
              tabIndex={isFull ? -1 : 0}
              aria-disabled={isFull}
              aria-label={event.title + ' event details'}
              role="link"
            >
              {isFull && <div className="sold-badge">SOLD OUT</div>}
              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.title}
                  width={CARD_WIDTH}
                  height={140}
                  className="slider-img"
                  loading="lazy"
                  srcSet={event.image_url + ' 1x, ' + event.image_url + ' 2x'}
                  aria-label={event.title + ' event image'}
                  style={{ width: CARD_WIDTH, height: 140, objectFit: 'cover', borderRadius: 8, marginBottom: 10 }}
                />
              )}
              <div className="slider-title">{event.title}</div>
              <div className="slider-desc">{event.description}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default EventSlider;
