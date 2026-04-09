import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import * as authService from "@/services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "admin@viralstan.com", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.login(form);
      toast.success(`Welcome back, ${res.user.name}! Joining the dashboard...`);
      
      // Delay navigation slightly for feedback
      setTimeout(() => {
        navigate("/");
        window.location.reload(); // Ensure layout fetches fresh auth state
      }, 1000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-white to-rose-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 animate-fade-in relative overflow-hidden">
      {/* Background blobs for premium look */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow" />

      <div className="w-full max-w-[480px] z-10">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[40px] shadow-2xl p-8 md:p-12 border border-white/40 dark:border-slate-800/50">
          <div className="flex flex-col items-center mb-10">
            <div className="h-20 w-20 rounded-3xl gradient-primary flex items-center justify-center shadow-xl shadow-primary/20 mb-6 group hover:scale-105 transition-transform duration-500">
                <div className="h-full w-full flex items-center justify-center">
                    <img src="/logo-viralstan.svg" alt="Viralstan" className="h-10 animate-fade-in" onError={(e) => {
                        (e.target as any).style.display = 'none';
                        (e.target as any).nextElementSibling.style.display = 'block';
                    }} />
                    <span className="text-white text-3xl font-black hidden">VS</span>
                </div>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Admin Login</h1>
            <p className="text-slate-500 font-medium text-center">Sign in to your Viralstan CRM & Admin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <Input 
                  type="email" 
                  placeholder="admin@viralstan.com" 
                  className="h-14 pl-12 rounded-2xl bg-white/50 border-slate-200 focus:ring-primary/20 focus:border-primary transition-all text-base"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <Input 
                  type="password" 
                  placeholder="Password" 
                  className="h-14 pl-12 rounded-2xl bg-white/50 border-slate-200 focus:ring-primary/20 focus:border-primary transition-all text-base"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button 
                type="button" 
                onClick={() => navigate('/forgot-password')}
                className="text-sm font-bold text-primary hover:underline underline-offset-4"
              >
                Forgot password?
              </button>
            </div>

            <Button 
                type="submit" 
                className="w-full h-14 gradient-primary rounded-2xl text-lg font-black tracking-wide text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-70 group overflow-hidden relative"
                disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                </div>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">© 2026 Viralstan | All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
