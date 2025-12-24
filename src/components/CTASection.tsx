import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload } from "lucide-react";

interface CTASectionProps {
  variant?: "default" | "contribute";
  title?: string;
  description?: string;
}

const CTASection = ({ variant = "default", title, description }: CTASectionProps) => {
  const defaultTitle = variant === "contribute" 
    ? "Want to Help Your Juniors?" 
    : "Ready to Boost Your Grades?";
  
  const defaultDescription = variant === "contribute"
    ? "Share your notes, previous papers, or any study materials. Your contribution can help thousands of students."
    : "Access all study materials for free. Start browsing by semester or search for specific subjects.";

  return (
    <section className="py-20 bg-hero-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {title || defaultTitle}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {description || defaultDescription}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {variant === "contribute" ? (
              <>
                <Button variant="hero" size="lg" className="group">
                  <Upload className="w-5 h-5" />
                  Contribute Materials
                </Button>
                <Link to="/materials">
                  <Button variant="hero-outline" size="lg" className="group">
                    Browse Instead
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/materials">
                  <Button variant="hero" size="lg" className="group">
                    Browse All Materials
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/semester/1">
                  <Button variant="hero-outline" size="lg">
                    Start with 1-1
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
