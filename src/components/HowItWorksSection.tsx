import { MousePointer, FolderOpen, Download, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: MousePointer,
    step: "01",
    title: "Select Semester",
    description: "Choose your current semester from our organized menu to see all relevant subjects.",
  },
  {
    icon: FolderOpen,
    step: "02",
    title: "Browse Subjects",
    description: "Explore materials organized by subject — notes, papers, assignments, and more.",
  },
  {
    icon: Download,
    step: "03",
    title: "Download & Study",
    description: "Download materials in your preferred format and start studying right away.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Excel & Contribute",
    description: "Ace your exams and give back by contributing your own notes for others.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple Steps to Success
          </h2>
          <p className="text-muted-foreground text-lg">
            Getting started is easy. Follow these simple steps to access all the materials you need.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}
              
              <div className="relative flex flex-col items-center text-center">
                {/* Step Number */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-2xl bg-card border-2 border-border flex items-center justify-center shadow-soft">
                    <item.icon className="w-10 h-10 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm max-w-[250px]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
