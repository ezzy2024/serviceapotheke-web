'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import api from '@/lib/api';
import { FileText, Loader2, Download, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InvoicesPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchInvoices();
    }
  }, [user]);

  const fetchInvoices = async () => {
    try {
      const res = await api.get(`/Invoice/pharmacy/${user?.id}`);
      setInvoices(res.data);
    } catch (err) {
      console.error('Failed to fetch invoices', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Unpaid':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700 border border-amber-200"><AlertCircle className="w-4 h-4" /> Offen</span>;
      case 'PaidToPlatform':
      case 'PaidToPharmacist':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-4 h-4" /> Bezahlt</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600 mb-2">Rechnungen & Honorare</h1>
          <p className="text-slate-600">Übersicht aller abgewickelten Schichten und Honorarabrechnungen.</p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-100/60 bg-white/40 flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Suchen..." 
              className="pl-10 w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-16">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white/50 p-16 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-blue-100">
              <FileText className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Keine Rechnungen vorhanden</h3>
            <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed">
              Es wurden noch keine Schichten über ServiceApotheke abgewickelt. Sobald ein Freelancer eine Schicht abgeschlossen hat, findest du hier die Rechnungen.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-600 text-sm font-semibold border-b border-slate-100">
                  <th className="py-4 px-6">Rechnungs-Nr.</th>
                  <th className="py-4 px-6">Datum</th>
                  <th className="py-4 px-6">Typ</th>
                  <th className="py-4 px-6">Betrag</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice: any) => (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={invoice.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-800">{invoice.invoiceNumber || `INV-${invoice.id}`}</td>
                    <td className="py-4 px-6 text-slate-600">{new Date(invoice.createdAt).toLocaleDateString('de-DE')}</td>
                    <td className="py-4 px-6 text-slate-600">{invoice.type === 'PharmacyInvoice' ? 'Plattform-Rechnung' : invoice.type}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">{invoice.totalAmount.toFixed(2)} €</td>
                    <td className="py-4 px-6">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {invoice.pdfFilePath && (
                        <a 
                          href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/api/InvoiceDownload/${invoice.id}`} 
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all font-medium text-sm"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </a>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
