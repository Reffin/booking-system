"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("book");
  const [selectedService, setSelectedService] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    date: "", time: "", notes: "", name: "", email: "", phone: ""
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState("");

  const TIME_SLOTS = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30"
  ];

  const STATUS_COLORS = {
    pending:   "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) { router.push("/login"); return; }
    const u = JSON.parse(userData);
    if (u.role === "admin") { router.push("/admin"); return; }
    setUser(u);
    setBookingForm(prev => ({ ...prev, name: u.name, email: u.email }));
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      const [servRes, bookRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/bookings", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const [servData, bookData] = await Promise.all([servRes.json(), bookRes.json()]);
      if (Array.isArray(servData)) setServices(servData);
      if (Array.isArray(bookData)) setBookings(bookData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!selectedService) return setError("Please select a service");
    setBookingLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ serviceId: selectedService._id, ...bookingForm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBookingSuccess(true);
      setSelectedService(null);
      setBookingForm(prev => ({ ...prev, date: "", time: "", notes: "" }));
      fetchData(token);
      setTimeout(() => { setBookingSuccess(false); setTab("appointments"); }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    const token = localStorage.getItem("token");
    await fetch(`/api/bookings/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchData(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">📅</div>
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            <span className="text-xl font-extrabold text-blue-600">BookEase</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Hi, <span className="font-semibold text-blue-600">{user?.name?.split(" ")[0]}</span></span>
            <button onClick={handleLogout} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">My Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {[
            { id: "book", label: "📋 Book Appointment" },
            { id: "appointments", label: "🗓️ My Appointments" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-6 py-3 text-sm font-semibold transition-all border-b-2 ${
                tab === t.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Book Appointment Tab */}
        {tab === "book" && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Services List */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Select a Service</h2>
              <div className="space-y-3">
                {services.map(service => (
                  <div key={service._id}
                    onClick={() => setSelectedService(service)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedService?._id === service._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-blue-300"
                    }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-gray-800">{service.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                        <p className="text-xs text-blue-600 mt-1">⏱ {service.duration} minutes</p>
                      </div>
                      <span className="text-lg font-extrabold text-blue-600">₱{service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Booking Details</h2>
              {bookingSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                  <p className="text-5xl mb-4">🎉</p>
                  <p className="text-green-700 font-bold text-lg">Appointment Booked!</p>
                  <p className="text-green-600 text-sm mt-1">Redirecting to your appointments...</p>
                </div>
              ) : (
                <form onSubmit={handleBook} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                  {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">⚠️ {error}</p>}

                  {selectedService && (
                    <div className="bg-blue-50 rounded-xl p-3 text-sm">
                      <p className="font-semibold text-blue-700">Selected: {selectedService.name}</p>
                      <p className="text-blue-600">₱{selectedService.price} • {selectedService.duration} min</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Full Name</label>
                      <input value={bookingForm.name} onChange={e => setBookingForm({...bookingForm, name: e.target.value})}
                        required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 block">Phone</label>
                      <input value={bookingForm.phone} onChange={e => setBookingForm({...bookingForm, phone: e.target.value})}
                        required placeholder="09XXXXXXXXX" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Email</label>
                    <input type="email" value={bookingForm.email} onChange={e => setBookingForm({...bookingForm, email: e.target.value})}
                      required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Date</label>
                    <input type="date" value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})}
                      min={new Date().toISOString().split("T")[0]}
                      required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Time Slot</label>
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map(slot => (
                        <button key={slot} type="button"
                          onClick={() => setBookingForm({...bookingForm, time: slot})}
                          className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                            bookingForm.time === slot
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-blue-100"
                          }`}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Notes (optional)</label>
                    <textarea value={bookingForm.notes} onChange={e => setBookingForm({...bookingForm, notes: e.target.value})}
                      rows={2} placeholder="Any special requests or notes..."
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 resize-none" />
                  </div>

                  <button type="submit" disabled={bookingLoading || !selectedService}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">
                    {bookingLoading ? "Booking..." : "Confirm Booking →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* My Appointments Tab */}
        {tab === "appointments" && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">My Appointments</h2>
            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-gray-500 mb-4">No appointments yet</p>
                <button onClick={() => setTab("book")} className="bg-blue-600 text-white font-bold px-6 py-2 rounded-xl">
                  Book Now →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map(booking => (
                  <div key={booking._id} className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <div>
                        <p className="font-bold text-gray-800 text-lg">{booking.service?.name}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          📅 {booking.date} &nbsp;•&nbsp; 🕐 {booking.time}
                        </p>
                        <p className="text-sm text-blue-600 font-semibold mt-1">
                          ₱{booking.service?.price} • {booking.service?.duration} min
                        </p>
                        {booking.notes && <p className="text-xs text-gray-400 mt-1">📝 {booking.notes}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[booking.status]}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        {booking.status === "pending" && (
                          <button onClick={() => handleCancel(booking._id)}
                            className="text-xs text-red-500 hover:text-red-700 font-semibold">
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 px-4 text-center mt-16">
        <p className="text-gray-400 text-sm">© 2026 BookEase — Developed by <span className="text-blue-400 font-semibold">Ryan S. Carbonel</span></p>
      </footer>
    </div>
  );
}
