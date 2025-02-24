import axios from "axios";

const API_URL = "http://localhost:8080";

export const fetchDoctors = () => axios.get(`${API_URL}/doctors`);
export const fetchSlots = (doctorId, date) => axios.get(`${API_URL}/doctors/${doctorId}/slots`, { params: { date } });
export const fetchAppointments = () => axios.get(`${API_URL}/appointments`);
export const createAppointment = (data) => axios.post(`${API_URL}/appointments`, data);
export const updateAppointment = (id, data) => axios.put(`${API_URL}/appointments/${id}`, data);
export const deleteAppointment = (id) => axios.delete(`${API_URL}/appointments/${id}`);
