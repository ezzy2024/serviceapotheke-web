'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, Shield, Users, Zap, BarChart3, Lock } from "lucide-react";
import { CookieConsent } from '@/components/legal/CookieConsent';
import { trackConversion } from '@/lib/tracking';
import Chatbot from '@/components/Chatbot';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
        <div className="container mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">S</div>
            <span className="text-xl font-bold text-slate-900">ServiceApotheke</span>
          </div>
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Lösungen</a>
            <a href="#for-pharmacies" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Für Apotheken</a>
            <a href="#for-pharmacists" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Für Apotheker</a>
            <Link href="/ueber-uns" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Über uns</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section - Split Screen */}
        <section className="section-container">
          <div className="container mx-auto max-w-6xl">
            <div className="hero-split">
              {/* Left: Typography & CTA */}
              <div className="space-y-6 lg:space-y-8">
                <div className="space-y-4">
                  <div className="compliance-badge shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Freelance-Dienstvertrag & DSGVO-zertifiziert</span>
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight">
                    Apotheken-Management,<br />
                    <span className="gradient-text">neu gedacht.</span>
                  </h1>
                  <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                    ServiceApotheke ist die Betriebssystem-Plattform für deutsche Apotheken. 
                    Automatisieren Sie pDL-Verwaltung, Personalvermittlung und Compliance-Prozesse 
                    in einer Lösung.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/onboarding"
                    onClick={() => trackConversion('hero_cta_clicked')}
                    className="btn-primary-cta text-center text-lg"
                  >
                    Kostenlos starten
                  </Link>
                  <a 
                    href="#features"
                    className="py-4 px-8 rounded-full font-semibold text-blue-600 border-2 border-blue-600 bg-white hover:bg-blue-50 transition-all duration-200 text-center text-lg shadow-sm"
                  >
                    Mehr erfahren
                  </a>
                </div>
              </div>

              {/* Right: Hero Image */}
              <div className="image-container transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <Image 
                  src="/assets/hero-bg.png" 
                  alt="Moderne Apotheken-Verwaltung" 
                  className="object-cover"
                  fill
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST ELEMENTS SECTION */}
        <section className="border-y border-slate-200/50 bg-slate-50/50 py-12">
          <div className="container mx-auto max-w-6xl px-4 text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">
              Entwickelt für die moderne Apotheke
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-extrabold text-slate-900">100%</span>
                <span className="text-sm text-slate-500 mt-1">Digitaler Workflow</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-extrabold text-slate-900">DSGVO</span>
                <span className="text-sm text-slate-500 mt-1">Strengster Datenschutz</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-extrabold text-slate-900">ISO</span>
                <span className="text-sm text-slate-500 mt-1">27001 Konformität</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="section-container bg-gradient-to-b from-blue-50/50 to-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Alles, was Sie brauchen
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Integrierte Module für Compliance, Personalmanagement und Betriebseffizienz
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="feature-card group glass-card-hover cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white mb-4 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">pDL-Management</h3>
                <p className="text-slate-600 leading-relaxed">
                  Automatische Ingestion und Verwaltung von MiniExcel-Daten. Keine manuellen Uploads mehr.
                </p>
              </div>

              <div className="feature-card group glass-card-hover cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white mb-4 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Shift-Radar</h3>
                <p className="text-slate-600 leading-relaxed">
                  Intelligente Personalvermittlung mit Haversine-Algorithmus. Finden Sie die richtige Person zur richtigen Zeit.
                </p>
              </div>

              <div className="feature-card group glass-card-hover cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white mb-4 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Freelancer-Compliance</h3>
                <p className="text-slate-600 leading-relaxed">
                  Automatische Compliance-Checks für Honorarvertretungen. Immer regelkonform.
                </p>
              </div>

              <div className="feature-card group glass-card-hover cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white mb-4 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">DMS</h3>
                <p className="text-slate-600 leading-relaxed">
                  Sicheres Dokumentenmanagementsystem mit vollständiger Audit-Trail. DSGVO-konform.
                </p>
              </div>

              <div className="feature-card group glass-card-hover cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white mb-4 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Live-Dashboards</h3>
                <p className="text-slate-600 leading-relaxed">
                  Echtzeit-Übersicht über Ihre Betriebsmetriken. Datengesteuerte Entscheidungen.
                </p>
              </div>

              <div className="feature-card group glass-card-hover cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white mb-4 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise-Security</h3>
                <p className="text-slate-600 leading-relaxed">
                  End-to-End-Verschlüsselung, SSO, und Zwei-Faktor-Authentifizierung. Ihre Daten sind sicher.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Pharmacies Section */}
        <section id="for-pharmacies" className="section-container">
          <div className="container mx-auto max-w-6xl">
            <div className="hero-split">
              {/* Left: Image */}
              <div className="image-container order-2 lg:order-1 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                <Image 
                  src="/assets/hero-compliance-security.png" 
                  alt="Compliance & Sicherheit" 
                  className="object-cover"
                  fill
                />
              </div>

              {/* Right: Typography */}
              <div className="space-y-6 lg:space-y-8 order-1 lg:order-2">
                <div className="space-y-4">
                  <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    Für Apotheken
                  </h2>
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Optimieren Sie Ihre Betriebsabläufe mit automatisierter Personalvermittlung, 
                    Compliance-Management und Dokumentenverwaltung. ServiceApotheke reduziert 
                    administrative Lasten um bis zu 70%.
                  </p>
                  <ul className="space-y-4 mt-6">
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-medium text-slate-700">Automatische Personalvermittlung</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-medium text-slate-700">Freelancer-Compliance-Checks</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-medium text-slate-700">Zentrale Dokumentenverwaltung</span>
                    </li>
                  </ul>
                </div>
                <Link 
                  href="/register/pharmacy"
                  onClick={() => trackConversion('pharmacy_cta_clicked', 'pharmacy')}
                  className="btn-primary-cta w-full sm:w-auto text-center inline-block text-lg"
                >
                  Für Ihre Apotheke
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* For Pharmacists Section */}
        <section id="for-pharmacists" className="section-container bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <div className="hero-split">
              {/* Left: Typography */}
              <div className="space-y-6 lg:space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    Für Apotheker
                  </h2>
                  <p className="text-xl text-slate-600 leading-relaxed">
                    Finden Sie schnell und einfach Ihre nächste Stelle. Unser Shift-Radar 
                    verbindet Sie mit Apotheken, die Ihre Fähigkeiten und Ihren Standort 
                    benötigen. Vollständige Transparenz, faire Bezahlung.
                  </p>
                  <ul className="space-y-4 mt-6">
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-medium text-slate-700">Intelligente Stellenvermittlung</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-medium text-slate-700">Flexible Schichten</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-lg font-medium text-slate-700">Sichere Zahlungsabwicklung</span>
                    </li>
                  </ul>
                </div>
                <Link 
                  href="/register/pharmacist"
                  onClick={() => trackConversion('pharmacist_cta_clicked', 'pharmacist')}
                  className="btn-primary-cta w-full sm:w-auto text-center inline-block text-lg"
                >
                  Jetzt registrieren
                </Link>
              </div>

              {/* Right: Image */}
              <div className="image-container transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <Image 
                  src="/assets/hero-personnel-matching.png" 
                  alt="Personalvermittlung" 
                  className="object-cover"
                  fill
                />
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-cyan-500">
          <div className="container mx-auto max-w-4xl text-center text-white space-y-8 px-4">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              Bereit, Ihre Apotheke zu transformieren?
            </h2>
            <p className="text-xl text-blue-50 max-w-2xl mx-auto">
              Starten Sie noch heute mit ServiceApotheke. Kostenlos, ohne Kreditkarte.
            </p>
            <Link 
              href="/onboarding"
              onClick={() => trackConversion('bottom_cta_clicked')}
              className="inline-block py-5 px-10 rounded-full text-lg font-bold bg-white text-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Kostenlos starten
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="container mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">S</div>
              <span className="text-xl font-bold text-white tracking-tight">ServiceApotheke</span>
            </div>
            <p className="text-slate-400 max-w-sm text-base leading-relaxed">
              Wir digitalisieren die Apotheken-Infrastruktur. Sicher, effizient und zukunftsweisend.
            </p>
          </div>
          <div>
            <h2 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Unternehmen</h2>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/ueber-uns" className="hover:text-blue-400 transition-colors">Über uns</Link></li>
              <li><Link href="/kontakt" className="hover:text-blue-400 transition-colors">Kontakt</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Rechtliches</h2>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/impressum" className="hover:text-blue-400 transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-blue-400 transition-colors">Datenschutz</Link></li>
              <li><Link href="/agb" className="hover:text-blue-400 transition-colors">AGB</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto max-w-6xl px-4 mt-16 pt-8 border-t border-slate-800 text-sm flex flex-col md:flex-row items-center justify-between">
          <p>&copy; {new Date().getFullYear()} ServiceApotheke – Ezzeldin Hassan. Alle Rechte vorbehalten.</p>
        </div>
      </footer>

      {/* Legal Cookie Consent */}
      <CookieConsent />
      
      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
}
