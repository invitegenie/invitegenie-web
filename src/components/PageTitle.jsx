export default function PageTitle({ title, subtitle }) {
  return (
    <div className="space-y-3 mb-8">
      <h1 className="text-4xl font-semibold font-heading text-white">{title}</h1>
      <p className="max-w-2xl text-gray-400">{subtitle}</p>
    </div>
  );
}
