import { useState } from "react";
import Layout from "../components/Layout";
import PageTitle from "../components/PageTitle";

const mockTransactions = [
  {
    id: 1,
    description: "Pro Subscription - Monthly",
    amount: "$19.99",
    date: "2024-10-01",
    status: "completed",
  },
  {
    id: 2,
    description: "Premium Template Pack",
    amount: "$9.99",
    date: "2024-09-15",
    status: "completed",
  },
  {
    id: 3,
    description: "Extended Guest Support",
    amount: "$4.99",
    date: "2024-09-01",
    status: "completed",
  },
];

export default function Payments() {
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 pb-28">
        <PageTitle
          title="Payments"
          subtitle="Manage your billing and payment methods."
        />

        {/* Payment Method */}
        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
          <h3 className="text-xl font-bold text-white mb-6">Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center p-4 border border-white/10 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
              <input
                type="radio"
                name="payment"
                value="credit-card"
                checked={paymentMethod === "credit-card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <div>
                <p className="font-bold text-white">Credit Card</p>
                <p className="text-sm text-slate-400">â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ 4242</p>
              </div>
            </label>
            <label className="flex items-center p-4 border border-white/10 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={paymentMethod === "paypal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <div>
                <p className="font-bold text-white">PayPal</p>
                <p className="text-sm text-slate-400">user@example.com</p>
              </div>
            </label>
          </div>
        </section>

        {/* Transaction History */}
        <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
          <h3 className="text-xl font-bold text-white mb-6">Transaction History</h3>
          <div className="space-y-2">
            {mockTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-slate-950/50 border border-white/10 rounded-xl"
              >
                <div>
                  <p className="font-bold text-white">{transaction.description}</p>
                  <p className="text-sm text-slate-400">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">{transaction.amount}</p>
                  <p className="text-xs text-slate-400 capitalize">{transaction.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
