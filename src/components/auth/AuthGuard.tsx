import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  inactivityTimeout?: number; // in minutes
  showInactivityWarning?: boolean;
}

export default function AuthGuard({ 
  children, 
  inactivityTimeout = 30,
  showInactivityWarning = true 
}: AuthGuardProps) {
  const { user, signOut } = useAuth();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Activity tracking
  useEffect(() => {
    if (!user) return;

    const updateActivity = () => {
      setLastActivity(Date.now());
      setShowWarning(false);
    };

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [user]);

  // Inactivity timer
  useEffect(() => {
    if (!user || !showInactivityWarning) return;

    const checkInactivity = () => {
      const timeSinceLastActivity = Date.now() - lastActivity;
      const timeoutMs = inactivityTimeout * 60 * 1000;
      const warningMs = timeoutMs - (5 * 60 * 1000); // Show warning 5 minutes before logout

      if (timeSinceLastActivity >= timeoutMs) {
        // Auto logout
        signOut();
        return;
      }

      if (timeSinceLastActivity >= warningMs && !showWarning) {
        setShowWarning(true);
        setTimeLeft(Math.ceil((timeoutMs - timeSinceLastActivity) / 1000));
      }
    };

    const interval = setInterval(checkInactivity, 1000);
    return () => clearInterval(interval);
  }, [user, lastActivity, inactivityTimeout, showInactivityWarning, signOut, showWarning]);

  // Warning countdown
  useEffect(() => {
    if (!showWarning || timeLeft <= 0) return;

    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          signOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [showWarning, timeLeft, signOut]);

  const extendSession = () => {
    setLastActivity(Date.now());
    setShowWarning(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {children}
      
      {/* Inactivity Warning Modal */}
      {showWarning && user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <CardTitle className="text-xl font-semibold">Session Timeout Warning</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                You've been inactive for a while. Your session will expire in:
              </p>
              <div className="text-3xl font-bold text-red-500">
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-muted-foreground">
                Click "Stay Logged In" to extend your session.
              </p>
              <div className="flex space-x-3">
                <Button 
                  onClick={extendSession}
                  className="flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Stay Logged In
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => signOut()}
                  className="flex-1"
                >
                  Logout Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
