import React from "react";
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";
import PortfolioSection from "./PortfolioSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>
        <section id="home">
          <HeroSection />
        </section>
        <section id="portfolio">
          <PortfolioSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
