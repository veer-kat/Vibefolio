"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ContactProps {
  onClose: () => void;
}

const Contact = ({ onClose }: ContactProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }
  
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error("Full error:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to send email. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/uploademail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit email');
      }

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setError("Failed to send contact request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {isSubmitting && (
        <div className="absolute inset-0 z-[300] flex items-center justify-center bg-black/80">
          <div className="text-white text-xl flex flex-col items-center">
            <svg className="animate-spin h-12 w-12 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending your contact request...
          </div>
        </div>
      )}

      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        className="relative w-200 rounded-2xl bg-white p-8 shadow-xl flex items-center justify-center"
        initial={{ scale: 5, y: 20, height: 500 }}
        animate={{ scale: 1, y: 0, height: 500 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <motion.div 
          className="w-full p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center h-full">
              <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
              <p className="text-gray-600 text-center">
                I've sent my contact details to your email.<br />
                I'll get back to you soon!
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  I'm glad you liked my profile
                </h2>
                <p className="text-gray-600">
                  Let's get in touch!
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-800 font-medium mb-3">
                  Your Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className={`w-full p-4 border-2 ${error ? 'border-red-400' : 'border-gray-200'} rounded-xl focus:border-orange-400 focus:ring-1 focus:ring-orange-200 transition-all duration-200 text-gray-700 bg-gray-50 placeholder-gray-400`}
                    placeholder="your@email.com"
                  />
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-500">{error}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  I'll send you an email with all my contact information.
                </p>
              </div>

              <button 
                className="w-full py-3 bg-gradient-to-r from-[#cc7722] to-[#9A4D00] text-white rounded-lg font-medium text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                onClick={handleSubmit}
                disabled={!email || isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Contact Me'}
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Contact;