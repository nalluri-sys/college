import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "This platform saved me during my exams! Found all the previous year papers organized by subject. Absolute lifesaver!",
    name: "Priya Sharma",
    role: "4th Year, CSE",
    avatar: "PS",
  },
  {
    quote: "The quality of notes here is amazing. Better than what I could find anywhere else. Highly recommend to all juniors!",
    name: "Rahul Kumar",
    role: "3rd Year, ECE",
    avatar: "RK",
  },
  {
    quote: "Finally a place where all materials are in one spot. No more hunting through WhatsApp groups!",
    name: "Sneha Reddy",
    role: "2nd Year, Mechanical",
    avatar: "SR",
  },
  {
    quote: "The semester-wise organization makes it so easy to find what I need. Great initiative by the seniors!",
    name: "Arun Patel",
    role: "1st Year, IT",
    avatar: "AP",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-4">
            Student Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Loved by VVIT Students
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it. Here's what your fellow students have to say.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-card border border-border shadow-soft hover:shadow-card transition-shadow"
            >
              <Quote className="w-10 h-10 text-accent/30 mb-4" />
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
