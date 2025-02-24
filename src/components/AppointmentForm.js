import React, { useState } from "react";
import { createAppointment } from "../services/api";

const AppointmentForm = ({ doctor, slot, onSuccess }) => {
  const [formData, setFormData] = useState({
    patientName: "",
    appointmentType: "",
    notes: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Combine slot (time) and selected date to form a full Date.
    // For simplicity, assume slot contains the time string and we use today's date.
    const appointmentDate = new Date();
    const [hours, minutes] = slot.split(":");
    appointmentDate.setHours(hours, minutes, 0, 0);

    const data = {
      doctorId: doctor._id,
      date: appointmentDate,
      duration: 30, // fixed duration for simplicity
      appointmentType: formData.appointmentType,
      patientName: formData.patientName,
      notes: formData.notes
    };

    createAppointment(data)
      .then(res => {
        onSuccess();
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Book Appointment at {slot}</h4>
      <input
        type="text"
        placeholder="Patient Name"
        value={formData.patientName}
        onChange={e => setFormData({ ...formData, patientName: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Appointment Type"
        value={formData.appointmentType}
        onChange={e => setFormData({ ...formData, appointmentType: e.target.value })}
        required
      />
      <textarea
        placeholder="Notes"
        value={formData.notes}
        onChange={e => setFormData({ ...formData, notes: e.target.value })}
      ></textarea>
      <button type="submit">Book Appointment</button>
    </form>
  );
};

export default AppointmentForm;
