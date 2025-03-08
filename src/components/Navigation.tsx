import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronUp, Settings } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

interface NavLink {
  name: string;
  href: string;
  icon?: React.ReactNode;
  isExternal?: boolean;
}

interface NavigationProps {
  links?: NavLink[];
  logo?: string;
  logoAlt?: string;
  className?: string;
  showAdmin?: boolean;
}

const Navigation = ({
  links = [
    { name: "Home", href: "#home" },
    { name: "Portfolio", href: "#portfolio" },
    { name: "Tools & Expertise", href: "#tools" },
    { name: "Contact", href: "#contact" },
  ],
  logo = "https://api.dicebear.com/7.x/avataaars/svg?seed=portfolio",
  logoAlt = "Portfolio Logo",
  className = "",
  showAdmin = true,
}: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
      setShowScrollTop(scrollPosition > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 ${scrolled ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-md" : "bg-transparent"} transition-all duration-300 ${className}`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="#home" className="flex items-center space-x-2">
            <img
              src={
                "https://media.licdn.com/dms/image/v2/D4E03AQHnyyg54uyvuQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1714765803000?e=1746662400&v=beta&t=QQ7dKDfQHGVfwREzjWkRTYoFlGeNp9SK9Vvqs8Zwfe4"
              }
              alt={logoAlt}
              className="h-10 w-10 rounded-full"
            />
            <span className="font-bold text-xl hidden sm:inline-block text-gray-900 dark:text-white">
              Muso's Portfolio
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {links.map((link, index) =>
              link.isExternal ? (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-900 dark:text-gray-100 hover:text-primary transition-colors duration-300 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.name}
                </a>
              ) : (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="text-gray-900 dark:text-gray-100 hover:text-primary transition-colors duration-300 font-medium"
                >
                  {link.name}
                </a>
              ),
            )}
            {showAdmin && (
              <Link
                to="/admin"
                className="text-gray-900 dark:text-gray-100 hover:text-primary transition-colors duration-300 font-medium"
              >
                {isSignedIn ? "Admin" : "Login"}
              </Link>
            )}
            <ThemeToggle />
          </nav>

          {/* Mobile Navigation Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isOpen ? 1 : 0,
            height: isOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-white dark:bg-gray-900 shadow-lg"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {links.map((link, index) =>
              link.isExternal ? (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors duration-300 py-2 font-medium border-b border-gray-100 dark:border-gray-800 last:border-0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center">
                    {link.icon && <span className="mr-2">{link.icon}</span>}
                    {link.name}
                  </div>
                </a>
              ) : (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors duration-300 py-2 font-medium border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <div className="flex items-center">
                    {link.icon && <span className="mr-2">{link.icon}</span>}
                    {link.name}
                  </div>
                </a>
              ),
            )}
            {showAdmin && isSignedIn && (
              <Link
                to="/admin"
                className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors duration-300 py-2 font-medium border-b border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin
                </div>
              </Link>
            )}
            {showAdmin && !isSignedIn && (
              <Link
                to="/admin"
                className="text-gray-700 dark:text-gray-200 hover:text-primary transition-colors duration-300 py-2 font-medium border-b border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Login
                </div>
              </Link>
            )}
            <div className="flex justify-center py-2">
              <ThemeToggle />
            </div>
          </nav>
        </motion.div>
      </motion.header>
      {/* Scroll to Top Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: showScrollTop ? 1 : 0,
                scale: showScrollTop ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center z-40 hover:bg-primary/90 transition-colors"
              aria-label="Scroll to top"
            >
              <ChevronUp size={24} />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Back to top</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};

export default Navigation;
