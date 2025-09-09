import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  Key, 
  Timer, 
  Eye, 
  Users, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

export default function SecurityInfo() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "Multi-Factor Authentication",
      description: "Email + Password, Phone OTP, and Social Login options",
      status: "implemented",
      details: [
        "Email verification required for new accounts",
        "SMS OTP for phone number verification",
        "Social login integration ready (Google, Facebook)",
        "Account lockout after 5 failed attempts"
      ]
    },
    {
      icon: Lock,
      title: "Password Security",
      description: "Strong password requirements and secure reset process",
      status: "implemented", 
      details: [
        "Minimum 8 characters with complexity requirements",
        "Secure password reset via email with time-limited tokens",
        "Password hashing using bcryptjs with salt rounds",
        "Password visibility toggle for better UX"
      ]
    },
    {
      icon: Key,
      title: "JWT Session Management",
      description: "Secure token-based authentication with automatic refresh",
      status: "implemented",
      details: [
        "Access tokens (15 minutes expiry) + Refresh tokens (7 days)",
        "Automatic token refresh on API calls",
        "Secure token storage in httpOnly cookies (recommended)",
        "Token revocation on logout from all devices"
      ]
    },
    {
      icon: Timer,
      title: "Auto-Logout on Inactivity",
      description: "Automatic session termination for security",
      status: "implemented",
      details: [
        "30-minute inactivity timeout (configurable)",
        "5-minute warning before auto-logout",
        "Activity tracking (mouse, keyboard, touch events)",
        "Option to extend session without re-authentication"
      ]
    },
    {
      icon: Users,
      title: "Role-Based Access Control",
      description: "Granular permissions based on user roles",
      status: "implemented",
      details: [
        "Customer: Storefront and shopping features",
        "B2B Buyer: Bulk orders, quotations, invoicing",
        "Admin: Full dashboard and management access",
        "Protected routes with role verification"
      ]
    },
    {
      icon: Eye,
      title: "Exclusive Access System",
      description: "Special access codes for restricted content",
      status: "implemented",
      details: [
        "Access codes for school/society uniforms",
        "Corporate merchandise restricted sections",
        "Group membership approval workflow",
        "Admin-controlled access management"
      ]
    }
  ];

  const securityBestPractices = [
    {
      title: "Data Protection",
      items: [
        "All sensitive data encrypted in transit (HTTPS/TLS)",
        "Password hashing with bcryptjs (12 salt rounds)",
        "Input validation and sanitization",
        "SQL injection prevention with parameterized queries"
      ]
    },
    {
      title: "Authentication Security",
      items: [
        "Rate limiting on login endpoints (5 attempts per 15 minutes)",
        "Account lockout mechanism (15 minutes after 5 failed attempts)",
        "Email verification for new account activation",
        "Secure password reset with time-limited tokens (1 hour expiry)"
      ]
    },
    {
      title: "Session Security",
      items: [
        "JWT tokens with short expiry times",
        "Refresh token rotation for enhanced security",
        "Session invalidation on password change",
        "Device-based session tracking (optional)"
      ]
    },
    {
      title: "API Security",
      items: [
        "CORS configuration for allowed origins",
        "Request size limits to prevent DoS attacks",
        "API rate limiting per IP address",
        "Input validation with Zod schemas"
      ]
    }
  ];

  const threatMitigation = [
    {
      threat: "Brute Force Attacks",
      mitigation: "Account lockout after 5 failed attempts, rate limiting on auth endpoints",
      icon: AlertTriangle,
      severity: "high"
    },
    {
      threat: "Session Hijacking",
      mitigation: "Short-lived JWT tokens, HTTPS only, secure cookie flags",
      icon: Shield,
      severity: "high"
    },
    {
      threat: "Password Attacks",
      mitigation: "Strong password requirements, secure hashing (bcryptjs)",
      icon: Lock,
      severity: "medium"
    },
    {
      threat: "Social Engineering",
      mitigation: "Email verification, OTP verification, security awareness",
      icon: Users,
      severity: "medium"
    },
    {
      threat: "Data Injection",
      mitigation: "Input validation, parameterized queries, Zod schemas",
      icon: Eye,
      severity: "high"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Security Implementation Guide
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive security features implemented in the Handloom Portal authentication system
        </p>
      </div>

      {/* Security Features */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Shield className="h-6 w-6 text-green-500" />
          Implemented Security Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <IconComponent className="h-8 w-8 text-amber-600" />
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {feature.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <ul className="space-y-1">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Security Best Practices */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Lock className="h-6 w-6 text-blue-500" />
          Security Best Practices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {securityBestPractices.map((practice, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{practice.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {practice.items.map((item, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <Info className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Threat Mitigation */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          Threat Mitigation Matrix
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {threatMitigation.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <IconComponent className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{item.threat}</h3>
                        <Badge 
                          variant={item.severity === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {item.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.mitigation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Implementation Notes */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-amber-600" />
              Implementation Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Environment Variables Required:</h4>
              <code className="block bg-muted p-4 rounded-lg text-sm">
                JWT_SECRET=your-super-secure-secret-key<br/>
                JWT_REFRESH_SECRET=your-refresh-secret-key<br/>
                MONGODB_URI=mongodb://localhost:27017/handloom_portal<br/>
                SENDGRID_API_KEY=your-sendgrid-key<br/>
                TWILIO_ACCOUNT_SID=your-twilio-sid
              </code>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Security Headers (Helmet.js):</h4>
              <ul className="text-sm space-y-1">
                <li>• Content Security Policy (CSP)</li>
                <li>• HTTP Strict Transport Security (HSTS)</li>
                <li>• X-Frame-Options: DENY</li>
                <li>• X-Content-Type-Options: nosniff</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Recommended Production Settings:</h4>
              <ul className="text-sm space-y-1">
                <li>• Use HTTPS for all communications</li>
                <li>• Set secure cookie flags in production</li>
                <li>• Implement API rate limiting per user/IP</li>
                <li>• Enable database encryption at rest</li>
                <li>• Regular security audits and updates</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
