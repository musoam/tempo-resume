import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { InfiniteSlider } from "./InfiniteSlider";
import LoaderOne from "./LoaderOne";

interface Tool {
  name: string;
  icon?: string;
  category: string;
}

interface ToolsSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const ToolsSection = ({
  title = "Tools & Expertise",
  subtitle = "Technologies and platforms I work with",
  className = "",
}: ToolsSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState("analytics");
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  const tools: Tool[] = [
    // Analytics
    {
      name: "GA4/UA",
      category: "analytics",
      icon: "https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg",
    },
    {
      name: "Power BI",
      category: "analytics",
      icon: "https://powerbi.microsoft.com/pictures/application-logos/svg/powerbi.svg",
    },
    {
      name: "Bing Analytics",
      category: "analytics",
      icon: "https://cdn.worldvectorlogo.com/logos/bing-1.svg",
    },
    {
      name: "Search Console",
      category: "analytics",
      icon: "https://ssl.gstatic.com/search-console/scfe/search_console-64.png",
    },
    {
      name: "Meta Ads Manager",
      category: "analytics",
      icon: "https://mkultofotrttofcucrrh.supabase.co/storage/v1/object/sign/Logos/pngwing.com.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMb2dvcy9wbmd3aW5nLmNvbS5wbmciLCJpYXQiOjE3NDE0MDEyMzcsImV4cCI6MzYzMzU2MTIzN30.VRv2s1586On-sHCuyalXL0p_ulPNdghUWlbcFKZCzLk",
    },
    {
      name: "LuckyOrange",
      category: "analytics",
      icon: "https://mkultofotrttofcucrrh.supabase.co/storage/v1/object/sign/Logos/Lucky%20Orange.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMb2dvcy9MdWNreSBPcmFuZ2UucG5nIiwiaWF0IjoxNzQxMzk5NDcwLCJleHAiOjMwMDI4Mzk0NzB9.Wia6h38O_9Rhz3N1DB3K6rIvDBY5xetM5FdvXVNA_-s",
    },
    {
      name: "Clarity",
      category: "analytics",
      icon: "https://mkultofotrttofcucrrh.supabase.co/storage/v1/object/sign/Logos/Clarity%20(1).png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMb2dvcy9DbGFyaXR5ICgxKS5wbmciLCJpYXQiOjE3NDE0MDAwNjQsImV4cCI6MTc0NjU4NDA2NH0.e-zBbHQwhOynSjbJfFhbrefUNGko0LFf79eH4OmCdxw",
    },
    {
      name: "Optimizely",
      category: "analytics",
      icon: "https://mkultofotrttofcucrrh.supabase.co/storage/v1/object/sign/Logos/Optimizely_Logo_FullColor_Dark_Digital%20(1).png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMb2dvcy9PcHRpbWl6ZWx5X0xvZ29fRnVsbENvbG9yX0RhcmtfRGlnaXRhbCAoMSkucG5nIiwiaWF0IjoxNzQxNDAwMDg4LCJleHAiOjM2MzM1NjAwODh9.8_D0t0Wi4810vj-0ApRJtAMUvryaMV4qDv9d4MhAuYU",
    },

    // Design
    {
      name: "Adobe Creative Cloud",
      category: "design",
      icon: "https://cdn.worldvectorlogo.com/logos/adobe-creative-cloud-cc.svg",
    },
    {
      name: "Canva",
      category: "design",
      icon: "https://mkultofotrttofcucrrh.supabase.co/storage/v1/object/sign/Logos/Canva-Logo%20(1).png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMb2dvcy9DYW52YS1Mb2dvICgxKS5wbmciLCJpYXQiOjE3NDE0MDEwMDksImV4cCI6MzYzMzU2MTAwOX0.Tdd8HqSGVLNk3FGq-9iTZq8MoCKk6FtwNoOJAAoXaYE",
    },
    {
      name: "Final Cut Pro",
      category: "design",
      icon: "https://mkultofotrttofcucrrh.supabase.co/storage/v1/object/sign/Logos/png-transparent-final-cut-pro-macos-bigsur-icon.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMb2dvcy9wbmctdHJhbnNwYXJlbnQtZmluYWwtY3V0LXByby1tYWNvcy1iaWdzdXItaWNvbi5wbmciLCJpYXQiOjE3NDEzOTk4NDEsImV4cCI6MzYzMzU1OTg0MX0.a0YTF56rVp9Wq9MRqdmwTGabIu04wzSOt2DmTQtpctU",
    },
    {
      name: "Figma",
      category: "design",
      icon: "https://static.figma.com/app/icon/1/favicon.svg",
    },

    // Email
    {
      name: "Marketo",
      category: "email",
      icon: "https://mkultofotrttofcucrrh.supabase.co/storage/v1/object/sign/Logos/Marketo_logo.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMb2dvcy9NYXJrZXRvX2xvZ28uc3ZnIiwiaWF0IjoxNzQxNDAwMjE4LCJleHAiOjM2MzM1NjAyMTh9.ytqSmiN8fAkuAQzC74IMqL43Lr7mmoqW8uaY1qtFOqQ",
    },
    {
      name: "Klaviyo",
      category: "email",
      icon: "https://mkultofotrttofcucrrh.supabase.co/storage/v1/object/sign/Logos/Klaviyo_primary_logo.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMb2dvcy9LbGF2aXlvX3ByaW1hcnlfbG9nby5zdmciLCJpYXQiOjE3NDE0MDA0MjEsImV4cCI6MzYzMzU2MDQyMX0.X-CHRCDzuUWX3zHPW20qATnnoR1QQA1IrW_2JR3U8iQ",
    },
    {
      name: "MailChimp",
      category: "email",
      icon: "https://mkultofotrttofcucrrh.supabase.co/storage/v1/object/sign/Logos/mailchimp-vector-logo.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMb2dvcy9tYWlsY2hpbXAtdmVjdG9yLWxvZ28uc3ZnIiwiaWF0IjoxNzQxNDAwMzg2LCJleHAiOjM2MzM1NjAzODZ9.f6jPm_p0hULPBJ2bE6qznbLeayKxZCucKEarRsUk2ZA",
    },
    {
      name: "Salesforce",
      category: "email",
      icon: "https://www.salesforce.com/favicon.ico",
    },
    {
      name: "Hubspot",
      category: "email",
      icon: "https://cdn.worldvectorlogo.com/logos/hubspot-1.svg",
    },

    // Web
    {
      name: "WordPress",
      category: "web",
      icon: "https://s.w.org/style/images/about/WordPress-logotype-standard.png",
    },
    {
      name: "Prismic",
      category: "web",
      icon: "https://prismic.io/favicon.ico",
    },
    {
      name: "Drupal",
      category: "web",
      icon: "https://www.drupal.org/favicon.ico",
    },
    {
      name: "Squarespace",
      category: "web",
      icon: "https://mkultofotrttofcucrrh.supabase.co/storage/v1/object/sign/Logos/squarespace-logo-horizontal-black.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMb2dvcy9zcXVhcmVzcGFjZS1sb2dvLWhvcml6b250YWwtYmxhY2sucG5nIiwiaWF0IjoxNzQxNDAwNDg3LCJleHAiOjM2MzM1NjA0ODd9.1AIG8z3FTV4xw9BBXk20jupHLOy-lb_ywJEm_0u6r10",
    },
    { name: "Wix", category: "web", icon: "https://www.wix.com/favicon.ico" },
    {
      name: "Shopify",
      category: "web",
      icon: "https://cdn.shopify.com/static/shopify-favicon.png",
    },
    {
      name: "SemRush",
      category: "web",
      icon: "https://www.semrush.com/favicon.ico",
    },
    {
      name: "ahrefs",
      category: "web",
      icon: "https://mkultofotrttofcucrrh.supabase.co/storage/v1/object/sign/Logos/Ahrefs-Logo-Blue-Transparent.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMb2dvcy9BaHJlZnMtTG9nby1CbHVlLVRyYW5zcGFyZW50LnN2ZyIsImlhdCI6MTc0MTQwMDUzOSwiZXhwIjozNjMzNTYwNTM5fQ.Inspk7yUbPmWMW5FPK7eFs7q6UvU0tQf265J5HBzcgM",
    },
    {
      name: "HTML",
      category: "web",
      icon: "https://www.w3.org/html/logo/downloads/HTML5_Badge.svg",
    },
    {
      name: "CSS",
      category: "web",
      icon: "https://cdn.worldvectorlogo.com/logos/css-3.svg",
    },

    // Collaboration
    {
      name: "Jira",
      category: "collaboration",
      icon: "https://wac-cdn.atlassian.com/assets/img/favicons/atlassian/favicon.png",
    },
    {
      name: "Trello",
      category: "collaboration",
      icon: "https://trello.com/favicon.ico",
    },
    {
      name: "Asana",
      category: "collaboration",
      icon: "https://asana.com/favicon.ico",
    },
    {
      name: "Notion",
      category: "collaboration",
      icon: "https://www.notion.so/front-static/favicon.ico",
    },
    {
      name: "Slack",
      category: "collaboration",
      icon: "https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png",
    },
    {
      name: "Miro",
      category: "collaboration",
      icon: "https://miro.com/favicon.ico",
    },
    {
      name: "Google Workspace",
      category: "collaboration",
      icon: "https://workspace.google.com/favicon.ico",
    },
    {
      name: "Airtable",
      category: "collaboration",
      icon: "https://airtable.com/favicon.ico",
    },
  ];

  const filteredTools = tools.filter(
    (tool) => tool.category === selectedCategory,
  );

  useEffect(() => {
    // Only show loading state if images take too long
    const timer = setTimeout(() => {
      if (imagesLoaded < totalImages) {
        setIsLoading(true);
      }
    }, 300); // Short delay before showing loader

    setImagesLoaded(0);
    setTotalImages(filteredTools.filter((tool) => tool.icon).length);

    return () => clearTimeout(timer);
  }, [selectedCategory, filteredTools, imagesLoaded, totalImages]);

  return (
    <section
      id="tools"
      className={`py-20 bg-gray-50 dark:bg-gray-900 ${className}`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <Tabs
          defaultValue="analytics"
          className="mb-12"
          onValueChange={setSelectedCategory}
        >
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="web">Web</TabsTrigger>
              <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={selectedCategory} className="mt-8">
            <div className="relative">
              {isLoading && totalImages > 0 && (
                <div className="absolute inset-0 z-10 flex justify-center items-center bg-background/80">
                  <LoaderOne />
                </div>
              )}
              <InfiniteSlider
                duration={30}
                durationOnHover={60}
                className="py-6"
                key={selectedCategory}
              >
                {filteredTools.map((tool, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 min-w-[180px] h-[140px] mx-2"
                  >
                    {tool.icon && (
                      <img
                        src={tool.icon}
                        alt={tool.name}
                        className="h-16 w-16 object-contain mb-3 transition-opacity duration-300"
                        style={{ backgroundColor: "transparent" }}
                        loading="eager"
                        onLoad={() => {
                          setImagesLoaded((prev) => {
                            const newCount = prev + 1;
                            if (newCount >= totalImages) {
                              setIsLoading(false);
                            }
                            return newCount;
                          });
                        }}
                        onError={(e) => {
                          // Use a fallback icon instead of hiding
                          (e.target as HTMLImageElement).src =
                            `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(tool.name)}`;
                          setImagesLoaded((prev) => {
                            const newCount = prev + 1;
                            if (newCount >= totalImages) {
                              setIsLoading(false);
                            }
                            return newCount;
                          });
                        }}
                      />
                    )}
                    <div className="mt-2 text-center">
                      <span className="font-medium text-center block">
                        {tool.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </InfiniteSlider>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ToolsSection;
