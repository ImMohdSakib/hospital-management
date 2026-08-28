import { useNavigate } from 'react-router-dom';
import { Lock, Home, ArrowLeft } from 'lucide-react';

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
        <Lock size={48} className="text-red-600" />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-slate-800">Access Denied</h2>
      <p className="mt-2 text-slate-500 max-w-md">
        You don't have permission to view this page. Please contact your administrator.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
        <button
          onClick={() => navigate('/webadmin/dashboard')}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-xl hover:bg-teal-700"
        >
          <Home size={18} />
          Dashboard
        </button>
      </div>
    </div>
  );
}