import React, { useEffect, useState } from "react";
import { fetchAppointments, deleteAppointment } from "../services/api";

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);

  const loadAppointments = () => {
    fetchAppointments()
      .then(res => setAppointments(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = (id) => {
    deleteAppointment(id)
      .then(() => loadAppointments())
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h3>Your Appointments</h3>
      <ul>
        {appointments.map(app => (
          <li key={app._id}>
            {new Date(app.date).toLocaleString()} with {app.doctorId.name}
            <button onClick={() => handleCancel(app._id)}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;
