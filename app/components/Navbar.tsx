"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import Create from "./Create";
import Contact from "./Contact";

const Navbar = () => {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { label: "Feed", path: "/", icon: "/feed.png" },
    { label: "Projects", path: "/ventures", icon: "/trips.png" },
    { label: "Skeels", path: "/skills", icon: "/skeels.png" },
    { label: "Me", path: "/me", icon: "/me.png" },
  ];

  return (
    <>
      <motion.div
        className="fixed left-0 top-0 h-full z-[100] flex"
        initial={{ width: 110 }}
        whileHover={{ width: 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="bg-black backdrop-blur-md h-full flex flex-col items-center justify-between overflow-hidden shadow-[5px_0_15px_rgba(255,255,255,0.1)]">
          <div className="w-full">
            {/* Logo and Menu Title Container */}
            <div className="p-4 w-full flex flex-col items-center min-w-[100px]">
              <img 
                src="/white_logo.png" 
                alt="Logo"
                className="w-[75px] h-[75px] mb-[10px]"
              />
              <motion.h2 
                className="text-white font-bold text-xl whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                VIBEFOLIO
              </motion.h2>
            </div>

            {/* Create Button
            <motion.button
              className="mx-auto my-[15px] bg-gray-300 hover:bg-gray-400 text-black font-medium rounded-lg transition-colors flex items-center justify-center"
              style={{
                width: isHovered ? 'auto' : '40px',
                height: '40px',
                borderRadius: isHovered ? '8px' : '50%',
                padding: isHovered ? '8px 24px' : '0'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreate(true)}
            >
              {isHovered ? (
                "Create"
              ) : (
                <img 
                  src="/create.png" 
                  alt="Create"
                  className="w-6 h-6"
                />
              )}
            </motion.button> */}

            <nav className="w-full flex flex-col items-center">
              {navItems.map((item) => (
                <motion.div
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className="px-4 py-3 w-[200px] flex justify-center items-center text-white/80 hover:text-white cursor-pointer hover:bg-white/10 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  {isHovered ? (
                    <span className="whitespace-nowrap font-bold">{item.label}</span>
                  ) : (
                    <img 
                      src={item.icon} 
                      alt={item.label}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Contact Button - Positioned at the bottom */}
          <motion.button
            className="mx-auto mb-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
            style={{
              width: isHovered ? 'auto' : '40px',
              height: '40px',
              borderRadius: isHovered ? '8px' : '50%',
              padding: isHovered ? '8px 24px' : '0'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowContact(true)}
          >
            {isHovered ? (
              "Contact"
            ) : (
              <img 
                src="/call.png" 
                alt="Contact"
                className="w-6 h-6"
              />
            )}
          </motion.button>
        </div>
      </motion.div>

      {showCreate && <Create onClose={() => setShowCreate(false)} />}
      {showContact && <Contact onClose={() => setShowContact(false)} />}
    </>
  );
};

export default Navbar;