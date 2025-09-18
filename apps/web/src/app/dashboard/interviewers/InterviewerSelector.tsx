'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Eliminado CardFooter, no se usa
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Phone, Globe } from 'lucide-react';

interface Interviewer {
  id: string;
  name: string;
  voice: string;
  description: string;
  prompt: string;
}

const InterviewerSelector = () => {
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [selectedInterviewer, setSelectedInterviewer] = useState<Interviewer | null>(null);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [calling, setCalling] = useState(false);
  const { toast } = useToast();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetchInterviewers = async () => {
      try {
        const response = await fetch('/api/retell?action=predefined');
        if (!response.ok) {
          throw new Error('Failed to fetch interviewers');
        }
        const data = await response.json();
        setInterviewers(data.agents);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load interviewers. Please try again later.',
          variant: 'destructive',
        });
      }
    };
    fetchInterviewers();
  }, [toast]);

  const handleStartWebCall = async () => {
    if (!selectedInterviewer || !user?.id) return;

    setLoading(true);
    setCalling(true);
    try {
      const response = await fetch('/api/retell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: selectedInterviewer.id,
          userId: user.id,
          action: 'start-web-call',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start web call');
      }

      const { callId } = await response.json();
      toast({
        title: 'Call Started',
        description: `Web call with ${selectedInterviewer.name} initiated.`,
      });
      console.log('Web call started with ID:', callId);

      // Aquí podrías agregar lógica para redirigir a la página de la llamada web
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to start web call: ${error instanceof Error ? error.message : String(error)}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setCalling(false);
    }
  };

  const handleStartPhoneCall = async () => {
    if (!selectedInterviewer || !phoneNumber || !user?.id) {
      toast({
        title: 'Validation Error',
        description: 'Please select an interviewer and enter a phone number.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setCalling(true);
    try {
      const response = await fetch('/api/retell', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: selectedInterviewer.id,
          userId: user.id,
          phoneNumber: phoneNumber,
          action: 'start-phone-call',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start phone call');
      }

      const { callId } = await response.json();
      toast({
        title: 'Call Started',
        description: `Phone call with ${selectedInterviewer.name} initiated to ${phoneNumber}.`,
      });
      console.log('Phone call started with ID:', callId);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to start phone call: ${error instanceof Error ? error.message : String(error)}`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setCalling(false);
    }
  };

  if (!isLoaded || loading) {
    return <div className="flex justify-center items-center h-screen text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-black min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-white">Select an Interviewer</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {interviewers.map((interviewer) => (
          <Card
            key={interviewer.id}
            className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${selectedInterviewer?.id === interviewer.id ? 'border-4 border-purple-500 shadow-lg' : 'border-gray-700'}`}
            onClick={() => setSelectedInterviewer(interviewer)}
          >
            <CardHeader>
              <CardTitle className="text-white">{interviewer.name}</CardTitle>
              <CardDescription className="text-gray-400">{interviewer.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300">Voice: {interviewer.voice}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedInterviewer && (
        <Card className="mt-8 w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-white">Start an Interview</CardTitle>
            <CardDescription className="text-gray-400">
              Connect with {selectedInterviewer.name} via web or phone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              onClick={handleStartWebCall}
              disabled={calling}
            >
              <Globe className="h-4 w-4" /> Start Web Call
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor="phone" className="text-gray-300">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="e.g., +1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                onClick={handleStartPhoneCall}
                disabled={calling}
              >
                <Phone className="h-4 w-4" /> Start Phone Call
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InterviewerSelector;