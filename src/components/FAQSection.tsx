import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQ[];
  title?: string;
  description?: string;
}

const defaultFAQs: FAQ[] = [
  {
    question: "Are all materials free to download?",
    answer: "Yes! All study materials on VVIT Materials Hub are completely free. This platform is created by students for students, and our goal is to make education accessible to everyone.",
  },
  {
    question: "How do I download materials?",
    answer: "Simply navigate to your semester, select the subject, and click the download button next to any material. No registration is required for downloading.",
  },
  {
    question: "Can I contribute my own notes?",
    answer: "Absolutely! We encourage students to contribute their notes and study materials. Click on the 'Contribute' button and upload your files. All contributions are reviewed before being published.",
  },
  {
    question: "Are the previous year papers updated?",
    answer: "Yes, we regularly update our collection with the latest examination papers. Papers from the most recent semesters are typically added within a few weeks of the exams.",
  },
  {
    question: "Who verifies the quality of materials?",
    answer: "All materials are reviewed by senior students and faculty members before being published. We ensure accuracy and relevance to the current syllabus.",
  },
];

const FAQSection = ({ faqs = defaultFAQs, title = "Frequently Asked Questions", description }: FAQSectionProps) => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
              FAQs
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {title}
            </h2>
            {description && (
              <p className="text-muted-foreground text-lg">{description}</p>
            )}
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 shadow-soft"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-accent hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
