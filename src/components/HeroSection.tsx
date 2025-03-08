import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";

interface HeroSectionProps {
  name?: string;
  title?: string;
  description?: string;
  backgroundImage?: string;
  onScrollDown?: () => void;
}

const HeroSection = ({
  name,
  title,
  description,
  backgroundImage,
  onScrollDown = () => {
    const portfolioSection = document.getElementById("portfolio");
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: "smooth" });
    }
  },
}: HeroSectionProps) => {
  const [settings, setSettings] = useState({
    name: name || "Muso Mwango",
    title: title || "Product Marketing Manager",
    description:
      description ||
      "Marketing expert experienced in creating and optimizing digital products and campaigns within integrated teams.",
    backgroundImage:
      backgroundImage ||
      "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80",
  });

  useEffect(() => {
    // Fetch settings from Supabase
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .limit(1)
          .single();

        if (error) throw error;

        if (data) {
          setSettings({
            name: name || data.owner_name,
            title: title || data.hero_title,
            description: description || data.hero_description,
            backgroundImage: backgroundImage || data.hero_image_url,
          });
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
      }
    };

    fetchSettings();
  }, [name, title, description, backgroundImage]);
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${settings.backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl font-light text-primary mb-2"
          >
            Hello, I'm
          </motion.h2>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
          >
            {settings.name}
          </motion.h1>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-2xl md:text-3xl font-semibold text-white/90 mb-6"
          >
            {settings.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg text-white/80 mb-8 max-w-2xl mx-auto"
          >
            {settings.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="font-medium bg-transparent text-white hover:bg-white/10 border border-white shadow-md dark:bg-white dark:text-black dark:hover:bg-white/90 dark:border-primary"
              onClick={() => {
                const contactSection = document.getElementById("contact");
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              Get in Touch
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-medium bg-transparent text-white hover:bg-white/10 border border-white shadow-md dark:bg-white dark:text-black dark:hover:bg-white/90 dark:border-primary"
              onClick={() => {
                const portfolioSection = document.getElementById("portfolio");
                if (portfolioSection) {
                  portfolioSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              View My Work
            </Button>
          </motion.div>
        </motion.div>
      </div>
      {/* Scroll down indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 rounded-full animate-bounce"
          onClick={onScrollDown}
        >
          <ArrowDown className="h-6 w-6" />
        </Button>
      </motion.div>
      {/* Animated shapes in background (optional) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
          }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
