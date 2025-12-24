import { Link } from "react-router-dom";
import { BookOpen, Mail, MapPin, Phone, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold leading-tight">VVIT</span>
                <span className="text-xs text-primary-foreground/70 leading-tight">Materials Hub</span>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Your one-stop destination for all engineering study materials. Access notes, papers, and resources for all 7 semesters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "All Materials", path: "/materials" },
                { name: "1-1", path: "/semester/1" },
                { name: "1-2", path: "/semester/2" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Semesters */}
          <div>
            <h4 className="font-semibold mb-4">More Semesters</h4>
            <ul className="space-y-2">
              {[
                { id: 3, name: "2-1" },
                { id: 4, name: "2-2" },
                { id: 5, name: "3-1" },
                { id: 6, name: "3-2" },
                { id: 7, name: "4-1" },
              ].map((sem) => (
                <li key={sem.id}>
                  <Link
                    to={`/semester/${sem.id}`}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {sem.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Vasireddy Venkatadri Institute of Technology, Guntur, AP</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Mail className="w-4 h-4 shrink-0" />
                <span>materials@vvit.edu.in</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/70">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+91 9876543210</span>
              </li>
            </ul>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-4">
              {[Github, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/70">
            © {currentYear} VVIT Materials Hub. All rights reserved.
          </p>
          <p className="text-sm text-primary-foreground/70">
            Made with ❤️ for VVIT Students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
