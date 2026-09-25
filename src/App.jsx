import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState("");
  const [ticket, setTicket] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await fetch('http://localhost:3000/support', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket, email })
      });

      const res = await data.json();
      console.log(res);
      setResult(res);
      setEmail("");
      setTicket("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong submitting your ticket.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        StackMind Support
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="ticket" className="block text-sm font-medium text-gray-700">
            Issue Description
          </label>
          <textarea
            id="ticket"
            name="ticket"
            rows="4"
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            placeholder="Describe your issue..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Submit Ticket
        </button>
      </form>

      {error && (
        <div className="mt-6 text-sm text-red-600 text-center">{error}</div>
      )}

      {result && (
        <div className="mt-6 rounded-md bg-blue-50 border border-blue-200 p-4 text-sm text-gray-700 space-y-1">
          <p className="font-semibold text-blue-700">Ticket received!</p>
          <p><span className="font-medium">Issue:</span> {result.ticket}</p>
          <p><span className="font-medium">Category:</span> {result.category}</p>
          <p><span className="font-medium">Routed to:</span> {result.route}</p>
          <p><span className="font-medium">Confidence:</span> {(result.confidence * 100).toFixed(0)}%</p>
        </div>
      )}
    </div>
  )
}

export default App