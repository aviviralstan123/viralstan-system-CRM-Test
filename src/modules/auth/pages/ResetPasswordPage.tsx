import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import * as authService from "@/services/authService";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link. No token found.");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword({ token, password });
      setSuccess(true);
      toast.success("Password reset successful!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid or expired link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-white to-rose-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 animate-fade-in relative overflow-hidden">
        <div className="w-full max-w-[480px] z-10 text-center">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[40px] shadow-2xl p-12 border border-white/40 dark:border-slate-800/50">
                <div className="flex flex-col items-center">
                    <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Password reset!</h1>
                    <p className="text-slate-500 font-medium mb-8">
                        Your password has been reset successfully. You can now login with your new password.
                    </p>
                    <Button 
                        onClick={() => navigate('/login')}
                        className="w-full h-14 gradient-primary rounded-2xl text-lg font-black text-white shadow-xl transition-all"
                    >
                        Sign In Now
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
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Set New Password</h1>
            <p className="text-slate-500 font-medium">Please enter your new secure password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <Input 
                  type="password" 
                  placeholder="New Password" 
                  className="h-14 pl-12 rounded-2xl bg-white/50 border-slate-200 focus:ring-primary/20 focus:border-primary transition-all text-base"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <Input 
                  type="password" 
                  placeholder="Confirm New Password" 
                  className="h-14 pl-12 rounded-2xl bg-white/50 border-slate-200 focus:ring-primary/20 focus:border-primary transition-all text-base"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
                type="submit" 
                className="w-full h-14 gradient-primary rounded-2xl text-lg font-black text-white shadow-xl shadow-primary/20 hover:shadow-2xl transition-all duration-300 disabled:opacity-70"
                disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Updating...</span>
                </div>
              ) : (
                <span>Change Password</span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
