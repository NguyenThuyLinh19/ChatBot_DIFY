"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-200">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 items-center px-10">
        {/* Nội dung bên trái */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-6xl font-extrabold text-gray-800 leading-tight">
            Chào mừng đến với{" "}
            <span className="text-blue-600">HealthSync</span>
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed">
            Trợ lý ảo thông minh giúp bạn giải đáp mọi thắc mắc một cách nhanh chóng và chính xác.
          </p>
          <div className="flex space-x-4">
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg shadow-lg hover:bg-blue-700 transition"
              >
                Bắt đầu ngay
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Hình ảnh bên phải */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative flex justify-center"
        >
          {/* Hiệu ứng nền */}
          <div className="absolute w-80 h-80 bg-blue-300 opacity-20 rounded-full blur-3xl -z-10 top-10 right-10"></div>

          <Image
            src="/health_care.jpg" // Thay bằng hình ảnh bạn muốn
            alt="Trợ lý ảo y tế"
            width={450}
            height={450}
            className="drop-shadow-2xl rounded-lg"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}
