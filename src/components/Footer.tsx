import React, { useEffect, useState } from "react";
import { ArrowUp, Github, Twitter, Linkedin } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";

interface FooterProps {
  copyrightText?: string;
  links?: Array<{ label: string; url: string }>;
  socialLinks?: Array<{ icon: React.ReactNode; url: string; label: string }>;
  onScrollToTop?: () => void;
}

// Helper function to get icon component by name
const getIconByName = (name: string) => {
  const icons = {
    Github: <Github className="h-5 w-5" />,
    Twitter: <Twitter className="h-5 w-5" />,
    Linkedin: <Linkedin className="h-5 w-5" />,
  };

  return icons[name] || <Github className="h-5 w-5" />;
};

const Footer = ({
  copyrightText:
    initialCopyrightText = "© 2023 Portfolio. All rights reserved.",
  links = [
    { label: "Home", url: "#home" },
    { label: "Portfolio", url: "#portfolio" },
    { label: "About", url: "#about" },
    { label: "Contact", url: "#contact" },
  ],
  socialLinks: initialSocialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      url: "https://github.com",
      label: "GitHub",
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      url: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://linkedin.com",
      label: "LinkedIn",
    },
  ],
  onScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
}: FooterProps) => {
  const [copyrightText, setCopyrightText] = useState(initialCopyrightText);
  const [socialLinksState, setSocialLinksState] = useState(initialSocialLinks);

  useEffect(() => {
    // Fetch settings from Supabase
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("title, social_links")
          .limit(1)
          .single();

        if (error) throw error;

        if (data) {
          // Update copyright text
          const currentYear = new Date().getFullYear();
          setCopyrightText(
            `© ${currentYear} ${data.title}. All rights reserved.`,
          );

          // Update social links
          if (data.social_links && data.social_links.length > 0) {
            const formattedLinks = data.social_links.map((link) => ({
              icon: getIconByName(link.icon),
              url: link.url,
              label: link.name,
            }));

            setSocialLinksState(formattedLinks);
          }
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="w-full bg-gray-900 text-white py-8 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Portfolio</h3>
            <p className="text-gray-400 text-sm">
              Showcasing creative work and professional projects
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <nav>
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex space-x-4">
              {socialLinksState.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">{copyrightText}</p>

          <Button
            variant="ghost"
            size="icon"
            onClick={onScrollToTop}
            className="bg-gray-800 hover:bg-gray-700 rounded-full text-white"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
