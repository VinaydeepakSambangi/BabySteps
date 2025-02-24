import React, { useState } from "react";
import DoctorList from "./components/DoctorList";
import CalendarSlots from "./components/CalendarSlots";
import AppointmentList from "./components/AppointmentList";

function App() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  return (
    <div className="App">
      <h1>Babysteps Appointment Booking</h1>
      <DoctorList onSelectDoctor={setSelectedDoctor} />
      {selectedDoctor && <CalendarSlots doctor={selectedDoctor} />}
      <AppointmentList />
    </div>
  );
}

export default App;
