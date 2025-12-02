import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  CreditCard, 
  Trash2,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Settings = () => {
  const { toast } = useToast();
  
  // Active Tab
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile
  const [profile, setProfile] = useState({
    fullName: "Sofia D",
    username: "sofia_d",
    email: "sofia@example.com",
    bio: "Social media manager and content strategist",
    language: "en",
  });
  const [isProfileChanged, setIsProfileChanged] = useState(false);
  
  // Security
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const backupCodes = [
    "ABCD-1234-EFGH",
    "IJKL-5678-MNOP",
    "QRST-9012-UVWX",
    "YZAB-3456-CDEF",
    "GHIJ-7890-KLMN",
    "OPQR-1234-STUV",
    "WXYZ-5678-ABCD",
    "EFGH-9012-IJKL",
    "MNOP-3456-QRST",
    "UVWX-7890-YZAB"
  ];
  
  // Delete Account
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleProfileChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
    setIsProfileChanged(true);
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully",
    });
    setIsProfileChanged(false);
  };

  const getPasswordStrength = (password: string): { strength: string; color: string; percent: number } => {
    if (password.length === 0) return { strength: "", color: "", percent: 0 };
    if (password.length < 8) return { strength: "Weak", color: "hsl(var(--destructive))", percent: 33 };
    if (password.length < 12) return { strength: "Medium", color: "hsl(45 93% 47%)", percent: 66 };
    return { strength: "Strong", color: "hsl(142 76% 36%)", percent: 100 };
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password updated",
      description: "You will be logged out shortly",
    });
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(true);
    setShow2FADialog(false);
    toast({
      title: "2FA Enabled",
      description: "Two-factor authentication is now active",
    });
  };

  const handleDisable2FA = () => {
    setTwoFactorEnabled(false);
    toast({
      title: "2FA Disabled",
      description: "Two-factor authentication has been turned off",
      variant: "destructive",
    });
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    toast({
      title: "Copied!",
      description: "Backup codes copied to clipboard",
    });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText === "DELETE") {
      toast({
        title: "Account Deleted",
        description: "Your account and all data have been permanently deleted",
        variant: "destructive",
      });
      setShowDeleteDialog(false);
    }
  };

  const passwordStrength = getPasswordStrength(passwords.new);

  return (
    <div className="flex min-h-screen bg-background w-full">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <SettingsIcon className="h-8 w-8 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account preferences and integrations
            </p>
          </div>

          {/* Tabbed Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="border-border shadow-sm">
                <CardHeader className="border-b border-primary/20 bg-primary/5">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => handleProfileChange("fullName", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profile.username}
                      onChange={(e) => handleProfileChange("username", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileChange("email", e.target.value)}
                        className="rounded-lg flex-1"
                      />
                      <div className="flex items-center gap-1 text-xs text-muted-foreground px-3 py-2 bg-muted rounded-lg shrink-0">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        Verified
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleProfileChange("bio", e.target.value)}
                      className="rounded-lg resize-none"
                      rows={2}
                      placeholder="Social media manager and content strategist"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={profile.language} 
                      onValueChange={(value) => handleProfileChange("language", value)}
                    >
                      <SelectTrigger id="language" className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ru">Русский</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleSaveProfile} 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!isProfileChanged}
                  >
                    Save Changes
                  </Button>

                  <div className="pt-4 text-center">
                    <Button
                      variant="link"
                      className="text-destructive"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="border-border shadow-sm">
                <CardHeader className="border-b border-primary/20 bg-primary/5">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Protect your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Change Password */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Change Password</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwords.current}
                          onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          className="rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        className="rounded-lg"
                      />
                      {passwords.new && (
                        <div className="space-y-1">
                          <Progress 
                            value={passwordStrength.percent} 
                            className="h-1.5"
                            style={{ 
                              backgroundColor: 'hsl(var(--muted))',
                            }}
                          />
                          <p className="text-xs" style={{ color: passwordStrength.color }}>
                            {passwordStrength.strength}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        className="rounded-lg"
                      />
                    </div>

                    <Button 
                      onClick={handleChangePassword}
                      variant="outline"
                      className="w-full"
                      disabled={!passwords.current || !passwords.new || !passwords.confirm}
                    >
                      Change Password
                    </Button>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Two-Factor Authentication */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">Two-Factor Authentication (2FA)</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Add extra security with an authenticator app
                        </p>
                      </div>
                      <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setShow2FADialog(true);
                          } else {
                            handleDisable2FA();
                          }
                        }}
                      />
                    </div>

                    {twoFactorEnabled && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowBackupCodes(true)}
                      >
                        View Backup Codes
                      </Button>
                    )}

                    <p className="text-xs text-muted-foreground">
                      2FA adds extra security. Use an app like Google Authenticator or Authy.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card className="border-border shadow-sm">
                <CardHeader className="border-b border-primary/20 bg-primary/5">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Plan & Usage
                  </CardTitle>
                  <CardDescription>
                    Manage your subscription
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* Plan Card */}
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div>
                      <p className="font-semibold text-lg">Pro Plan</p>
                      <p className="text-sm text-muted-foreground">$49/month</p>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90">
                      Manage Plan
                    </Button>
                  </div>

                  {/* Usage Metrics */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Usage Metrics</h3>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="space-y-2 cursor-help">
                            <div className="flex justify-between text-sm">
                              <span>API Calls</span>
                              <span className="font-semibold">1,247 / 5,000</span>
                            </div>
                            <Progress value={(1247 / 5000) * 100} className="h-2" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Resets monthly</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="space-y-2 cursor-help">
                            <div className="flex justify-between text-sm">
                              <span>Storage Used</span>
                              <span className="font-semibold">2.4 GB / 10 GB</span>
                            </div>
                            <Progress value={(2.4 / 10) * 100} className="h-2" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Includes videos, thumbnails, and exports</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="space-y-2 cursor-help">
                            <div className="flex justify-between text-sm">
                              <span>AI Generations</span>
                              <span className="font-semibold">28 / 50</span>
                            </div>
                            <Progress value={(28 / 50) * 100} className="h-2" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Scripts, captions, and hooks generated</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Billing Details */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Billing Details</h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date</span>
                        <span className="font-medium">Nov 05, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Payment</span>
                        <span className="font-medium">$49 on Oct 15, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Billing Cycle</span>
                        <span className="font-medium">Monthly</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Upcoming Bill</span>
                        <span className="font-medium">No upcoming bills</span>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-3">
                        Ready to come back? Reactivate on Package Page
                      </p>
                      <Button variant="outline" className="w-full">
                        Go to Packages
                      </Button>
                    </div>
                  </div>

                  {/* Footer Links */}
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground justify-center pt-4">
                    <button className="hover:text-primary transition-colors">Terms of Use</button>
                    <span>•</span>
                    <button className="hover:text-primary transition-colors">Refund Policy</button>
                    <span>•</span>
                    <button className="hover:text-primary transition-colors">Cancellation Policy</button>
                    <span>•</span>
                    <button className="hover:text-primary transition-colors">Privacy Policy</button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* 2FA Enable Dialog */}
      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Scan the QR code with your authenticator app
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center p-6 bg-muted rounded-lg">
              <div className="w-48 h-48 bg-background border-2 border-border rounded-lg flex items-center justify-center">
                <p className="text-xs text-muted-foreground text-center">QR Code<br/>Placeholder</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="2fa-code">Enter code from app</Label>
              <Input
                id="2fa-code"
                placeholder="000000"
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
            <Button onClick={handleEnable2FA} className="w-full bg-primary hover:bg-primary/90">
              Verify and Enable
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Backup Codes Dialog */}
      <Dialog open={showBackupCodes} onOpenChange={setShowBackupCodes}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Backup Codes</DialogTitle>
            <DialogDescription>
              Save these codes in a secure place. Each can be used once.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg font-mono text-sm">
              {backupCodes.map((code, i) => (
                <div key={i} className="p-2 bg-background rounded text-center">
                  {code}
                </div>
              ))}
            </div>
            <Button onClick={handleCopyBackupCodes} className="w-full" variant="outline">
              Copy All Codes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete your account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your data, projects, and API keys. No recovery is possible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="delete-confirm">Type DELETE to confirm</Label>
            <Input
              id="delete-confirm"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="mt-2"
              placeholder="DELETE"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "DELETE"}
              className="bg-destructive hover:bg-destructive/90 disabled:opacity-50"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
