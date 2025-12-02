import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { User, ChevronDown, ChevronUp, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  name: string;
  tone: string;
  audience: string;
  topics: string;
  videoStyle: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Sofiia D",
    tone: "Professional yet conversational, motivational, direct",
    audience: "Content creators, marketers, entrepreneurs aged 25-40",
    topics: "Social media marketing, content strategy, viral growth, creator economy",
    videoStyle: "Fast-paced editing with text overlays, energetic transitions, hook-driven structure",
  });
  const [openSections, setOpenSections] = useState({
    basic: true,
    tone: true,
    audience: true,
    content: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSave = () => {
    toast({
      title: "Profile saved",
      description: "Your profile settings have been updated successfully",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <User className="h-8 w-8 text-primary" />
              Your Profile
            </h1>
            <p className="text-lg text-muted-foreground">
              Customize your profile to personalize all AI-generated content
            </p>
          </div>

          {/* Basic Info */}
          <Collapsible open={openSections.basic} onOpenChange={() => toggleSection("basic")}>
            <Card className="border-border shadow-card">
              <CardHeader>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer">
                    <CardTitle className="text-xl">Basic Information</CardTitle>
                    {openSections.basic ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      placeholder="Your name"
                    />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Tone & Style */}
          <Collapsible open={openSections.tone} onOpenChange={() => toggleSection("tone")}>
            <Card className="border-border shadow-card">
              <CardHeader>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer">
                    <CardTitle className="text-xl">Tone & Communication Style</CardTitle>
                    {openSections.tone ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tone">Your Preferred Tone</Label>
                    <Textarea
                      id="tone"
                      value={profileData.tone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, tone: e.target.value })
                      }
                      placeholder="E.g., Professional yet conversational, motivational, direct"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Describe how you want to communicate with your audience
                    </p>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Target Audience */}
          <Collapsible open={openSections.audience} onOpenChange={() => toggleSection("audience")}>
            <Card className="border-border shadow-card">
              <CardHeader>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer">
                    <CardTitle className="text-xl">Target Audience</CardTitle>
                    {openSections.audience ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="audience">Who is Your Target Audience?</Label>
                    <Textarea
                      id="audience"
                      value={profileData.audience}
                      onChange={(e) =>
                        setProfileData({ ...profileData, audience: e.target.value })
                      }
                      placeholder="E.g., Content creators, marketers, entrepreneurs aged 25-40"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Define who you're creating content for
                    </p>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Content Preferences */}
          <Collapsible open={openSections.content} onOpenChange={() => toggleSection("content")}>
            <Card className="border-border shadow-card">
              <CardHeader>
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer">
                    <CardTitle className="text-xl">Content Preferences</CardTitle>
                    {openSections.content ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topics">Main Topics & Themes</Label>
                    <Textarea
                      id="topics"
                      value={profileData.topics}
                      onChange={(e) =>
                        setProfileData({ ...profileData, topics: e.target.value })
                      }
                      placeholder="E.g., Social media marketing, content strategy, viral growth"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoStyle">Video Style & Format</Label>
                    <Textarea
                      id="videoStyle"
                      value={profileData.videoStyle}
                      onChange={(e) =>
                        setProfileData({ ...profileData, videoStyle: e.target.value })
                      }
                      placeholder="E.g., Fast-paced editing with text overlays, energetic transitions"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Describe your preferred video editing and presentation style
                    </p>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Sticky Save Button */}
          <div className="sticky bottom-8 flex justify-center">
            <Button
              size="lg"
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 shadow-lg"
            >
              <Save className="h-5 w-5 mr-2" />
              Save Profile
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
