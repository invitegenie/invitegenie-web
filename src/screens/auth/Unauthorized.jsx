export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-slate-400 mb-6">You don't have permission to access this page.</p>
        <a href="/" className="inline-block px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700">
          Go Home
        </a>
      </div>
    </div>
  );
}
