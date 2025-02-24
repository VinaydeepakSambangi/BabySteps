import React, { useEffect, useState } from "react";
import { fetchDoctors } from "../services/api";

const DoctorList = ({ onSelectDoctor }) => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors()
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Select a Doctor</h2>
      <ul>
        {doctors.map(doc => (
          <li key={doc._id} onClick={() => onSelectDoctor(doc)}>
            {doc.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
