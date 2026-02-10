import { useState } from "react";

export const CustomerRegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (!username || !password) {
      setError("Username and Password are required!");
      return;
    }

    const customerData = { username, password, fullName, email, phone };
    console.log("Customer Registered:", customerData);
    setSuccess("Registration successful!");

    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setEmail("");
    setPhone("");
  };

  return (
    <div className="w-full bg-[#FFF8F0] rounded-2xl p-6 shadow-inner border border-[#E9D7BF]">
      {error && <p className="text-red-600 mb-2 text-center">{error}</p>}
      {success && <p className="text-green-600 mb-2 text-center">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username *"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E6D3B3] focus:outline-none focus:ring-2 focus:ring-[#C8A97E]"
          required
        />
        <input
          type="password"
          placeholder="Password *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E6D3B3] focus:outline-none focus:ring-2 focus:ring-[#C8A97E]"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password *"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E6D3B3] focus:outline-none focus:ring-2 focus:ring-[#C8A97E]"
          required
        />
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E6D3B3] focus:outline-none focus:ring-2 focus:ring-[#C8A97E]"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E6D3B3] focus:outline-none focus:ring-2 focus:ring-[#C8A97E]"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="p-3 rounded-xl bg-[#FFFDF9] border border-[#E6D3B3] focus:outline-none focus:ring-2 focus:ring-[#C8A97E]"
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-[#D6B48A] to-[#C49A6C] text-white font-semibold p-3 rounded-xl hover:from-[#C49A6C] hover:to-[#B68A5A] transition-all duration-300 shadow-md"
        >
          Register
        </button>
      </form>
    </div>
  );
};
