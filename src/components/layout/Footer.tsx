import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-600 text-white p-1.5 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 16h2m4 0h10M4 12h18M4 8h2m4 0h10M8 4h12"></path>
                </svg>
              </div>
              <span className="text-xl font-bold text-white">TurfBook</span>
            </Link>
            <p className="text-sm mt-2">
              Book your favorite sports venues with ease. TurfBook provides you with the best turfs for all your sporting needs.
            </p>
            <div className="flex mt-4 space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition-colors">Find Turfs</Link>
              </li>
              <li>
                <Link to="/bookings" className="text-gray-400 hover:text-white transition-colors">My Bookings</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link>
              </li>
            </ul>
          </div>

          {/* Sports */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Sports</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search?sport=football" className="text-gray-400 hover:text-white transition-colors">Football</Link>
              </li>
              <li>
                <Link to="/search?sport=basketball" className="text-gray-400 hover:text-white transition-colors">Basketball</Link>
              </li>
              <li>
                <Link to="/search?sport=tennis" className="text-gray-400 hover:text-white transition-colors">Tennis</Link>
              </li>
              <li>
                <Link to="/search?sport=cricket" className="text-gray-400 hover:text-white transition-colors">Cricket</Link>
              </li>
              <li>
                <Link to="/search?sport=badminton" className="text-gray-400 hover:text-white transition-colors">Badminton</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>123 Sports Avenue, Stadium District, City - 400001</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary-500" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-primary-500" />
                <span>support@turfbook.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} TurfBook. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};