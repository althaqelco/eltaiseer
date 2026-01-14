"use client";

import { MessageCircle } from "lucide-react";

export function FloatingWhatsApp() {
  const phoneNumber = "201558245974";
  const message = encodeURIComponent("مرحباً، أريد الاستفسار عن العقارات المتاحة");

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="تواصل معنا عبر واتساب"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
