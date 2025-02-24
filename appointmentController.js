const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { parse, addMinutes, isBefore, format, isEqual } = require("date-fns");

// GET /appointments - Retrieve all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).populate("doctorId", "name");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /appointments/:id - Retrieve appointment details
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate("doctorId", "name");
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper: Check if a timeslot is available
const isSlotAvailable = async (doctorId, requestedDate, duration, appointmentId = null) => {
  // Find any appointment that overlaps
  const existingAppointments = await Appointment.find({ doctorId });
  const reqStart = new Date(requestedDate);
  const reqEnd = addMinutes(reqStart, duration);

  for (let app of existingAppointments) {
    // Skip the current appointment in case of an update
    if (appointmentId && app._id.equals(appointmentId)) continue;

    const appStart = new Date(app.date);
    const appEnd = addMinutes(appStart, app.duration);

    // Check for any overlap
    if (
      (reqStart >= appStart && reqStart < appEnd) ||
      (reqEnd > appStart && reqEnd <= appEnd) ||
      (reqStart <= appStart && reqEnd >= appEnd)
    ) {
      return false;
    }
  }
  return true;
};

// POST /appointments - Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;
    if (!doctorId || !date || !duration || !appointmentType || !patientName) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Validate slot availability
    const available = await isSlotAvailable(doctorId, date, duration);
    if (!available) {
      return res.status(400).json({ error: "Requested time slot is not available" });
    }
    const appointment = new Appointment({
      doctorId,
      date,
      duration,
      appointmentType,
      patientName,
      notes
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /appointments/:id - Update an appointment
exports.updateAppointment = async (req, res) => {
  try {
    const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;
    const appointmentId = req.params.id;

    // Validate slot availability for the updated appointment
    const available = await isSlotAvailable(doctorId, date, duration, appointmentId);
    if (!available) {
      return res.status(400).json({ error: "Requested time slot is not available" });
    }
    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      { doctorId, date, duration, appointmentType, patientName, notes },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Appointment not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /appointments/:id - Cancel an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });
    res.json({ message: "Appointment cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
