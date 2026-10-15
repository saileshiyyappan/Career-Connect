import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Github, Twitter, Linkedin, Globe } from 'lucide-react';
import { FOOTER_LINKS } from '../../constants/navigation';
import { CareerConnectLogo } from '../common/CareerConnectLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <RouterLink to="/" className="inline-flex items-center group">
              <CareerConnectLogo variant="horizontal" size="md" inverted={true} showTagline={true} />
            </RouterLink>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering global talent and connecting modern teams. Explore top opportunities, streamline recruitment workflows, and elevate your career.
            </p>

            <div className="flex items-center gap-3 text-slate-400 pt-2">
              <a 
                href="https://saileshiyyappan.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors" 
                aria-label="Portfolio"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com/saileshiyyappan" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors" 
                aria-label="Github"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://x.com/saileshiyyappan" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors" 
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/saileshiyyappan/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors" 
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Candidates Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Candidates
            </h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.candidates.map((link, idx) => (
                <li key={idx}>
                  <RouterLink to={link.path} className="text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.employers.map((link, idx) => (
                <li key={idx}>
                  <RouterLink to={link.path} className="text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              CareerConnect
            </h4>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_LINKS.company.map((link, idx) => (
                <li key={idx}>
                  <RouterLink to={link.path} className="text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </RouterLink>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareerConnect Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Empowering careers and modern hiring worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};
