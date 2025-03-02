import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "./ContactForm";
import SocialLinks from "./SocialLinks";
import { Separator } from "./ui/separator";
import { getSiteSettings } from "@/lib/settings";

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  details: string;
  link?: string;
}

interface ContactSectionProps {
  title?: string;
  subtitle?: string;
  contactInfo?: ContactInfo[];
  formTitle?: string;
  formSubtitle?: string;
  onFormSubmit?: (values: any) => void;
  className?: string;
}

const ContactSection = ({
  title = "Get In Touch",
  subtitle = "Have a project in mind or just want to say hello? Feel free to reach out!",
  contactInfo: initialContactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: "contact@example.com",
      link: "mailto:contact@example.com",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      link: "tel:+15551234567",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location",
      details: "San Francisco, CA",
    },
  ],
  formTitle = "Send a Message",
  formSubtitle = "I'll get back to you as soon as possible.",
  onFormSubmit = () => {},
  className = "",
}: ContactSectionProps) => {
  const [contactInfo, setContactInfo] = useState(initialContactInfo);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getSiteSettings();

        // Update contact info with settings data
        const updatedContactInfo = [
          {
            icon: <Mail className="h-6 w-6" />,
            title: "Email",
            details: settings.email,
            link: `mailto:${settings.email}`,
          },
        ];

        if (settings.phone) {
          updatedContactInfo.push({
            icon: <Phone className="h-6 w-6" />,
            title: "Phone",
            details: settings.phone,
            link: `tel:${settings.phone.replace(/[^0-9+]/g, "")}`,
          });
        }

        if (settings.location) {
          updatedContactInfo.push({
            icon: <MapPin className="h-6 w-6" />,
            title: "Location",
            details: settings.location,
          });
        }

        setContactInfo(updatedContactInfo);
      } catch (error) {
        console.error("Error loading contact settings:", error);
      }
    };

    loadSettings();
  }, []);
  return (
    <section className={`py-20 px-4 bg-gray-50 dark:bg-gray-900 ${className}`}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-primary/10 text-primary rounded-full">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">{info.title}</h4>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
                        >
                          {info.details}
                        </a>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-300">
                          {info.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-8" />

              <div className="space-y-4">
                <h4 className="text-lg font-medium mb-2">Connect With Me</h4>
                <SocialLinks className="justify-start p-0" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098464!2d-122.50764017948551!3d37.75781499657613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1656543745952!5m2!1sen!2sus"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                ></iframe>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-6">
              <h3 className="text-2xl font-semibold mb-2">{formTitle}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {formSubtitle}
              </p>
              <ContactForm
                onSubmit={onFormSubmit}
                className="shadow-none p-0 max-w-none"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
