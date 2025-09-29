'use client';

import React, { useState } from 'react';
import { useSettings } from '@/lib/contexts/SettingsContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Shield, 
  AlertCircle,
  RefreshCw,
  Check
} from 'lucide-react';

type UserRole = 'admin' | 'manager' | 'recruiter' | 'interviewer' | 'viewer';

interface UserInviteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const availableRoles: { value: UserRole; label: string; description: string; permissions: string[] }[] = [
  {
    value: 'admin',
    label: 'Administrator',
    description: 'Full access to all features and settings',
    permissions: ['manage_users', 'manage_settings', 'manage_integrations', 'view_analytics', 'manage_jobs']
  },
  {
    value: 'manager',
    label: 'Manager',
    description: 'Can manage jobs and view team analytics',
    permissions: ['manage_jobs', 'view_analytics', 'manage_candidates']
  },
  {
    value: 'recruiter',
    label: 'Recruiter',
    description: 'Can create jobs and manage candidates',
    permissions: ['manage_jobs', 'manage_candidates', 'view_candidates']
  },
  {
    value: 'interviewer',
    label: 'Interviewer',
    description: 'Can conduct interviews and provide feedback',
    permissions: ['view_candidates', 'manage_interviews', 'provide_feedback']
  },
  {
    value: 'viewer',
    label: 'Viewer',
    description: 'Read-only access to jobs and candidates',
    permissions: ['view_jobs', 'view_candidates']
  }
];

const departments = [
  'Human Resources',
  'Engineering',
  'Sales',
  'Marketing',
  'Finance',
  'Operations',
  'Product',
  'Design',
  'Legal',
  'Executive'
];

export function UserInviteModal({ open, onOpenChange }: UserInviteModalProps) {
  const { inviteUser } = useSettings();
  const [step, setStep] = useState(1);
  const [inviteData, setInviteData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: '' as UserRole,
    department: '',
    title: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!inviteData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(inviteData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!inviteData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!inviteData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!inviteData.role) {
      newErrors.role = 'Please select a role';
    }

    if (!inviteData.department) {
      newErrors.department = 'Please select a department';
    }

    if (!inviteData.title.trim()) {
      newErrors.title = 'Job title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);
    try {
      await inviteUser({
        email: inviteData.email,
        firstName: inviteData.firstName,
        lastName: inviteData.lastName,
        role: inviteData.role,
        department: inviteData.department,
        title: inviteData.title,
        status: 'pending'
      });
      
      setInviteData({
        email: '',
        firstName: '',
        lastName: '',
        role: '' as UserRole,
        department: '',
        title: '',
        message: ''
      });
      setStep(1);
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      setErrors({ submit: 'Failed to send invitation. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedRole = availableRoles.find(role => role.value === inviteData.role);

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={inviteData.email}
          onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="john.doe@company.com"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.email}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={inviteData.firstName}
            onChange={(e) => setInviteData(prev => ({ ...prev, firstName: e.target.value }))}
            placeholder="John"
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.firstName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={inviteData.lastName}
            onChange={(e) => setInviteData(prev => ({ ...prev, lastName: e.target.value }))}
            placeholder="Doe"
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.lastName}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <Select value={inviteData.role} onValueChange={(value: UserRole) => setInviteData(prev => ({ ...prev, role: value }))}>
          <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                <div>
                  <div className="font-medium">{role.label}</div>
                  <div className="text-xs text-gray-500">{role.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.role}
          </p>
        )}
      </div>

      {selectedRole && (
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-900">Role Permissions</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {selectedRole.permissions.map((permission) => (
              <Badge key={permission} variant="secondary" className="text-xs">
                {permission.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Select value={inviteData.department} onValueChange={(value) => setInviteData(prev => ({ ...prev, department: value }))}>
            <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.department && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.department}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Job Title *</Label>
          <Input
            id="title"
            value={inviteData.title}
            onChange={(e) => setInviteData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Senior Software Engineer"
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.title}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-3">Invitation Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span>{inviteData.firstName} {inviteData.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span>{inviteData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Role:</span>
            <Badge variant="outline">{selectedRole?.label}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Department:</span>
            <span>{inviteData.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Title:</span>
            <span>{inviteData.title}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Personal Message (Optional)</Label>
        <Textarea
          id="message"
          value={inviteData.message}
          onChange={(e) => setInviteData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Add a personal message to the invitation email..."
          rows={4}
        />
      </div>

      {errors.submit && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {errors.submit}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            Invite User - Step {step} of 3
          </DialogTitle>
          <DialogDescription>
            {step === 1 && 'Enter the basic information for the new user'}
            {step === 2 && 'Assign role and department for the user'}
            {step === 3 && 'Review the invitation details before sending'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center space-x-2 py-4">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNum === step 
                  ? 'bg-blue-600 text-white' 
                  : stepNum < step 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {stepNum < step ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-12 h-0.5 mx-2 ${stepNum < step ? 'bg-green-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <Separator />

        <div className="py-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            
            {step < 3 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
