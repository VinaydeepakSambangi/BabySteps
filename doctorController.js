const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const { parse, addMinutes, isBefore, format } = require("date-fns");

// GET /doctors - Retrieve all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /doctors/:id/slots?date=YYYY-MM-DD - Compute available slots
exports.getAvailableSlots = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "Date query parameter is required" });

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    // Use date-fns to parse the date and generate timeslots
    const workingStart = parse(`${date} ${doctor.workingHours.start}`, "yyyy-MM-dd HH:mm", new Date());
    const workingEnd = parse(`${date} ${doctor.workingHours.end}`, "yyyy-MM-dd HH:mm", new Date());
    
    // Define appointment duration (assume fixed 30 mins for simplicity)
    const slotDuration = 30;

    // Get appointments for that doctor on that date
    const startOfDay = new Date(date);
    const endOfDay = addMinutes(startOfDay, 1440);
    const appointments = await Appointment.find({
      doctorId,
      date: { $gte: startOfDay, $lt: endOfDay }
    });

    // Build an array of blocked slots (as Date objects)
    let blockedSlots = [];
    appointments.forEach(app => {
      let slot = new Date(app.date);
      // assume each appointment occupies consecutive slotDuration minutes
      for (let i = 0; i < app.duration; i += slotDuration) {
        blockedSlots.push(format(slot, "HH:mm"));
        slot = addMinutes(slot, slotDuration);
      }
    });

    // Compute available slots by iterating from workingStart to workingEnd
    let slots = [];
    let currentSlot = workingStart;
    while (isBefore(currentSlot, workingEnd)) {
      const formattedSlot = format(currentSlot, "HH:mm");
      if (!blockedSlots.includes(formattedSlot)) {
        slots.push(formattedSlot);
      }
      currentSlot = addMinutes(currentSlot, slotDuration);
    }

    res.json({ availableSlots: slots });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
