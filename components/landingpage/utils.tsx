
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
    // Replace newlines with <br>
    const formattedText = text ? text.replace(/\n/g, '<br />') : '';
    return (
      <div 
          className={className} 
          dangerouslySetInnerHTML={{ __html: formattedText }} 
      />
    );
};

export const renderStyledHeadline = (text: string, className: string) => {
    // Replace <b> content </b> with the span gradient class
    const htmlContent = text.replace(
      /<b>(.*?)<\/b>/g, 
      '<span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-600">$1</span>'
    );
    
    return (
      <h1 
        id="titulo-principal"
        className={className}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
};
