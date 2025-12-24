import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SemesterCard from "@/components/SemesterCard";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import { semesters } from "@/data/materials";
import { BookOpen, FileText, Users, TrendingUp } from "lucide-react";

const stats = [
  { icon: BookOpen, value: "7", label: "Semesters" },
  { icon: FileText, value: "315+", label: "Materials" },
  { icon: Users, value: "5000+", label: "Students" },
  { icon: TrendingUp, value: "50K+", label: "Downloads" },
];

const materialsFAQs = [
  {
    question: "How are the materials organized?",
    answer: "All materials are organized semester-wise and then by subject. Each subject contains different types of materials like lecture notes, textbooks, previous year papers, assignments, and lab manuals.",
  },
  {
    question: "What file formats are available?",
    answer: "We provide materials in multiple formats including PDF (most common), DOC/DOCX for editable documents, and PPT/PPTX for presentations. PDF files are recommended for the best viewing experience.",
  },
  {
    question: "How often are materials updated?",
    answer: "We update our collection regularly. Previous year papers are added after each exam cycle, and new notes are added as they become available. Check the 'Recently Added' section for the latest uploads.",
  },
  {
    question: "Can I request specific materials?",
    answer: "Yes! If you can't find what you're looking for, use the contact form to request specific materials. We'll try our best to source them from our network of contributors.",
  },
  {
    question: "How can I contribute materials?",
    answer: "We welcome contributions from students and faculty. Click on the 'Contribute' button, upload your files, and add relevant details. All submissions are reviewed before being published to ensure quality.",
  },
];

const Materials = () => {
  return (
    <>
      <Helmet>
        <title>All Materials - VVIT Materials Hub | Engineering Study Resources</title>
        <meta
          name="description"
          content="Browse comprehensive study materials for all 7 engineering semesters at VVIT. Download lecture notes, previous papers, assignments, and more."
        />
      </Helmet>

      <div className="min-h-screen">
        <Navbar />

        <main className="pt-16">
          {/* Header Section */}
          <section className="py-16 bg-hero-gradient relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-64 h-64 bg-accent rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-semibold mb-4">
                  Complete Resource Library
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
                  All Study Materials
                </h1>
                <p className="text-lg text-primary-foreground/80 mb-8">
                  Access comprehensive study materials for all 7 semesters. Everything organized, 
                  verified, and ready to download.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {stats.map((stat, index) => (
                    <div key={index} className="p-4 rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
                      <stat.icon className="w-6 h-6 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
                      <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-12 bg-secondary/50">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  "📚 Organized by Semester",
                  "📄 Multiple Formats (PDF, DOC, PPT)",
                  "🔄 Regularly Updated",
                  "✅ Quality Verified",
                ].map((feature, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Semester Grid */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Choose Your Semester
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Select your semester to access all subjects and their materials. 
                  Each semester is packed with notes, papers, and resources.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {semesters.map((semester) => (
                  <SemesterCard key={semester.id} semester={semester} />
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <CTASection
            title="Can't Find What You Need?"
            description="Request specific materials or contribute your own notes to help fellow students."
          />

          {/* FAQ */}
          <FAQSection
            faqs={materialsFAQs}
            title="Questions About Materials"
            description="Everything you need to know about accessing and using our study resources."
          />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Materials;
