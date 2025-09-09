import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Phone, 
  Lock, 
  User, 
  Building, 
  Shield, 
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react";

// Enhanced validation schemas with security requirements
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

const signUpSchema = z.object({
  fullName: z.string()
    .min(2, "Full name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .optional(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
    .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .regex(/^(?=.*\d)/, "Password must contain at least one number")
    .regex(/^(?=.*[@$!%*?&])/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
  role: z.enum(["customer", "b2b_buyer"]),
  companyName: z.string().optional(),
  gstNumber: z.string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number format")
    .optional(),
  accessCode: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const phoneOtpSchema = z.object({
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

interface FloatingAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

type AuthStep = 'auth' | 'otp' | 'forgot' | 'success' | 'exclusive';

export default function FloatingAuthModal({ isOpen, onClose, defaultTab = 'signin' }: FloatingAuthModalProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    login, 
    register, 
    loginWithGoogle,
    loginWithFacebook,
    loginWithPhone, 
    verifyPhoneOTP, 
    forgotPassword,
    initializeRecaptcha,
    user 
  } = useAuth();

  // State management
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('auth');
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // OTP related
  const [otpValue, setOtpValue] = useState("");
  const [currentPhone, setCurrentPhone] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  
  // Security features
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<Date | null>(null);

  // Form instances
  const signInForm = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  const signUpForm = useForm<{
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword: string;
    role: 'customer' | 'b2b_buyer';
    companyName?: string;
    gstNumber?: string;
    accessCode?: string;
    agreeToTerms: boolean;
  }>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "customer",
      companyName: "",
      gstNumber: "",
      accessCode: "",
      agreeToTerms: false
    }
  });

  const phoneOtpForm = useForm({
    resolver: zodResolver(phoneOtpSchema),
  });

  const forgotPasswordForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Auto-close modal if user is authenticated
  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  // OTP timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Account lockout timer
  useEffect(() => {
    if (lockoutEndTime) {
      const checkLockout = () => {
        if (new Date() > lockoutEndTime) {
          setIsLocked(false);
          setLockoutEndTime(null);
          setLoginAttempts(0);
        }
      };
      
      const interval = setInterval(checkLockout, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutEndTime]);

  // Security: Handle failed login attempts
  const handleFailedLogin = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    
    if (newAttempts >= 5) {
      setIsLocked(true);
      setLockoutEndTime(new Date(Date.now() + 15 * 60 * 1000)); // 15 minutes lockout
      toast({
        variant: "destructive",
        title: "Account Temporarily Locked",
        description: "Too many failed attempts. Please try again in 15 minutes.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: `Invalid credentials. ${5 - newAttempts} attempts remaining.`,
      });
    }
  };

  // Enhanced sign in with security features
  const handleSignIn = async (data: any) => {
    if (isLocked) {
      toast({
        variant: "destructive",
        title: "Account Locked",
        description: "Please wait before trying again.",
      });
      return;
    }

    setLoading(true);
    try {
      await login(data.email, data.password);
      
      // Reset security counters on successful login
      setLoginAttempts(0);
      setIsLocked(false);
      setLockoutEndTime(null);
      
      setAuthStep('success');
      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      });
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      handleFailedLogin();
    } finally {
      setLoading(false);
    }
  };

  // Enhanced sign up with validation
  const handleSignUp = async (data: any) => {
    setLoading(true);
    try {
      await register({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        companyName: data.companyName,
        gstNumber: data.gstNumber,
        accessCode: data.accessCode
      });

      setAuthStep('success');
      toast({
        title: "Account Created Successfully!",
        description: "Please check your email to verify your account.",
      });
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Phone OTP flow
  const handlePhoneOTP = async (data: any) => {
    setLoading(true);
    try {
      const result = await loginWithPhone(data.phone);
      setConfirmationResult(result);
      setCurrentPhone(data.phone);
      setAuthStep('otp');
      setOtpTimer(60); // 60 seconds countdown
      toast({
        title: "OTP Sent!",
        description: "Please check your phone for the verification code.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // OTP verification
  const handleOTPVerification = async () => {
    if (otpValue.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP code.",
      });
      return;
    }

    if (!confirmationResult) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please request a new OTP.",
      });
      return;
    }

    setLoading(true);
    try {
      await verifyPhoneOTP(confirmationResult, otpValue);
      setAuthStep('success');
      toast({
        title: "Phone Verified!",
        description: "Welcome to Handloom Portal!",
      });
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const handleForgotPassword = async (data: any) => {
    setLoading(true);
    try {
      await forgotPassword(data.email);
      toast({
        title: "Reset Link Sent!",
        description: "Please check your email for password reset instructions.",
      });
      setAuthStep('auth');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Social login
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else if (provider === 'facebook') {
        await loginWithFacebook();
      }
      
      setAuthStep('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Login Failed`,
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset all states when modal closes
  const handleClose = () => {
    setAuthStep('auth');
    setCurrentTab(defaultTab);
    setAuthMethod('email');
    setOtpValue("");
    setCurrentPhone("");
    setConfirmationResult(null);
    setOtpTimer(0);
    signInForm.reset();
    signUpForm.reset();
    phoneOtpForm.reset();
    forgotPasswordForm.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            {authStep === 'success' ? 'Welcome!' : 'Handloom Portal'}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Success Step */}
        {authStep === 'success' && (
          <div className="text-center space-y-4 py-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Authentication Successful!</h3>
              <p className="text-sm text-muted-foreground">Redirecting you now...</p>
            </div>
          </div>
        )}

        {/* OTP Verification Step */}
        {authStep === 'otp' && (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <Shield className="mx-auto h-12 w-12 text-amber-600" />
              <h3 className="text-lg font-semibold">Verify Your Phone</h3>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to {currentPhone}
              </p>
              {otpTimer > 0 && (
                <p className="text-xs text-muted-foreground">
                  Code expires in {otpTimer} seconds
                </p>
              )}
            </div>
            
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={setOtpValue}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleOTPVerification} 
                className="w-full" 
                disabled={loading || otpValue.length !== 6}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              
              {otpTimer === 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      const values = phoneOtpForm.getValues();
                      handlePhoneOTP(values);
                    }}
                    className="w-full"
                    disabled={loading}
                  >
                    Resend OTP
                  </Button>
              )}
              
              <Button 
                variant="ghost" 
                onClick={() => setAuthStep('auth')} 
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </div>
        )}

        {/* Forgot Password Step */}
        {authStep === 'forgot' && (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <Lock className="mx-auto h-12 w-12 text-amber-600" />
              <h3 className="text-lg font-semibold">Reset Password</h3>
              <p className="text-sm text-muted-foreground">
                Enter your email to receive reset instructions
              </p>
            </div>

            <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...forgotPasswordForm.register('email')}
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                  />
                </div>
                {forgotPasswordForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{String(forgotPasswordForm.formState.errors.email.message)}</p>
                )}
              </div>

              <div className="space-y-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={() => setAuthStep('auth')} 
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Main Authentication Step */}
        {authStep === 'auth' && (
          <div className="space-y-6 py-4">
            {/* Account Lockout Warning */}
            {isLocked && lockoutEndTime && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div className="text-sm text-red-700">
                  Account temporarily locked. Try again in {Math.ceil((lockoutEndTime.getTime() - Date.now()) / 1000 / 60)} minutes.
                </div>
              </div>
            )}

            <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as 'signin' | 'signup')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-6">
                {/* Authentication Method Selection */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={authMethod === 'email' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAuthMethod('email')}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={authMethod === 'phone' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAuthMethod('phone')}
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Phone
                  </Button>
                </div>

                {authMethod === 'email' ? (
                  <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...signInForm.register('email')}
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10"
                          disabled={isLocked}
                        />
                      </div>
                      {signInForm.formState.errors.email && (
                        <p className="text-sm text-red-500">{signInForm.formState.errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...signInForm.register('password')}
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          disabled={isLocked}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    {signInForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{String(signInForm.formState.errors.password.message)}</p>
                    )}
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          {...signInForm.register('rememberMe')}
                          type="checkbox"
                          className="rounded border-gray-300"
                        />
                        <span>Remember me</span>
                      </label>
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm px-0"
                        onClick={() => setAuthStep('forgot')}
                      >
                        Forgot password?
                      </Button>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || isLocked}>
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={phoneOtpForm.handleSubmit(handlePhoneOTP)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...phoneOtpForm.register('phone')}
                          id="signin-phone"
                          type="tel"
                          placeholder="+1234567890"
                          className="pl-10"
                        />
                      </div>
                      {phoneOtpForm.formState.errors.phone && (
                        <p className="text-sm text-red-500">{String(phoneOtpForm.formState.errors.phone.message)}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </form>
                )}

                {/* Social Login */}
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialLogin('google')}
                      disabled={loading}
                      className="w-full"
                    >
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Google
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleSocialLogin('facebook')}
                      disabled={loading}
                      className="w-full"
                    >
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Sign Up Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...signUpForm.register('fullName')}
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                      />
                    </div>
                    {signUpForm.formState.errors.fullName && (
                      <p className="text-sm text-red-500">{signUpForm.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...signUpForm.register('email')}
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                      />
                    </div>
                    {signUpForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{signUpForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...signUpForm.register('phone')}
                        id="signup-phone"
                        type="tel"
                        placeholder="+1234567890"
                        className="pl-10"
                      />
                    </div>
                    {signUpForm.formState.errors.phone && (
                      <p className="text-sm text-red-500">{signUpForm.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Account Type</Label>
                    <Select 
                      onValueChange={(value: 'customer' | 'b2b_buyer') => signUpForm.setValue('role', value)}
                      defaultValue="customer"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Individual Customer</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="b2b_buyer">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4" />
                            <span>B2B Buyer</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {signUpForm.formState.errors.role && (
                      <p className="text-sm text-red-500">{signUpForm.formState.errors.role.message}</p>
                    )}
                  </div>

                  {(signUpForm.watch('role') as string) === 'b2b_buyer' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signup-company">Company Name</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...signUpForm.register('companyName')}
                            id="signup-company"
                            type="text"
                            placeholder="Enter company name"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-gst">GST Number (Optional)</Label>
                        <Input
                          {...signUpForm.register('gstNumber')}
                          id="signup-gst"
                          type="text"
                          placeholder="22AAAAA0000A1Z5"
                        />
                        {signUpForm.formState.errors.gstNumber && (
                          <p className="text-sm text-red-500">{signUpForm.formState.errors.gstNumber.message}</p>
                        )}
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-access-code">Access Code (Optional)</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...signUpForm.register('accessCode')}
                        id="signup-access-code"
                        type="text"
                        placeholder="Enter exclusive access code"
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      For exclusive collections (school uniforms, corporate merchandise)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...signUpForm.register('password')}
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {signUpForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{signUpForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...signUpForm.register('confirmPassword')}
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {signUpForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">{signUpForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-start space-x-2 text-sm">
                      <input
                        {...signUpForm.register('agreeToTerms')}
                        type="checkbox"
                        className="mt-0.5 rounded border-gray-300"
                      />
                      <span>
                        I agree to the{" "}
                        <a href="/terms" className="underline text-primary hover:text-primary/80">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="/privacy" className="underline text-primary hover:text-primary/80">
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                    {signUpForm.formState.errors.agreeToTerms && (
                      <p className="text-sm text-red-500">{signUpForm.formState.errors.agreeToTerms.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
      
      {/* Hidden reCAPTCHA container for phone verification */}
      <div id="recaptcha-container" style={{ display: 'none' }}></div>
    </Dialog>
  );
}
