export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* Gradiente cinematográfico de fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-fuchsia-900/20 to-orange-900/20" />
      
      {/* Efectos de luz animados */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-pink-600/30 rounded-full blur-[120px] animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/20 rounded-full blur-[120px] animate-pulse animation-delay-4000" />
      </div>

      {/* Pattern de puntos */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
        {/* Badge premium */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-600/10 to-pink-600/10 border border-white/10 backdrop-blur-xl mb-8 animate-fade-in-down">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium text-white/80">Trusted by 500+ Companies</span>
        </div>

        {/* ARIA Hero - Efecto 3D con glow */}
        <div className="relative animate-fade-in-up">
          <div className="absolute inset-0 blur-3xl opacity-50">
            <div className="text-8xl md:text-9xl lg:text-[12rem] font-black text-white">
              ARIA
            </div>
          </div>
          <h1 className="relative text-8xl md:text-9xl lg:text-[12rem] font-black tracking-tighter text-white leading-[0.8] transform hover:scale-105 transition-transform duration-500">
            <span className="inline-block hover:animate-pulse">A</span>
            <span className="inline-block hover:animate-pulse animation-delay-100">R</span>
            <span className="inline-block hover:animate-pulse animation-delay-200">I</span>
            <span className="inline-block hover:animate-pulse animation-delay-300">A</span>
          </h1>
        </div>

        {/* Tagline con gradiente premium */}
        <h2 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold animate-fade-in-up animation-delay-200">
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400 bg-clip-text text-transparent">
            The Future of Hiring
          </span>
          <span className="text-white"> is Here</span>
        </h2>

        {/* Descripción con glassmorphism */}
        <div className="mt-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative px-8 py-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
              <p className="text-lg text-white/90 leading-relaxed">
                ARIA delivers <span className="text-violet-400 font-semibold">AI-powered voice interviews</span>, 
                <span className="text-fuchsia-400 font-semibold"> predictive analytics</span>, and 
                <span className="text-orange-400 font-semibold"> automated candidate assessment</span>.
                Save 80% hiring time while improving accuracy — with multilingual interviewers ready out of the box.
              </p>
            </div>
          </div>
        </div>

        {/* CTAs Premium con animaciones */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-600">
          <a href="/dashboard" className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 ease-out hover:scale-110">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-violet-600 via-fuchsia-600 to-orange-500 rounded-xl"></span>
            <span className="absolute bottom-0 right-0 w-full h-full -mb-1 -mr-1 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-orange-500 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity"></span>
            <span className="relative flex items-center gap-2">
              Get Started 
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </a>

          <a href="/pricing" className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 hover:scale-105">
            <span className="absolute inset-0 w-full h-full bg-white/5 backdrop-blur-xl rounded-xl border border-white/20"></span>
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white/10 to-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative">View Pricing</span>
          </a>
        </div>

        {/* Social proof - Texto en lugar de imágenes placeholder */}
        <div className="mt-16 flex items-center justify-center gap-8 text-white/40 text-sm font-medium animate-fade-in animation-delay-800">
          <span className="hover:text-white/60 transition-colors">Google</span>
          <span className="hover:text-white/60 transition-colors">Microsoft</span>
          <span className="hover:text-white/60 transition-colors">Amazon</span>
          <span className="hover:text-white/60 transition-colors">Meta</span>
        </div>
      </section>

      {/* Feature cards con efectos premium */}
      <section className="relative max-w-7xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="group relative animate-fade-in-up animation-delay-200">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative h-full rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300">
              <div className="absolute top-0 left-0 w-20 h-20 bg-violet-500/20 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">AI Voice Interviewers</h3>
                <p className="text-white/70 leading-relaxed">
                  Male/Female voices in <span className="text-violet-400">English and Spanish</span>. Up to 10 tailored questions per role with real-time adaptation.
                </p>
                <div className="mt-6 flex items-center text-violet-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                  Learn more 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative animate-fade-in-up animation-delay-400">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative h-full rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300">
              <div className="absolute top-0 left-0 w-20 h-20 bg-fuchsia-500/20 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Smart CV + JD Matching</h3>
                <p className="text-white/70 leading-relaxed">
                  <span className="text-fuchsia-400">RAG + embeddings</span> to evaluate candidates beyond keyword matching with 95% accuracy.
                </p>
                <div className="mt-6 flex items-center text-fuchsia-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                  Learn more 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative animate-fade-in-up animation-delay-600">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative h-full rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10 p-8 hover:border-white/20 transition-all duration-300">
              <div className="absolute top-0 left-0 w-20 h-20 bg-orange-500/20 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Enterprise Ready</h3>
                <p className="text-white/70 leading-relaxed">
                  Audit trails, integrations <span className="text-orange-400">(LinkedIn, Retell)</span>, and usage-based billing for scale.
                </p>
                <div className="mt-6 flex items-center text-orange-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                  Learn more 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up animation-delay-800">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">500+</div>
            <div className="mt-2 text-sm text-white/60">Companies</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">50K+</div>
            <div className="mt-2 text-sm text-white/60">Interviews</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">95%</div>
            <div className="mt-2 text-sm text-white/60">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">80%</div>
            <div className="mt-2 text-sm text-white/60">Time Saved</div>
          </div>
        </div>
      </section>
    </main>
  );
}