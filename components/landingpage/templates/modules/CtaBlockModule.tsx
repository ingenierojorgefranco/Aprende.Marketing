import React from 'react';
import { GeneratedPageContent } from '../../../../types';
import { SmartCTA } from '../../ui/LiveComponents';

interface CtaBlockModuleProps {
  content: GeneratedPageContent;
  ds: any;
  isMobilePreview: boolean;
  pageId?: string;
  basePath?: string;
  sticky?: boolean;
  project?: any;
}

export const CtaBlockModule: React.FC<CtaBlockModuleProps> = ({ content, ds, isMobilePreview, pageId, basePath, sticky = true, project }) => {
  return (
    <div className={`${!isMobilePreview && sticky ? 'lg:sticky lg:top-24' : ''} w-full`}>
      <SmartCTA content={content} ds={ds} isMobilePreview={isMobilePreview} fullWidth={true} pageId={pageId} basePath={basePath} project={project} />
    </div>
  );
};