import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Button from '../components/Button';

function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const adminEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/events`);
      setEvents(res.data);
    } catch {
      setEvents([]);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const reordered = Array.from(events);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setEvents(reordered);
    // Persist new order to backend
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/events/reorder`, {
        adminEmail,
        order: reordered.map(e => e.id)
      });
      setMessage('Order updated!');
    } catch {
      setMessage('Failed to update order');
    }
  };

  return (
    <div className="form-container">
      <h1 className="title mb-4">Reorder Events</h1>
      {message && <div style={{ color: '#a78bfa', marginBottom: 12 }}>{message}</div>}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="events">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} style={{ listStyle: 'none', padding: 0 }}>
              {events.map((event, idx) => (
                <Draggable key={event.id} draggableId={String(event.id)} index={idx}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        background: '#23272f',
                        borderRadius: 6,
                        padding: 12,
                        marginBottom: 8,
                        fontWeight: 600,
                        color: '#fff',
                        ...provided.draggableProps.style
                      }}
                    >
                      {event.title}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default AdminEventsPage;
