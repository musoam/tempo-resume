import React, { useEffect, useState } from "react";
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Facebook,
  Youtube,
  Dribbble,
  Figma,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { supabase } from "@/lib/supabase";

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  url: string;
}

interface SocialLinksProps {
  links?: SocialLink[];
  className?: string;
}

// Helper function to get icon component by name
const getIconByName = (name: string) => {
  const icons = {
    Github: <Github className="h-5 w-5" />,
    Twitter: <Twitter className="h-5 w-5" />,
    Linkedin: <Linkedin className="h-5 w-5" />,
    Instagram: <Instagram className="h-5 w-5" />,
    Mail: <Mail className="h-5 w-5" />,
    Facebook: <Facebook className="h-5 w-5" />,
    Youtube: <Youtube className="h-5 w-5" />,
    Dribbble: <Dribbble className="h-5 w-5" />,
    Figma: <Figma className="h-5 w-5" />,
  };

  return icons[name] || <Github className="h-5 w-5" />;
};

const SocialLinks = ({
  links: initialLinks = [
    {
      name: "GitHub",
      icon: <Github className="h-5 w-5" />,
      url: "https://github.com",
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      url: "https://twitter.com",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-5 w-5" />,
      url: "https://linkedin.com",
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      url: "https://instagram.com",
    },
    {
      name: "Email",
      icon: <Mail className="h-5 w-5" />,
      url: "mailto:contact@example.com",
    },
  ],
  className = "",
}: SocialLinksProps) => {
  const [links, setLinks] = useState(initialLinks);

  useEffect(() => {
    // Fetch social links from Supabase
    const fetchSocialLinks = async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("social_links")
          .limit(1)
          .single();

        if (error) throw error;

        if (data && data.social_links && data.social_links.length > 0) {
          const formattedLinks = data.social_links.map((link) => ({
            name: link.name,
            icon: getIconByName(link.icon),
            url: link.url,
          }));

          setLinks(formattedLinks);
        }
      } catch (error) {
        console.error("Error fetching social links:", error);
      }
    };

    fetchSocialLinks();
  }, []);
  return (
    <div
      className={`flex items-center justify-center space-x-4 bg-background p-4 ${className}`}
    >
      <TooltipProvider>
        {links.map((link, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>{link.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default SocialLinks;
