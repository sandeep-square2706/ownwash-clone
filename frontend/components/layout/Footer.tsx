import {
  Mail,
  MapPin,
  Phone,
  Share2,
} 
from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-teal-800 text-white">

      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold">OwnWash</h2>

          <p className="mt-4 max-w-sm text-sm leading-6 text-teal-100">
            Convenient doorstep cleaning and washing services designed
            to make your everyday life easier.
          </p>

          <div className="mt-6 flex gap-3">
  <a
    href="#"
    aria-label="Facebook"
    className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-500 transition hover:bg-teal-700"
  >
    <span className="text-sm font-bold">f</span>
  </a>

  <a
    href="#"
    aria-label="Instagram"
    className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-500 transition hover:bg-teal-700"
  >
    <span className="text-sm font-bold">ig</span>
  </a>

  <a
    href="#"
    aria-label="YouTube"
    className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-500 transition hover:bg-teal-700"
  >
    <span className="text-xs font-bold">YT</span>
  </a>

  <a
    href="#"
    aria-label="Share"
    className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-500 transition hover:bg-teal-700"
  >
    <Share2 className="h-4 w-4" />
  </a>
</div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-lg font-semibold">
            Quick Links
          </h3>

          <ul className="space-y-3 text-sm text-teal-100">
            <li>
              <a href="#">Services</a>
            </li>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Franchise</a>
            </li>
            <li>
              <a href="#">Reviews</a>
            </li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="mb-5 text-lg font-semibold">
            Useful Links
          </h3>

          <ul className="space-y-3 text-sm text-teal-100">
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms & Conditions</a>
            </li>
            <li>
              <a href="#">FAQ & Support</a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-lg font-semibold">
            Customer Support
          </h3>

          <div className="space-y-4 text-sm text-teal-100">

            <div className="flex gap-3">
              <Phone className="h-5 w-5 shrink-0" />
              <span>+91 XXXXX XXXXX</span>
            </div>

            <div className="flex gap-3">
              <Mail className="h-5 w-5 shrink-0" />
              <span>support@example.com</span>
            </div>

            <div className="flex gap-3">
              <MapPin className="h-5 w-5 shrink-0" />
              <span>
                Your registered business address
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-yellow-400 px-4 py-3 text-center text-sm font-medium text-gray-900">
        © 2026 OwnWash. All rights reserved.
      </div>
    </footer>
  );
}