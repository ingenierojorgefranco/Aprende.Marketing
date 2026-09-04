import sys

file = 'components/landingpage/templates/ClassicSalesTemplate.tsx'
with open(file, 'r') as f:
    content = f.read()

target = """                     <div className="mb-10 space-y-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                         <h4 className={`font-bold mb-4 flex items-center gap-2 ${ds.hero.titleColor || 'text-white'}`}>
                             <Zap className="w-5 h-5 text-yellow-400" />
                             ¿Por qué unirte hoy?
                         </h4>
                         <ul className="space-y-3">
                             <li className="flex items-start gap-3">
                                 <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                 <span className={`text-sm leading-relaxed ${ds.hero.subtitleColor || 'text-white/90'}`}>
                                     Sin experiencia previa
                                 </span>
                             </li>
                             <li className="flex items-start gap-3">
                                 <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                 <span className={`text-sm leading-relaxed ${ds.hero.subtitleColor || 'text-white/90'}`}>
                                     Desde casa y a tu ritmo
                                 </span>
                             </li>
                             <li className="flex items-start gap-3">
                                 <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                 <span className={`text-sm leading-relaxed ${ds.hero.subtitleColor || 'text-white/90'}`}>
                                     Certificado incluido
                                 </span>
                             </li>
                         </ul>
                     </div>
                     <CtaBlockModule content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} project={project} />"""

replacement = """                     <CtaBlockModule content={content} ds={ds} isMobilePreview={isMobilePreview} pageId={pageId} basePath={basePath} project={project} />
                     <div className="mt-8 mb-10 space-y-3 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-xl">
                         <h4 className={`font-bold mb-4 flex items-center gap-2 ${ds.hero.titleColor || 'text-white'}`}>
                             <Zap className="w-5 h-5 text-yellow-400" />
                             ¿Por qué unirte hoy?
                         </h4>
                         <ul className="space-y-3">
                             <li className="flex items-start gap-3">
                                 <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                 <span className={`text-sm leading-relaxed ${ds.hero.subtitleColor || 'text-white/90'}`}>
                                     Sin experiencia previa
                                 </span>
                             </li>
                             <li className="flex items-start gap-3">
                                 <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                 <span className={`text-sm leading-relaxed ${ds.hero.subtitleColor || 'text-white/90'}`}>
                                     Desde casa y a tu ritmo
                                 </span>
                             </li>
                             <li className="flex items-start gap-3">
                                 <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                                 <span className={`text-sm leading-relaxed ${ds.hero.subtitleColor || 'text-white/90'}`}>
                                     Certificado incluido
                                 </span>
                             </li>
                         </ul>
                     </div>"""

if target in content:
    with open(file, 'w') as f:
        f.write(content.replace(target, replacement))
    print("Replaced successfully")
else:
    print("Target not found")
