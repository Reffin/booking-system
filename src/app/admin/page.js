"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Admin() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: "", description: "", duration: "", price: "", category: ""
  });
  const [serviceLoading, setServiceLoading] = useState(false);
  const [error, setError] = useState("");

  const STATUS_COLORS = {
    pending:   "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  const CATEGORIES = ["Medical", "Dental", "Salon", "Spa", "Fitness", "Legal", "Financial", "Other"];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) { router.push("/login"); return; }
    const u = JSON.parse(userData);
    if (u.role !== "admin") { router.push("/dashboard"); return; }
    setUser(u);
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      const [bookRes, servRes] = await Promise.all([
        fetch("/api/bookings", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/services")
      ]);
      const [bookData, servData] = await Promise.all([bookRes.json(), servRes.json()]);
      if (Array.isArray(bookData)) setBookings(bookData);
      if (Array.isArray(servData)) setServices(servData);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (id, status) => {
    const token = localStorage.getItem("token");
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    fetchData(token);
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setServiceLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...serviceForm,
          duration: Number(serviceForm.duration),
          price: Number(serviceForm.price)
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setShowServiceForm(false);
      setServiceForm({ name: "", description: "", duration: "", price: "", category: "" });
      fetchData(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setServiceLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-bounce">⚙️</div>
        <p className="text-gray-500">Loading admin panel...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <span className="text-xl font-extrabold text-blue-600">BookEase</span>
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Hi, <span className="font-semibold text-blue-600">{user?.name?.split(" ")[0]}</span></span>
            <button onClick={handleLogout} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Admin Dashboard ⚙️</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: stats.total, color: "bg-blue-500", icon: "📋" },
            { label: "Pending", value: stats.pending, color: "bg-yellow-500", icon: "⏳" },
            { label: "Confirmed", value: stats.confirmed, color: "bg-green-500", icon: "✅" },
            { label: "Completed", value: stats.completed, color: "bg-purple-500", icon: "🎉" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { id: "bookings", label: "📋 Bookings" },
            { id: "services", label: "🛠️ Services" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-6 py-3 text-sm font-semibold transition-all border-b-2 ${
                tab === t.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {tab === "bookings" && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">All Bookings ({bookings.length})</h2>
            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-gray-500">No bookings yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map(booking => (
                  <div key={booking._id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <div>
                        <p className="font-bold text-gray-800">{booking.name}</p>
                        <p className="text-sm text-gray-500">{booking.email} • {booking.phone}</p>
                        <p className="text-sm font-semibold text-blue-600 mt-1">{booking.service?.name}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          📅 {booking.date} &nbsp;•&nbsp; 🕐 {booking.time} &nbsp;•&nbsp; ₱{booking.service?.price}
                        </p>
                        {booking.notes && <p className="text-xs text-gray-400 mt-1">📝 {booking.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_COLORS[booking.status]}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <select
                          value={booking.status}
                          onChange={e => handleStatusUpdate(booking._id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-blue-400 bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Services Tab */}
        {tab === "services" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Services ({services.length})</h2>
              <button onClick={() => setShowServiceForm(!showServiceForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                {showServiceForm ? "✕ Cancel" : "+ Add Service"}
              </button>
            </div>

            {/* Add Service Form */}
            {showServiceForm && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">New Service</h3>
                {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl mb-4">⚠️ {error}</p>}
                <form onSubmit={handleAddService} className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Service Name</label>
                    <input value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})}
                      required placeholder="e.g. General Consultation"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Category</label>
                    <select value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})}
                      required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 bg-white">
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label>
                    <textarea value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})}
                      required rows={2} placeholder="Describe the service..."
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 resize-none" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Duration (minutes)</label>
                    <input type="number" value={serviceForm.duration} onChange={e => setServiceForm({...serviceForm, duration: e.target.value})}
                      required placeholder="30"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 block">Price (₱)</label>
                    <input type="number" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})}
                      required placeholder="500"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" disabled={serviceLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">
                      {serviceLoading ? "Adding..." : "Add Service"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Services List */}
            <div className="grid md:grid-cols-3 gap-4">
              {services.map(service => (
                <div key={service._id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded-full">{service.category}</span>
                    <span className="text-xs text-gray-400">⏱ {service.duration} min</span>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{service.name}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{service.description}</p>
                  <p className="text-xl font-extrabold text-blue-600">₱{service.price}</p>
                </div>
              ))}
            </div>
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
