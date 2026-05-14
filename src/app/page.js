"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setServices(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
            <Link href="/login" className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Login
            </Link>
            <Link href="/register" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors font-semibold">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold mb-4">Book Your Appointment</h1>
          <p className="text-xl opacity-90 mb-8">Easy, fast, and hassle-free online booking for all your needs.</p>
          <Link href="/register" className="bg-white text-blue-600 font-extrabold px-8 py-4 rounded-2xl text-lg hover:shadow-xl transition-all inline-block">
            Book Now →
          </Link>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Our Services</h2>
          <p className="text-gray-500">Choose from our wide range of services</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-4" />
                <div className="bg-gray-200 h-4 rounded w-full mb-2" />
                <div className="bg-gray-200 h-4 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-gray-500">No services available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(service => (
              <div key={service._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">
                    {service.category}
                  </span>
                  <span className="text-xs text-gray-400">⏱ {service.duration} min</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-extrabold text-blue-600">₱{service.price}</span>
                  <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-10">Why Choose BookEase?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "⚡", title: "Quick Booking", desc: "Book your appointment in less than 2 minutes." },
              { icon: "📧", title: "Instant Confirmation", desc: "Get email confirmation right after booking." },
              { icon: "🔄", title: "Easy Rescheduling", desc: "Cancel or reschedule anytime with ease." },
            ].map(f => (
              <div key={f.title} className="text-center p-6">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 px-4 text-center">
        <p className="text-gray-400 text-sm">© 2026 BookEase. All rights reserved.</p>
        <p className="text-gray-400 text-sm mt-1">
          Developed by <span className="text-blue-400 font-semibold">Ryan S. Carbonel</span>
        </p>
      </footer>
    </div>
  );
}
