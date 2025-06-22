import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './EventSlider.css';

function EventSlider() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/events')
      .then(res => res.json())
      .then(data => setEvents(data.slice(0, 10)));
  }, []);

  if (events.length === 0) return null;

  return (
    <div className="event-slider">
      <div className="event-slider-track">
        {[...events, ...events].map((event, index) => (
          <Link
            to={`/events/${event.id}`}
            key={`${event.id}-${index}`}
            className="slider-card"
            style={{ textDecoration: 'none' }}
          >
            {event.image_url && (
              <img src={event.image_url} alt={event.title} className="slider-img" />
            )}
            <div className="slider-title">{event.title}</div>
            <div className="slider-desc">{event.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default EventSlider;
