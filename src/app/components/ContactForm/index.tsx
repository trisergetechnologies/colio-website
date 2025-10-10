"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "@/constants/colors";
import { getImagePath } from "@/lib/utils/imagePath";
import Image from "next/image";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phnumber: "",
    Message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(Object.values(formData).every((v) => v.trim() !== ""));
  }, [formData]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () =>
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      phnumber: "",
      Message: "",
    });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/bhainirav772@gmail.com", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          Name: formData.firstname,
          LastName: formData.lastname,
          Email: formData.email,
          PhoneNo: formData.phnumber,
          Message: formData.Message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setShowThanks(true);
        reset();
        setTimeout(() => setShowThanks(false), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoader(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-28 md:py-36"
      style={{
        background: `linear-gradient(180deg, ${colors.background.end} 0%, #0f0f11 100%)`,
      }}
    >
      {/* 🌌 Background glows */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] left-[8%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(217,70,239,0.25),transparent_70%)] blur-3xl animate-float"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_80%)] blur-3xl animate-float-slow"></div>
      </div>

      <div className="container relative z-20">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-[#f5d0fe] via-[#d946ef] to-[#a21caf] bg-clip-text text-transparent"
          >
            Get in Touch
          </h2>
          <p className="text-white/85 lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Have questions, suggestions, or partnership ideas?  
            We’d love to hear from you. The Colio app is coming soon to Play Store and App Store —  
            let’s create something amazing together.
          </p>
        </motion.div>

        {/* 💬 Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-3xl mx-auto rounded-3xl p-10 md:p-12 backdrop-blur-2xl border border-white/10 bg-white/5 shadow-[0_0_40px_-8px_rgba(217,70,239,0.25)]"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {["firstname", "lastname"].map((name, i) => (
                <div key={i}>
                  <label
                    htmlFor={name}
                    className="block mb-2 text-sm font-medium text-white/80"
                  >
                    {name === "firstname" ? "First Name" : "Last Name"}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type="text"
                    value={formData[name as keyof typeof formData]}
                    onChange={handleChange}
                    placeholder={name === "firstname" ? "John" : "Doe"}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#d946ef] transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Contact Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: "email", label: "Email Address", type: "email" },
                { name: "phnumber", label: "Phone Number", type: "tel" },
              ].map((field, i) => (
                <div key={i}>
                  <label
                    htmlFor={field.name}
                    className="block mb-2 text-sm font-medium text-white/80"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={handleChange}
                    placeholder={
                      field.name === "email"
                        ? "john.doe@example.com"
                        : "+91 98765 43210"
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#d946ef] transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="Message"
                className="block mb-2 text-sm font-medium text-white/80"
              >
                Message
              </label>
              <textarea
                id="Message"
                name="Message"
                value={formData.Message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#d946ef] transition-all h-32 resize-none"
              />
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={!isFormValid || loader}
              whileHover={{ scale: isFormValid ? 1.05 : 1 }}
              whileTap={{ scale: isFormValid ? 0.97 : 1 }}
              className={`w-full py-4 rounded-xl text-lg font-semibold text-white transition-all duration-300 ${
                !isFormValid || loader
                  ? "bg-gray-500/40 cursor-not-allowed"
                  : ""
              }`}
              style={{
                background:
                  isFormValid && !loader
                    ? `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`
                    : "",
              }}
            >
              {loader ? "Submitting..." : "Submit Message"}
            </motion.button>
          </form>
        </motion.div>

        {/* ✅ Success Modal */}
        <AnimatePresence>
          {showThanks && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            >
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 max-w-lg text-center shadow-[0_0_40px_-8px_rgba(217,70,239,0.3)]"
              >
                <h3 className="text-2xl font-bold text-white mb-4">
                  Thank You 💜
                </h3>
                <p className="text-white/85 mb-6">
                  We’ve received your message!  
                  Our team will reach out soon — and don’t forget,  
                  Colio will be available soon on Play Store & App Store 🚀
                </p>
                <button
                  onClick={() => setShowThanks(false)}
                  className="px-6 py-3 rounded-xl text-white font-medium transition-all"
                  style={{
                    background: `linear-gradient(90deg, ${colors.button.start}, ${colors.button.end})`,
                  }}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
