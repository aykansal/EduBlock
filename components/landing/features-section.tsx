"use client";

import { motion } from "framer-motion";
import { GraduationCap, Trophy, Wallet, Users } from "lucide-react";

const features = [
  {
    icon: <GraduationCap className="h-10 w-10" />,
    title: "Learn at Your Pace",
    description: "Access high-quality blockchain courses and learn at your own speed"
  },
  {
    icon: <Trophy className="h-10 w-10" />,
    title: "Earn Rewards",
    description: "Get tokens for completing courses and maintaining high focus scores"
  },
  {
    icon: <Wallet className="h-10 w-10" />,
    title: "Web3 Integration",
    description: "Seamlessly connect your wallet and manage your rewards"
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: "Community Learning",
    description: "Join a community of blockchain enthusiasts and learn together"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-slate-50 dark:bg-slate-900">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Why Choose EduBlock?
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Experience the future of blockchain education
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg"
            >
              <div className="mb-4 text-blue-600 dark:text-blue-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
