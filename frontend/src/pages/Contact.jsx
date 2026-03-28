import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate real form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 800);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight">
            Our farmers are <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">always listening</span>
          </h1>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed font-medium">
            Have a question about your fresh delivery or want to know more about our growers? Our community support team is here to help you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden">
          
          {/* Contact Information Sidebar */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-800 p-10 text-white lg:col-span-1 rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <p className="text-green-100 mb-10 leading-relaxed">
                Fill up the form and our Team will get back to you within 24 hours.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <Phone className="text-green-300 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold text-lg">+91 98765 43210</p>
                    <p className="text-green-200 text-sm mt-1">Mon-Sat from 8am to 8pm.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="text-green-300 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold text-lg">hello@fruitbasket.in</p>
                    <p className="text-green-200 text-sm mt-1">Drop us a line anytime!</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="text-green-300 mt-1 flex-shrink-0" size={24} />
                  <div>
                    <p className="font-semibold text-lg">FruitBasket HQ</p>
                    <p className="text-green-200 text-sm mt-1">123 Green Avenue, Startup Tech Park,<br/>Bengaluru, Karnataka 560001</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              {/* Optional Social Icons or Branding Elements could go here */}
              <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors backdrop-blur-sm">
                <span className="font-bold text-white">FB</span>
              </div>
              <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors backdrop-blur-sm">
                <span className="font-bold text-white">IG</span>
              </div>
              <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors backdrop-blur-sm">
                <span className="font-bold text-white">X</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-10 lg:col-span-2">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20 animate-in fade-in zoom-in duration-500">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Send className="text-green-600" size={40} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Message Sent!</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  Thank you for reaching out to FruitBasket. We will get back to you shortly.
                </p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 text-green-600 font-medium hover:text-green-700 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto h-full flex flex-col justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors outline-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors outline-none resize-none"
                    placeholder="Tell us everything..."
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-600/30 hover:shadow-green-600/40 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
                  >
                    Send Message <Send size={18} />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
