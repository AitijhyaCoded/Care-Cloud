import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Key, Copy, LogOut, Edit, Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';

const ProfilePage = () => {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(currentUser?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  
  const joinDate = currentUser?.metadata.creationTime 
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
    : 'Unknown';
  
  const copyToClipboard = (text: string, itemName: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success(`${itemName} copied to clipboard`);
      })
      .catch((error) => {
        console.error('Error copying text: ', error);
        toast.error('Failed to copy to clipboard');
      });
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  const handleUpdateProfile = async () => {
    if (!newDisplayName.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }
    
    setIsUpdating(true);
    try {
      await updateUserProfile(newDisplayName);
      setIsEditDialogOpen(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <MainLayout pageTitle="Profile">
      <div className="max-w-3xl mx-auto py-8">
        <Card className="shadow-md">
          <CardHeader className="pb-0 text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={currentUser?.photoURL || ''} alt={currentUser?.displayName || 'User'} />
                <AvatarFallback className="text-xl bg-accent">
                  {currentUser?.displayName ? getInitials(currentUser.displayName) : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl font-bold">
              {currentUser?.displayName || 'User'}
            </CardTitle>
            <CardDescription>Member since {joinDate}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-accent/20 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Key className="h-5 w-5 text-care-dark" />
                    <h3 className="font-medium">User ID</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {currentUser?.uid || 'Not available'}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => currentUser?.uid && copyToClipboard(currentUser.uid, 'User ID')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-care-lightest p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-5 w-5 text-care-dark" />
                    <h3 className="font-medium">Email</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {currentUser?.email || 'Not available'}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => currentUser?.email && copyToClipboard(currentUser.email, 'Email')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary/50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <User className="h-5 w-5 text-care-dark" />
                <h3 className="font-medium">Display Name</h3>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {currentUser?.displayName || 'Not set'}
                </p>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>
                        Update your display name below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={newDisplayName}
                          onChange={(e) => setNewDisplayName(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button variant="outline" className="w-full sm:w-auto" onClick={toggleTheme}>
              <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 mr-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              Toggle Theme
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;