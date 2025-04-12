
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { useAgentProfile } from "@/hooks/useAgentProfile";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, MapPin, Phone, Mail, Pencil, Save, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

const AgentProfilePage = () => {
  const { profile, loading, updateProfile } = useAgentProfile();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });
  
  // Set form data when profile loads
  if (profile && formData.name === "" && !isEditing) {
    setFormData({
      name: profile.name || "",
      phone: profile.phone || "",
      address: profile.address || ""
    });
  }
  
  const handleEdit = () => {
    setFormData({
      name: profile?.name || "",
      phone: profile?.phone || "",
      address: profile?.address || ""
    });
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = async () => {
    const success = await updateProfile({
      name: formData.name,
      phone: formData.phone || null,
      address: formData.address || null
    });
    
    if (success) {
      setIsEditing(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Agent Profile</h1>
        
        <Card>
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your agent profile details</CardDescription>
            </div>
            {!isEditing && !loading && (
              <Button onClick={handleEdit} variant="outline" className="mt-4 md:mt-0">
                <Pencil className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[300px]" />
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[270px]" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={undefined} alt={profile?.name || "Agent"} />
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {profile?.name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    {isEditing ? (
                      <div className="w-full max-w-sm">
                        <label htmlFor="name" className="text-sm font-medium mb-1 block">Name</label>
                        <Input 
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          className="mb-4"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold flex items-center">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          {profile?.name || "Unnamed Agent"}
                        </h3>
                        <p className="text-muted-foreground flex items-center mt-1">
                          <Mail className="mr-2 h-4 w-4" />
                          {profile?.email || user?.email || "No email"}
                        </p>
                        <div className="mt-1">
                          <Badge variant={profile?.status === "active" ? "default" : "secondary"}>
                            {profile?.status || "Unknown status"}
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label htmlFor="address" className="text-sm font-medium mb-1 block">Address</label>
                        <Input 
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Your address"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="text-sm font-medium mb-1 block">Phone</label>
                        <Input 
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your phone number"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start">
                        <MapPin className="mr-2 h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Address</p>
                          <p className="text-muted-foreground">
                            {profile?.address || "No address provided"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone className="mr-2 h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Phone</p>
                          <p className="text-muted-foreground">
                            {profile?.phone || "No phone number provided"}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">
                    Commission rate: {profile?.commission_rate}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Joined: {profile?.joined_at ? new Date(profile.joined_at).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
              </>
            )}
          </CardContent>
          
          {isEditing && (
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </PageLayout>
  );
};

export default AgentProfilePage;
