import React, { useState, useEffect } from "react";
import { fetchSlots } from "../services/api";

const CalendarSlots = ({ doctor }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (doctor && selectedDate) {
      fetchSlots(doctor._id, selectedDate)
        .then(res => setSlots(res.data.availableSlots))
        .catch(err => console.error(err));
    }
  }, [doctor, selectedDate]);

  return (
    <div>
      <h3>Available Slots for {doctor.name}</h3>
      <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
      <div>
        {slots.map((slot, index) => (
          <button key={index}>{slot}</button>
        ))}
      </div>
    </div>
  );
};

export default CalendarSlots;
