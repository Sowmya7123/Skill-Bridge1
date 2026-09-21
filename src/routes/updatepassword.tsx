import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/update-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — SkillBridge" },
      { name: "description", content: "Set a new password for your SkillBridge account." },
    ],
  }),
  component: UpdatePassword,
});

function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Weak Password", { description: "Password must be at least 8 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords Do Not Match", { description: "Please make sure both passwords match." });
      return;
    }

    setIsSubmitting(true);
    try {
      // Supabase user session lo unna token dwara password update chestundi
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error("Update Failed", { description: error.message });
      } else {
        toast.success("Password Updated Successfully! 🎉", {
          description: "You can now sign in with your new password.",
        });
        navigate({ to: "/" });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred.";
      toast.error("Error", { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 font-sans text-[#0F172A]">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] shadow-xl rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex size-10 items-center justify-center rounded-xl bg-[#2563EB] text-white font-bold text-base shadow-md mx-auto">
            SB
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#0F172A]">Set New Password</h1>
          <p className="text-xs text-[#64748B]">Please enter a secure new password for your SkillBridge account.</p>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="new-pwd" className="text-xs font-semibold text-[#0F172A]">
              New Password (Min. 8 characters) <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#64748B]" />
              <Input
                id="new-pwd"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 h-10 text-xs border-[#E2E8F0] bg-white rounded-xl focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="confirm-pwd" className="text-xs font-semibold text-[#0F172A]">
              Confirm New Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#64748B]" />
              <Input
                id="confirm-pwd"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9 h-10 text-xs border-[#E2E8F0] bg-white rounded-xl focus:border-[#2563EB]"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 text-xs font-bold transition rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              <>
                Update Password & Sign In
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}