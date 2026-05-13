
import React from 'react';
import { DollarSign, FileText, Briefcase, Award, Sparkles, Users, Zap, BookOpen, ScanFace, Palette, Feather, Rocket, Target, Globe, MessageCircle } from 'lucide-react';

const iconMap: any = {
    DollarSign, FileText, Briefcase, Award, Sparkles, Users, Zap, BookOpen, ScanFace, Palette, Feather, Rocket, Target, Globe, MessageCircle
};

export const getIcon = (name: string | undefined, defaultIcon: any) => {
    if (!name) return defaultIcon;
    const Icon = iconMap[name];
    return Icon ? <Icon className="w-full h-full" /> : defaultIcon;
};

export const renderRichText = (text: string, className: string = "") => {
    if (!text) return null;
    
    // Split by double newlines to create paragraphs
    const paragraphs = text.split(/\n\n+/);
    
    return (
      <div className={className}>
        {paragraphs.map((p, i) => (
          <p 
            key={i} 
            className={i > 0 ? "mt-6" : ""}
            dangerouslySetInnerHTML={{ __html: p.replace(/\n/g, '<br />') }} 
          />
        ))}
      </div>
    );
};

export const renderStyledHeadline = (text: string, className: string, gradientClass: string = "from-secondary to-orange-600") => {
    // Replace <b> content </b> with the span gradient class
    const htmlContent = text.replace(
      /<b>(.*?)<\/b>/g, 
      `<span class="text-transparent bg-clip-text bg-gradient-to-r ${gradientClass}">$1</span>`
    );
    
    return (
      <h1 
        id="titulo-principal"
        className={className}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
};

export const getProjectStrategy = (project: any) => {
    if (!project || !project.strategy_json) return null;
    if (typeof project.strategy_json === 'object') return project.strategy_json;
    try {
        let parsed = JSON.parse(project.strategy_json);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        return parsed;
    } catch (e) {
        return null;
    }
};
