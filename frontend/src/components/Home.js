import React from "react";

export default function LandingPage() {
  return (
    <div className="bg-[#1B1F24] text-white min-h-screen font-sans">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-[#F9B64D]">My Banker</h1>
        <nav>
          <ul className="flex space-x-6">
            <li className="hover:text-[#F9B64D] cursor-pointer">About</li>
            <li className="hover:text-[#F9B64D] cursor-pointer">Report</li>
            <li className="hover:text-[#F9B64D] cursor-pointer">Contact</li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-8 py-16">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Your Financial Future Starts Here
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Upload your crypto wallet address and get a professional, personalized financial report
            – crafted as if by your own private banker.
          </p>
          <p className="text-lg text-gray-300 mb-6">
            Let's shape a brighter financial future, together. Let us help you make the right decisions
            with tailored insights you can trust.
          </p>
          <button className="bg-[#F9B64D] text-black px-6 py-3 font-semibold rounded hover:bg-yellow-500 transition duration-300">
            Get Your Report
          </button>
        </div>
        <div className="lg:w-1/2">
          <img src="/images/37d1dcdf-651f-4a8a-857f-1deeefa023b3.png" alt="Private Banker" className="rounded-2xl shadow-xl" />
        </div>
      </section>

      {/* Image Strip */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-12 bg-[#121417]">
        <img src="/images/accounting-office.png" alt="Office" className="rounded-xl shadow-md" />
        <img src="/images/nyc-skyline.png" alt="NYC Skyline" className="rounded-xl shadow-md" />
        <img src="/images/businessmen-handshake.png" alt="Handshake" className="rounded-xl shadow-md" />
      </section>

      {/* Call to Action */}
      <section className="text-center px-6 py-16">
        <h3 className="text-3xl lg:text-4xl font-bold mb-6">
          One Simple Step. Endless Financial Clarity.
        </h3>
        <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
          My Banker is the easiest way to understand your crypto portfolio. Whether you're
          managing assets or exploring investments, our report gives you the insights you need.
        </p>
        <button className="bg-[#F9B64D] text-black px-6 py-3 font-semibold rounded hover:bg-yellow-500 transition duration-300">
          Start Now
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-6 border-t border-gray-700">
        © {new Date().getFullYear()} My Banker. All rights reserved.
      </footer>
    </div>
  );
}
