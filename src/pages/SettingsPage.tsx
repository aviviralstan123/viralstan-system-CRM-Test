import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: "Admin User", email: "admin@viralstan.com" });
  const [agency, setAgency] = useState({ name: "Viralstan", website: "https://viralstan.com", address: "123 Marketing Blvd, Digital City" });

  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="Settings" description="Viralstan Admin · Saturday, 28 March 2026" />

      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-base font-semibold">Profile</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
            </div>
          </div>
          <Button className="gradient-primary text-primary-foreground border-0" onClick={() => toast.success("Profile saved")}>Save Changes</Button>
        </div>

        <Separator />

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-base font-semibold">Agency Details</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Agency Name</Label>
              <Input value={agency.name} onChange={e => setAgency({ ...agency, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input value={agency.website} onChange={e => setAgency({ ...agency, website: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Address</Label>
              <Input value={agency.address} onChange={e => setAgency({ ...agency, address: e.target.value })} />
            </div>
          </div>
          <Button className="gradient-primary text-primary-foreground border-0" onClick={() => toast.success("Agency details updated")}>Update</Button>
        </div>

        <Separator />

        <div className="rounded-xl border border-destructive/30 bg-card p-6 space-y-4">
          <h3 className="text-base font-semibold text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back.</p>
          <Button variant="destructive" onClick={() => toast.error("Account deletion is disabled in demo mode")}>Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
