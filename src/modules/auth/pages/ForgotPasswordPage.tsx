import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import * as authService from "@/services/authService";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success("Reset link sent!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-white to-rose-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 animate-fade-in relative overflow-hidden">
        <div className="w-full max-w-[480px] z-10 text-center">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[40px] shadow-2xl p-12 border border-white/40 dark:border-slate-800/50">
                <div className="flex flex-col items-center">
                    <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Check your email</h1>
                    <p className="text-slate-500 font-medium mb-8">
                        We've sent a password reset link to <b>{email}</b>. Please check your inbox.
                    </p>
                    <Button 
                        onClick={() => navigate('/login')}
                        className="w-full h-14 gradient-primary rounded-2xl text-lg font-black text-white shadow-xl transition-all"
                    >
                        Back to Login
                    </Button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-white to-rose-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 animate-fade-in relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-[480px] z-10">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[40px] shadow-2xl p-8 md:p-12 border border-white/40 dark:border-slate-800/50">
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Login</span>
          </button>
          
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Forgot Password?</h1>
            <p className="text-slate-500 font-medium">Enter your email and we'll send you a reset link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="h-14 pl-12 rounded-2xl bg-white/50 border-slate-200 focus:ring-primary/20 focus:border-primary transition-all text-base"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <Button 
                type="submit" 
                className="w-full h-14 gradient-primary rounded-2xl text-lg font-black text-white shadow-xl shadow-primary/20 hover:shadow-2xl transition-all duration-300 disabled:opacity-70"
                disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Sending Link...</span>
                </div>
              ) : (
                <span>Reset Password</span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
