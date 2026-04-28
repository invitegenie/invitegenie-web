import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

// Local Helper (Fallback if services/helpers not fully implemented for FCFA)
const formatFCFA = (amount) => {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0
  }).format(amount).replace('FCFA', 'FCFA ');
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    paid: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Paid" },
    unpaid: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Unpaid" },
    overdue: { bg: "bg-red-500/10", text: "text-red-400", label: "Overdue" },
    held: { bg: "bg-gray-500/10", text: "text-gray-400", label: "Held" },
  };

  const config = statusConfig[status] || statusConfig.unpaid;
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

// Add Invoice Modal Component
const AddInvoiceModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ client: '', city: 'Douala', amount: '', status: 'unpaid' });
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#141218] border border-white/10 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-white mb-4">Create New Invoice</h3>
        <div className="space-y-4">
          <input type="text" placeholder="Client Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-violet-500" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
          <input type="text" placeholder="City" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-violet-500" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
          <input type="number" placeholder="Amount (FCFA)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-violet-500" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2 rounded-xl border border-white/10 text-gray-400 text-sm font-bold">Cancel</button>
            <button onClick={() => onSave(formData)} className="flex-1 px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-bold">Save Invoice</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Invoice List Item Component
const InvoiceListItem = ({ invoice, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl transition-all border mb-3 ${
        isSelected
          ? "bg-violet-600/20 border-violet-500/50"
          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
      }`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="font-semibold text-gray-100 text-sm">{invoice.id}</span>
        <StatusBadge status={invoice.status} />
      </div>
      <div className="text-[11px] text-gray-400 mb-1">{invoice.date}</div>
      <div className="text-sm font-bold text-gray-100">{formatFCFA(invoice.amount)}</div>
      <div className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-tighter">Client: {invoice.client}</div>
    </button>
  );
};

// Invoice Details Component
const InvoiceDetails = ({ invoice, onMarkPaid, onDownload, onSend, onHold, onPrev, onNext, onEdit }) => {
  if (!invoice) return null;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 bg-white/[0.03] border border-white/5 p-2 rounded-xl">
        <div className="flex items-center gap-1">
          <button onClick={onPrev} className="p-2 text-gray-400 hover:text-white transition"><span className="material-symbols-outlined text-[20px]">chevron_left</span></button>
          <button onClick={onNext} className="p-2 text-gray-400 hover:text-white transition"><span className="material-symbols-outlined text-[20px]">chevron_right</span></button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onDownload} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-[11px] font-bold hover:bg-white/10 transition-all">
            <span className="material-symbols-outlined text-[16px]">download</span>
            PDF DOWNLOAD
          </button>
        </div>
      </div>

      {/* Main Invoice Card */}
      <div className="rounded-2xl bg-[#141218]/80 border border-white/5 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-violet-500/50" />
        
        <div className="p-8">
          {/* Header Row */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Invoice Number</p>
              <h2 className="text-3xl font-black text-white tracking-tighter">#{invoice.id}</h2>
              <div className="mt-4"><StatusBadge status={invoice.status} /></div>
            </div>
            <div className="text-right space-y-4">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Issued Date</p>
                <p className="text-sm font-bold text-gray-200">{invoice.date}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Due Date</p>
                <p className="text-sm font-bold text-gray-200">{invoice.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Bill Sections */}
          <div className="grid grid-cols-2 gap-10 mb-10 pb-10 border-b border-white/5">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Bill From</h4>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">InviteGenie Ltd</p>
                <p className="text-xs text-gray-500 font-medium">Bonanjo, Douala, Cameroon</p>
                <p className="text-xs text-gray-500 font-medium">support@invitegenie.cm</p>
                <p className="text-xs text-gray-500 font-medium">+237 677 123 456</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-violet-400 uppercase tracking-widest">Bill To</h4>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">{invoice.client}</p>
                <p className="text-xs text-gray-500 font-medium">{invoice.city}, Cameroon</p>
                <p className="text-xs text-gray-500 font-medium">{invoice.email}</p>
                <p className="text-xs text-gray-500 font-medium">{invoice.phone}</p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mb-10">
             <table className="w-full text-left">
                <thead className="bg-white/[0.02] border-y border-white/5">
                   <tr>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase text-right">Price</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase text-center">Qty</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase text-right">Amount</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {invoice.items.map((item, i) => (
                     <tr key={i} className="text-xs font-medium text-gray-300">
                        <td className="px-4 py-4">{item.category}</td>
                        <td className="px-4 py-4 text-right">{formatFCFA(item.price)}</td>
                        <td className="px-4 py-4 text-center">{item.qty}</td>
                        <td className="px-4 py-4 text-right font-bold text-white">{formatFCFA(item.amount)}</td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>

          {/* Footer Summary */}
          <div className="flex justify-end">
             <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-xs">
                   <span className="text-gray-500 font-bold uppercase tracking-wider">Subtotal</span>
                   <span className="text-gray-200 font-bold">{formatFCFA(invoice.subtotal)}</span>
                </div>
                <div className="space-y-1 py-2 border-y border-white/5">
                   <div className="flex justify-between text-[10px]">
                      <span className="text-gray-600 font-bold uppercase">VAT / TVA (19.25%)</span>
                      <span className="text-gray-400">{formatFCFA(invoice.subtotal * 0.1925)}</span>
                   </div>
                   <div className="flex justify-between text-[10px]">
                      <span className="text-gray-600 font-bold uppercase">Municipal Tax</span>
                      <span className="text-gray-400">{formatFCFA(2500)}</span>
                   </div>
                </div>
                <div className="flex justify-between text-xs">
                   <span className="text-gray-500 font-bold uppercase tracking-wider">Service Fee</span>
                   <span className="text-gray-200 font-bold">{formatFCFA(invoice.serviceFee)}</span>
                </div>
                <div className="flex justify-between pt-3">
                   <span className="text-sm font-black text-white uppercase tracking-widest">Total</span>
                   <span className="text-lg font-black text-violet-400">{formatFCFA(invoice.total + (invoice.subtotal * 0.1925) + 2500)}</span>
                </div>
             </div>
          </div>

          {/* Notes Section */}
          <div className="mt-12 p-5 rounded-xl bg-white/[0.02] border border-white/5">
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Instructions & Notes</p>
             <p className="text-xs text-gray-400 leading-relaxed italic">{invoice.notes}</p>
          </div>

          {/* African Payment Methods */}
          <div className="mt-8 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400"><span className="material-symbols-outlined">payments</span></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available: <span className="text-white">MTN MoMo / Orange Money</span></p>
             </div>
             <button onClick={() => alert("Redirecting to secure local payment gateway...")} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase hover:bg-emerald-500 transition-colors">Pay Now</button>
          </div>

          {/* Bottom Action Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10">
            <button onClick={onEdit} className="p-3 rounded-xl border border-white/5 bg-white/5 text-[11px] font-black uppercase text-gray-300 hover:bg-white/10 transition">Edit Invoice</button>
            <button onClick={onSend} className="p-3 rounded-xl border border-white/5 bg-white/5 text-[11px] font-black uppercase text-gray-300 hover:bg-white/10 transition">Send Invoice</button>
            <button onClick={onHold} className="p-3 rounded-xl border border-white/5 bg-amber-500/10 text-[11px] font-black uppercase text-amber-400 hover:bg-amber-500/20 transition">Hold Invoice</button>
            <button onClick={onMarkPaid} className="p-3 rounded-xl bg-emerald-600 text-white text-[11px] font-black uppercase shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 transition">Mark as Paid</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// KPI Card Component
const KPICard = ({ label, value, subtitle, icon, color }) => (
  <div className="rounded-2xl bg-white/[0.035] border border-white/5 p-4 flex items-center justify-between">
    <div>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-100">{value}</p>
      {subtitle && <p className="text-[10px] text-gray-500 mt-1 font-bold">{subtitle}</p>}
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      <span className="material-symbols-outlined text-[24px]">{icon}</span>
    </div>
  </div>
);

// Main Invoices Component
export default function Invoices() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [invoices, setInvoices] = useState([
    {
      id: "INV-CMR-2029-0012",
      client: "Ngalle Marie",
      city: "Yaoundé",
      email: "marie.ngalle@email.cm",
      phone: "+237 670 123 456",
      date: "Apr 20, 2026",
      dueDate: "May 05, 2026",
      status: "paid",
      amount: 120000,
      subtotal: 100000,
      tax: 10000,
      serviceFee: 10000,
      total: 120000,
      items: [
        { category: "VIP Wedding Pass", price: 25000, qty: 2, amount: 50000 },
        { category: "Standard Entry", price: 10000, qty: 3, amount: 30000 },
        { category: "Premium Catering", price: 20000, qty: 1, amount: 20000 },
      ],
      notes: "Payment received. Thank you for your business! Venue: Yaoundé Leadership Summit.",
    },
    {
      id: "INV-CMR-2029-0013",
      client: "Tenda Joseph",
      city: "Douala",
      email: "joseph.tenda@email.cm",
      phone: "+237 673 456 789",
      date: "Apr 22, 2026",
      dueDate: "May 07, 2026",
      status: "unpaid",
      amount: 75000,
      subtotal: 60000,
      tax: 6000,
      serviceFee: 9000,
      total: 75000,
      items: [
        { category: "Concert Ticket - Regular", price: 15000, qty: 2, amount: 30000 },
        { category: "VIP Access", price: 15000, qty: 2, amount: 30000 },
      ],
      notes: "Douala Afro Beats Festival. Payment due via Orange/MTN Mobile Money.",
    },
    {
      id: "INV-CMR-2029-0014",
      client: "Fonsoh Benjamin",
      city: "Buea",
      email: "benjamin.fonsoh@email.cm",
      phone: "+237 680 789 012",
      date: "Apr 15, 2026",
      dueDate: "Apr 25, 2026",
      status: "overdue",
      amount: 210000,
      subtotal: 180000,
      tax: 18000,
      serviceFee: 12000,
      total: 210000,
      items: [
        { category: "Corporate Event Package", price: 100000, qty: 1, amount: 100000 },
        { category: "Audio/Visual Setup", price: 40000, qty: 2, amount: 80000 },
      ],
      notes: "Buea Wedding Gala Night. Please remit payment immediately.",
    },
    {
      id: "INV-CMR-2029-0011",
      client: "Akarawe Paula",
      city: "Limbe",
      email: "paula.akarawe@email.cm",
      phone: "+237 695 345 678",
      date: "Apr 10, 2026",
      dueDate: "Apr 24, 2026",
      status: "paid",
      amount: 95000,
      subtotal: 75000,
      tax: 7500,
      serviceFee: 12500,
      total: 95000,
      items: [
        { category: "Beach Festival Pass", price: 35000, qty: 1, amount: 35000 },
        { category: "Limbe Beach Resort Access", price: 20000, qty: 2, amount: 40000 },
      ],
      notes: "Limbe Beach Festival. Thank you for booking with us!",
    },
  ]);

  const [selectedId, setSelectedId] = useState(invoices[0].id);

  const selected = invoices.find((inv) => inv.id === selectedId);
  const selectedIndex = invoices.findIndex((inv) => inv.id === selectedId);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch = inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            inv.client.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = statusFilter === "All" || inv.status === statusFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [invoices, searchTerm, statusFilter]);

  const stats = {
    paid: invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0),
    unpaid: invoices.filter((i) => i.status === "unpaid").reduce((sum, i) => sum + i.amount, 0),
    overdue: invoices.filter((i) => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0),
  };

  const handleMarkPaid = () => {
    if (selected) {
      setInvoices(
        invoices.map((inv) =>
          inv.id === selected.id ? { ...inv, status: "paid" } : inv
        )
      );
      alert("Invoice marked as paid!");
    }
  };

  const handleAddSave = (data) => {
    const newInv = {
      id: `INV-CMR-2029-${Math.floor(1000 + Math.random() * 9000)}`,
      client: data.client,
      city: data.city,
      amount: Number(data.amount),
      status: data.status,
      date: 'Apr 26, 2026',
      dueDate: 'May 10, 2026',
      subtotal: Number(data.amount) * 0.8,
      tax: Number(data.amount) * 0.1,
      serviceFee: Number(data.amount) * 0.1,
      total: Number(data.amount),
      items: [{ category: 'New Event Service', price: data.amount, qty: 1, amount: data.amount }],
      notes: 'New Invoice Created via Dashboard.'
    };
    setInvoices([newInv, ...invoices]);
    setSelectedId(newInv.id);
    setIsAddModalOpen(false);
  }

  const handleHold = () => {
    setInvoices(invoices.map(inv => inv.id === selectedId ? { ...inv, status: 'held' } : inv));
    alert("Invoice status updated to Held");
  }

  return (
    <Layout>
      <div className="max-w-[1440px] mx-auto pb-20 animate-in fade-in duration-500">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              <span className="cursor-pointer hover:text-violet-400 transition" onClick={() => navigate("/dashboard")}>
                Dashboard
              </span>
              <span>/</span>
              <span className="text-gray-300">Invoices</span>
            </div>
            <h1 className="text-2xl font-semibold text-white font-heading tracking-tight">Billing Management</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/notifications")} className="p-2 bg-white/[0.03] border border-white/5 rounded-lg text-gray-500 hover:text-white transition"><span className="material-symbols-outlined text-[18px]">notifications</span></button>
            <button onClick={() => navigate("/settings")} className="p-2 bg-white/[0.03] border border-white/5 rounded-lg text-gray-500 hover:text-white transition"><span className="material-symbols-outlined text-[18px]">settings</span></button>
            <div onClick={() => navigate("/profile")} className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-400 flex items-center justify-center text-white font-bold text-xs cursor-pointer">M</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: KPI + List */}
          <div className="lg:col-span-4 space-y-6">
            {/* KPI Stack */}
            <div className="grid grid-cols-1 gap-4">
              <KPICard label="Collected" value={invoices.filter(i=>i.status==='paid').length} subtitle={formatFCFA(stats.paid)} icon="verified" color="text-emerald-400 bg-emerald-500/10" />
              <div className="grid grid-cols-2 gap-4">
                <KPICard label="Unpaid" value={invoices.filter(i=>i.status==='unpaid').length} subtitle={formatFCFA(stats.unpaid)} icon="pending" color="text-amber-400 bg-amber-500/10" />
                <KPICard label="Overdue" value={invoices.filter(i=>i.status==='overdue').length} subtitle={formatFCFA(stats.overdue)} icon="error" color="text-rose-400 bg-rose-500/10" />
              </div>
            </div>

            {/* Invoice List Container */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-5 flex flex-col h-[700px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white text-base">Invoices</h3>
                <button onClick={() => setIsAddModalOpen(true)} className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white"><span className="material-symbols-outlined text-sm">add</span></button>
              </div>

              <div className="relative mb-6">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-500 text-sm">search</span>
                <input type="text" placeholder="Search invoices..." className="w-full bg-white/[0.03] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-300 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
                {['All', 'Paid', 'Unpaid', 'Overdue'].map(tab => (
                  <button key={tab} onClick={() => setStatusFilter(tab)} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === tab ? 'bg-violet-600 text-white shadow-md' : 'text-gray-500 hover:text-white'}`}>{tab}</button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                {filteredInvoices.map(inv => (
                  <InvoiceListItem key={inv.id} invoice={inv} isSelected={selectedId === inv.id} onClick={() => setSelectedId(inv.id)} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Detail Preview */}
          <div className="lg:col-span-8">
            <InvoiceDetails
              invoice={selected}
              onPrev={() => selectedIndex > 0 && setSelectedId(invoices[selectedIndex - 1].id)}
              onNext={() => selectedIndex < invoices.length - 1 && setSelectedId(invoices[selectedIndex + 1].id)}
              onMarkPaid={handleMarkPaid}
              onDownload={() => window.print()}
              onSend={() => alert(`Invoice sent to ${selected?.email}`)}
              onEdit={() => alert(`Editing invoice ${selected?.id}`)}
              onHold={handleHold}
            />
          </div>
        </div>
      </div>

      <AddInvoiceModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddSave}
      />
    </Layout>
  );
}
