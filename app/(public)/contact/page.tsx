"use client";

import React from "react";
import Link from "next/link";
import { 
  Package2, 
  AlertCircle, 
  Paperclip, 
  ChevronRight,
  Send
} from "lucide-react";

export default function ContactFormPage() {
  const quickLinks = [
    "Can I cancel or edit my order?",
    "Start a return",
    "Product Recommendations",
    "What is your return policy?",
    "How do I file a claim with Shipping...",
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black">
      <div className="mx-auto max-w-[1100px] px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-3 text-[11px] text-zinc-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-black transition-colors">Home</Link> / Contact Form
        </div>

        {/* Page Title */}
        <h1 className="mb-10 text-[42px] font-semibold tracking-tight">
          Contact Form
        </h1>

        {/* Top Center Content */}
        <div className="mx-auto max-w-full lg:max-w-[960px]">
          {/* FAQ Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.slice(0, 4).map((item, index) => (
              <Link
                key={index}
                href="/help"
                className="flex h-[64px] items-center justify-between rounded-md border border-gray-300 bg-white px-6 text-left text-[14px] font-medium text-black transition hover:border-black group"
              >
                <span className="truncate">{item}</span>
                <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-black transition-colors" />
              </Link>
            ))}

            <Link 
              href="/help"
              className="md:col-span-2 flex h-[64px] items-center justify-between rounded-md border border-gray-300 bg-white px-6 text-left text-[14px] font-medium text-black transition hover:border-black group"
            >
              <span className="truncate">{quickLinks[4]}</span>
              <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:text-black transition-colors" />
            </Link>
          </div>

          {/* Cards */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-2 gap-6">
            <Link 
              href="/track-order"
              className="flex h-[160px] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm hover:border-black hover:shadow-md transition-all group"
            >
              <div className="mb-4 rounded-full bg-zinc-50 p-4 group-hover:bg-zinc-100 transition-colors">
                <Package2 className="h-10 w-10 stroke-[1] text-black" />
              </div>
              <p className="text-[18px] font-semibold uppercase tracking-tight">Track order</p>
            </Link>

            <button className="flex h-[160px] flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm hover:border-black hover:shadow-md transition-all group">
              <div className="mb-4 rounded-full bg-zinc-50 p-4 group-hover:bg-zinc-100 transition-colors">
                <AlertCircle className="h-10 w-10 stroke-[1] text-black" />
              </div>
              <p className="text-[18px] font-semibold uppercase tracking-tight">Report issue</p>
            </button>
          </div>

          {/* Contact Form Box */}
          <div className="mt-10 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg">
            <div className="border-b border-zinc-100 px-10 py-10 bg-[#f9f9f9]/50">
              <h2 className="text-[34px] font-bold tracking-tight">Send us a message</h2>
              <p className="mt-2 text-[15px] text-zinc-500">We'll get back to you within 24-48 business hours.</p>
            </div>

            <form className="space-y-8 px-10 py-12" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <label className="mb-3 block text-[13px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                    Full name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="E.g. Jane Doe"
                    className="h-[60px] w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-6 text-[15px] outline-none focus:border-black focus:bg-white transition-all shadow-inner placeholder:text-zinc-300"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-[13px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                    Email address <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="jane@example.com"
                    className="h-[60px] w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-6 text-[15px] outline-none placeholder:text-zinc-300 focus:border-black focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-[13px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                  Subject of inquiry <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <select className="h-[60px] w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-6 text-[15px] text-zinc-700 outline-none focus:border-black focus:bg-white transition-all appearance-none shadow-inner">
                    <option value="" disabled selected>Please select a subject</option>
                    <option>Order Support & Updates</option>
                    <option>Returns & Exchanges</option>
                    <option>Shipping & Delivery Issues</option>
                    <option>General Product Inquiry</option>
                    <option>Bulk Order / Salon Inquiry</option>
                    <option>Feedback & General Questions</option>
                  </select>
                  <ChevronRight className="pointer-events-none absolute right-6 top-1/2 h-5 w-5 -translate-y-1/2 rotate-90 text-zinc-300" />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-[13px] font-bold uppercase tracking-[0.1em] text-zinc-400">
                  Your message <span className="text-red-500 font-bold">*</span>
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="How can our Royal Support team assist you today? Please provide as much detail as possible, including order numbers if applicable."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-6 py-6 text-[15px] outline-none focus:border-black focus:bg-white transition-all resize-none shadow-inner placeholder:text-zinc-300"
                />
              </div>

              <div className="border-t border-zinc-100 pt-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <button
                      type="button"
                      className="flex h-[60px] w-full md:w-auto items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 px-8 text-[14px] font-semibold transition hover:bg-zinc-100 hover:border-zinc-500 group"
                    >
                      <Paperclip className="h-5 w-5 text-zinc-400 group-hover:text-black transition-colors" />
                      <span>Attach relevant files</span>
                    </button>
                    <p className="mt-3 text-[12px] text-zinc-400 leading-normal max-w-[320px]">
                      Supported formats: JPG, PNG, PDF. Max 10 files (10MB/file).
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="flex h-[64px] w-full md:min-w-[240px] items-center justify-center gap-3 rounded-xl bg-black text-[15px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-zinc-800 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] active:scale-[0.98]"
                  >
                    <Send className="h-4 w-4" />
                    Submit Ticket
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
