import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import * as userService from "@/services/userService";
import { User as UserType } from "@/services/userService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  User, Lock, Palette, Globe, Users, Bell, 
  Settings2, Link2, AlertTriangle, Upload, Trash2, ShieldCheck,
  Mail, Phone, Camera, CheckCircle2, XCircle, Plus, Loader2
} from "lucide-react";

export default function SettingsPage() {
  // --- State for various sections ---
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@viralstan.com",
    phone: "+91 98765 43210",
    image: null as string | null
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactor: true,
    lastChanged: "March 15, 2024"
  });

  const [branding, setBranding] = useState({
    primaryColor: "#F43F5E",
    secondaryColor: "#3B82F6",
    logo: null as string | null,
    favicon: null as string | null
  });

  const [seo, setSeo] = useState({
    metaTitle: "Viralstan | Premium Agency Solutions",
    metaDescription: "The most advanced CMS and CRM for modern digital agencies.",
    ogImage: null as string | null,
    gaId: "UA-12345678-1"
  });

  const [notifications, setNotifications] = useState({
    newLead: true,
    payment: true,
    blogPublish: false,
    invoiceAlert: true
  });

  const [preferences, setPreferences] = useState({
    timezone: "UTC+5:30 (Mumbai)",
    currency: "USD ($)",
    dateFormat: "DD/MM/YYYY"
  });

  const [deleteConfirm, setDeleteConfirm] = useState("");

  // --- Refs for file uploads ---
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const ogImageInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  // --- Users & Roles State ---
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "viewer" });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await userService.getAllUsers();
      setUsers(res.data || []);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      // Map frontend roles to backend roles
      const backendRole = newUser.role.toLowerCase().replace(" ", "");
      await userService.createUser({ 
        name: newUser.name, 
        email: newUser.email, 
        role: backendRole === "superadmin" ? "admin" : backendRole 
      });
      fetchUsers();
      setNewUser({ name: "", email: "", role: "viewer" });
      setIsUserModalOpen(false);
      toast.success("User added successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add user");
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Remove this user?")) return;
    try {
      await userService.deleteUser(id);
      toast.success("User removed successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to remove user");
    }
  };

  // --- File Upload Logic ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon' | 'ogImage' | 'profile') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate upload and create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === 'logo') setBranding({ ...branding, logo: result });
      if (type === 'favicon') setBranding({ ...branding, favicon: result });
      if (type === 'ogImage') setSeo({ ...seo, ogImage: result });
      if (type === 'profile') setProfile({ ...profile, image: result });
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <PageHeader 
        title="Settings" 
        description="Global system configuration and personal account preferences." 
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <div className="flex overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
          <TabsList className="bg-muted/50 p-1 rounded-2xl border border-border/50 h-auto">
            <TabsTrigger value="profile" className="rounded-xl px-4 py-2.5 data-[state=active]:gradient-primary data-[state=active]:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
              <User className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="rounded-xl px-4 py-2.5 data-[state=active]:gradient-primary data-[state=active]:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
              <Lock className="h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="branding" className="rounded-xl px-4 py-2.5 data-[state=active]:gradient-primary data-[state=active]:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
              <Palette className="h-4 w-4" /> Branding
            </TabsTrigger>
            <TabsTrigger value="seo" className="rounded-xl px-4 py-2.5 data-[state=active]:gradient-primary data-[state=active]:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
              <Globe className="h-4 w-4" /> SEO & Web
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-xl px-4 py-2.5 data-[state=active]:gradient-primary data-[state=active]:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl px-4 py-2.5 data-[state=active]:gradient-primary data-[state=active]:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
              <Bell className="h-4 w-4" /> Alerts
            </TabsTrigger>
            <TabsTrigger value="preferences" className="rounded-xl px-4 py-2.5 data-[state=active]:gradient-primary data-[state=active]:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
              <Settings2 className="h-4 w-4" /> System
            </TabsTrigger>
            <TabsTrigger value="integrations" className="rounded-xl px-4 py-2.5 data-[state=active]:gradient-primary data-[state=active]:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
              <Link2 className="h-4 w-4" /> Connect
            </TabsTrigger>
            <TabsTrigger value="danger" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-destructive data-[state=active]:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-destructive">
              <AlertTriangle className="h-4 w-4" /> Danger
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 1. PROFILE */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black">Personal Information</CardTitle>
              <CardDescription>Update your personal details and public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 pb-4">
                <div className="relative group">
                  <div className="h-24 w-24 rounded-3xl gradient-primary p-1">
                    <div className="h-full w-full rounded-[20px] bg-background flex items-center justify-center overflow-hidden">
                      {profile.image ? (
                        <img src={profile.image} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => profileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg border-2 border-background hover:scale-110 transition-transform"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input 
                    type="file" 
                    ref={profileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e, 'profile')} 
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold">{profile.name}</h4>
                  <p className="text-sm text-muted-foreground">Administrator · Super User</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                  <Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</Label>
                  <Input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Phone Number (Optional)</Label>
                  <Input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="rounded-xl" />
                </div>
              </div>
              <Button className="gradient-primary px-8 rounded-xl font-bold" onClick={() => toast.success("Profile updated")}>
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. SECURITY */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black">Security Settings</CardTitle>
              <CardDescription>Manage your password and account security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Current Password</Label>
                  <Input type="password" placeholder="••••••••" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">New Password</Label>
                  <Input type="password" placeholder="••••••••" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Confirm Password</Label>
                  <Input type="password" placeholder="••••••••" className="rounded-xl" />
                </div>
              </div>
              
              <Separator className="opacity-50" />

              <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold">Two-Factor Authentication (2FA)</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                </div>
                <Switch checked={security.twoFactor} onCheckedChange={(val) => setSecurity({...security, twoFactor: val})} />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                Last password change: {security.lastChanged}
              </div>

              <Button className="gradient-primary px-8 rounded-xl font-bold">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. BRANDING */}
        <TabsContent value="branding" className="space-y-6">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black">Branding & Identity</CardTitle>
              <CardDescription>Customize the look and feel of your admin panel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Company Logo</Label>
                  <div 
                    onClick={() => logoInputRef.current?.click()}
                    className="border-2 border-dashed border-primary/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group relative overflow-hidden"
                  >
                    {branding.logo ? (
                      <img src={branding.logo} alt="Logo Preview" className="max-h-20 w-auto object-contain relative z-10" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                        <p className="text-sm font-bold">Click to upload logo</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">PNG, SVG or WEBP (Max 2MB)</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={logoInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, 'logo')} 
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Favicon</Label>
                  <div 
                    onClick={() => faviconInputRef.current?.click()}
                    className="border-2 border-dashed border-primary/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group relative overflow-hidden"
                  >
                    {branding.favicon ? (
                      <img src={branding.favicon} alt="Favicon Preview" className="h-12 w-12 object-contain relative z-10" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                        <p className="text-sm font-bold">Click to upload favicon</p>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">ICO or PNG (32x32px)</p>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={faviconInputRef} 
                      className="hidden" 
                      accept="image/x-icon,image/png" 
                      onChange={(e) => handleFileUpload(e, 'favicon')} 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Primary Color</Label>
                  <div className="flex gap-3">
                    <Input type="color" value={branding.primaryColor} onChange={e => setBranding({...branding, primaryColor: e.target.value})} className="w-16 h-10 p-1 rounded-lg border-none" />
                    <Input value={branding.primaryColor} onChange={e => setBranding({...branding, primaryColor: e.target.value})} className="rounded-xl font-mono uppercase" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Secondary Color</Label>
                  <div className="flex gap-3">
                    <Input type="color" value={branding.secondaryColor} onChange={e => setBranding({...branding, secondaryColor: e.target.value})} className="w-16 h-10 p-1 rounded-lg border-none" />
                    <Input value={branding.secondaryColor} onChange={e => setBranding({...branding, secondaryColor: e.target.value})} className="rounded-xl font-mono uppercase" />
                  </div>
                </div>
              </div>

              <Button className="gradient-primary px-8 rounded-xl font-bold" onClick={() => toast.success("Branding updated")}>
                Save Branding
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. SEO & WEBSITE */}
        <TabsContent value="seo" className="space-y-6">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black">SEO & Web Configuration</CardTitle>
              <CardDescription>Default search engine optimization settings for your platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Default Meta Title</Label>
                <Input value={seo.metaTitle} onChange={e => setSeo({...seo, metaTitle: e.target.value})} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Default Meta Description</Label>
                <Textarea value={seo.metaDescription} onChange={e => setSeo({...seo, metaDescription: e.target.value})} className="rounded-xl min-h-[100px]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Google Analytics ID</Label>
                  <Input value={seo.gaId} onChange={e => setSeo({...seo, gaId: e.target.value})} className="rounded-xl font-mono" placeholder="G-XXXXXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Default OG Image</Label>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <Input 
                        value={seo.ogImage ? "Custom Image Uploaded" : "https://admin.viralstan.com/og-default.png"} 
                        disabled 
                        className="rounded-xl w-full bg-muted/30 pr-10" 
                      />
                      {seo.ogImage && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => ogImageInputRef.current?.click()}
                      className="rounded-xl font-bold border-primary/20 hover:bg-primary/5"
                    >
                      {seo.ogImage ? 'Change' : 'Upload'}
                    </Button>
                    <input 
                      type="file" 
                      ref={ogImageInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, 'ogImage')} 
                    />
                  </div>
                </div>
              </div>
              <Button className="gradient-primary px-8 rounded-xl font-bold" onClick={() => toast.success("SEO settings saved")}>
                Update SEO
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. USERS & ROLES */}
        <TabsContent value="users" className="space-y-6">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black">Users & Roles</CardTitle>
                <CardDescription>Manage team access and permissions (RBAC).</CardDescription>
              </div>
              <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary rounded-xl font-bold flex items-center gap-2">
                    <Plus className="h-4 w-4" /> Add New User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-black">Add New User</DialogTitle>
                    <DialogDescription className="font-bold text-muted-foreground">
                      Invite a new team member and assign them a role.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                      <Input 
                        placeholder="e.g. John Doe" 
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        className="rounded-xl border-muted focus-visible:ring-primary/20" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</Label>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="rounded-xl border-muted focus-visible:ring-primary/20" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Assign Role</Label>
                      <Select 
                        value={newUser.role} 
                        onValueChange={(val) => setNewUser({...newUser, role: val})}
                      >
                        <SelectTrigger className="rounded-xl border-muted focus:ring-primary/20">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-xl">
                          <SelectItem value="Super Admin" className="rounded-xl focus:bg-primary/5 focus:text-primary font-bold">Super Admin</SelectItem>
                          <SelectItem value="Admin" className="rounded-xl focus:bg-primary/5 focus:text-primary font-bold">Admin</SelectItem>
                          <SelectItem value="Editor" className="rounded-xl focus:bg-primary/5 focus:text-primary font-bold">Editor</SelectItem>
                          <SelectItem value="Viewer" className="rounded-xl focus:bg-primary/5 focus:text-primary font-bold">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="pt-4">
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsUserModalOpen(false)}
                      className="rounded-xl font-bold"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddUser}
                      className="gradient-primary rounded-xl font-bold px-8"
                    >
                      Create User
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-border/50 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-black uppercase tracking-widest text-[10px] text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left font-black uppercase tracking-widest text-[10px] text-muted-foreground">Email</th>
                      <th className="px-4 py-3 text-left font-black uppercase tracking-widest text-[10px] text-muted-foreground">Role</th>
                      <th className="px-4 py-3 text-right font-black uppercase tracking-widest text-[10px] text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                          Loading users...
                        </td>
                      </tr>
                    ) : users.length > 0 ? (
                      users.map(user => (
                        <tr key={user.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-4 font-bold">{user.name}</td>
                          <td className="px-4 py-4 text-muted-foreground">{user.email}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              user.role === 'admin' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-muted text-muted-foreground'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No users found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. NOTIFICATIONS */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black">Notification Preferences</CardTitle>
              <CardDescription>Configure how you want to be alerted about system events.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1 border border-border/50 rounded-2xl">
                {[
                  { id: 'newLead', title: 'New Lead Alert', desc: 'Notify me when a new potential client contacts us.', state: notifications.newLead },
                  { id: 'payment', title: 'Payment Alert', desc: 'Notify me when an invoice is paid successfully.', state: notifications.payment },
                  { id: 'blogPublish', title: 'Blog Publish Alert', desc: 'Notify me when a new blog post is published.', state: notifications.blogPublish },
                  { id: 'invoiceAlert', title: 'Invoice Overdue Alert', desc: 'Notify me when an invoice becomes overdue.', state: notifications.invoiceAlert },
                ].map((item, idx) => (
                  <div key={item.id} className={`flex items-center justify-between p-4 ${idx !== 3 ? 'border-b border-border/30' : ''}`}>
                    <div className="space-y-0.5">
                      <p className="font-bold">{item.title}</p>
                      <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
                    </div>
                    <Switch 
                      checked={item.state} 
                      onCheckedChange={(val) => setNotifications({...notifications, [item.id]: val})} 
                    />
                  </div>
                ))}
              </div>
              <Button className="gradient-primary px-8 rounded-xl font-bold mt-4" onClick={() => toast.success("Notification settings saved")}>
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 7. PREFERENCES */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black">System Preferences</CardTitle>
              <CardDescription>Localization and regional settings for the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Timezone</Label>
                  <select value={preferences.timezone} onChange={e => setPreferences({...preferences, timezone: e.target.value})} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
                    <option>UTC+5:30 (Mumbai)</option>
                    <option>UTC+0:00 (London)</option>
                    <option>UTC-5:00 (New York)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Default Currency</Label>
                  <select value={preferences.currency} onChange={e => setPreferences({...preferences, currency: e.target.value})} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
                    <option>USD ($)</option>
                    <option>INR (₹)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Date Format</Label>
                  <select value={preferences.dateFormat} onChange={e => setPreferences({...preferences, dateFormat: e.target.value})} className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              <Button className="gradient-primary px-8 rounded-xl font-bold" onClick={() => toast.success("Preferences updated")}>
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 8. INTEGRATIONS */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black">Third-Party Integrations</CardTitle>
              <CardDescription>Connect Viralstan with other tools and platforms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-border/50 bg-background/50 flex items-center justify-between group hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                      <Globe className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Google Analytics</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Tracking & Events</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg h-8 text-[10px] font-black uppercase tracking-wider border-green-200 text-green-600 bg-green-50 hover:bg-green-100">Connected</Button>
                </div>
                <div className="p-4 rounded-2xl border border-border/50 bg-background/50 flex items-center justify-between group hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <Link2 className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Facebook Pixel</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Ads Tracking</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg h-8 text-[10px] font-black uppercase tracking-wider">Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 9. DANGER ZONE */}
        <TabsContent value="danger" className="space-y-6">
          <Card className="border-2 border-destructive/20 shadow-2xl shadow-destructive/5 bg-destructive/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-black text-destructive flex items-center gap-2">
                <AlertTriangle className="h-6 w-6" /> Danger Zone
              </CardTitle>
              <CardDescription className="text-destructive/80 font-bold uppercase tracking-widest text-[10px]">Warning: Irreversible Actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-bold text-destructive/90">
                  Deleting your account will permanently remove all your data, including leads, invoices, and blog posts. This action cannot be undone.
                </p>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-destructive/70">To confirm, type "DELETE" in the box below:</Label>
                  <Input 
                    value={deleteConfirm} 
                    onChange={e => setDeleteConfirm(e.target.value)} 
                    placeholder="DELETE" 
                    className="rounded-xl border-destructive/30 focus-visible:ring-destructive/20 font-black uppercase tracking-widest"
                  />
                </div>
              </div>
              <Button 
                variant="destructive" 
                className="w-full md:w-auto px-8 rounded-xl font-black uppercase tracking-widest py-6 h-auto"
                disabled={deleteConfirm !== "DELETE"}
                onClick={() => toast.error("Account deletion is disabled in demo mode")}
              >
                Permanently Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
