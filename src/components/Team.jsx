import React, { useRef } from 'react'
import { motion, useInView } from "framer-motion";

export default function Team() {
  const teamMembers = [
    {
      name: 'SALMAN AHMED',
      position: 'Junior Software Engineer',
      bio: 'With good experience of Development, Salman create the Backend & frontend for Eduminds ',
      imageUrl: '/assets/rollno5.jpg'
    },
    {
      name: 'M Rehman Mujahid',
      position: 'frontend Developer',
      bio: 'Previously create many websites using react.Mange the database and documentation for Eduminds',
      imageUrl: '/assets/rollno44.jpg'
    }
  ];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      className="mb-24"
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <h2 className=" mb-12 text-center text-2xl md:text-3xl  font-extrabold text-blue-800">Our Leadership Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className="bg-slate-50 rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105"
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ delay: inView ? index * 0.15 : 0, duration: 0.7, ease: "easeOut" }}
          >
            <div className="h-60 overflow-hidden">
              <img 
                src={member.imageUrl}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
              <p className="text-primary text-sm font-medium mb-4">{member.position}</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{member.bio}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
