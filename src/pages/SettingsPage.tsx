import { PageHeader } from "@/components/ui/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="animate-fade-in max-w-2xl">
      <PageHeader title="Settings" description="Manage your account and preferences" />

      <div className="space-y-6">
        {/* Profile */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-base font-semibold">Profile</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue="Admin User" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue="admin@viralstan.com" />
            </div>
          </div>
          <Button className="gradient-primary text-primary-foreground border-0">Save Changes</Button>
        </div>

        <Separator />

        {/* Agency */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-base font-semibold">Agency Details</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Agency Name</Label>
              <Input defaultValue="Viralstan" />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input defaultValue="https://viralstan.com" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Address</Label>
              <Input defaultValue="123 Marketing Blvd, Digital City" />
            </div>
          </div>
          <Button className="gradient-primary text-primary-foreground border-0">Update</Button>
        </div>

        <Separator />

        {/* Danger Zone */}
        <div className="rounded-xl border border-destructive/30 bg-card p-6 space-y-4">
          <h3 className="text-base font-semibold text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back.</p>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
