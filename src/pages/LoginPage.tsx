import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Checkbox } from '@/components/Checkbox';
import { Divider } from '@/components/Divider';
import { SocialButton } from '@/components/SocialButton';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { signInWithPassword } from '@/auth/context/jwt/action';
import { getErrorMessage } from '@/auth/utils';
import { useAuthContext } from '@/auth/hooks';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { checkUserSession } = useAuthContext();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await signInWithPassword({ email, password });
      await checkUserSession?.();

      toast.success('Welcome back!', {
        description: 'You have successfully signed in.',
      });

      // Navigate to dashboard after successful login
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      toast.error('Login failed!', {
        description: feedbackMessage,
      });
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login`, {
      description: `Redirecting to ${provider}...`,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <AuthLayout>
      <motion.div className="w-full max-w-md" variants={containerVariants} initial="hidden" animate="visible">
        {/* Card */}
        <motion.div
          className="rounded-2xl border border-border/60 bg-card/95 backdrop-blur-sm p-8 sm:p-10 shadow-elegant"
          variants={itemVariants}
        >
          {/* Header */}
          <motion.div className="text-center mb-8" variants={itemVariants}>
            <h1 className="text-3xl font-serif font-semibold text-foreground mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to continue to your account</p>
          </motion.div>

          {/* Social login buttons */}
          <motion.div className="space-y-3 mb-6" variants={itemVariants}>
            <SocialButton provider="google" onClick={() => handleSocialLogin('Google')} />
            <SocialButton provider="apple" onClick={() => handleSocialLogin('Apple')} />
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants}>
            <Divider label="or continue with email" className="my-6" />
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={handleSubmit} className="space-y-5" variants={itemVariants}>
            <Input
              type="email"
              label="Email address"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              error={errors.email}
              leftIcon={<Mail className="h-4 w-4" />}
              autoComplete="email"
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              error={errors.password}
              leftIcon={<Lock className="h-4 w-4" />}
              autoComplete="current-password"
            />

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <button
                type="button"
                className="text-sm font-medium text-primary hover:text-primary-deep transition-colors duration-200"
                onClick={() =>
                  toast.info('Password reset', {
                    description: 'Check your email for instructions.',
                  })
                }
              >
                Forgot password?
              </button>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoading}
              rightIcon={!isLoading && <ArrowRight className="h-4 w-4" />}
              className="mt-2"
            >
              Sign in
            </Button>
          </motion.form>

          {/* Sign up link */}
          <motion.p className="mt-8 text-center text-sm text-muted-foreground" variants={itemVariants}>
            Don't have an account?{' '}
            <button
              type="button"
              className="font-semibold text-primary hover:text-primary-deep transition-colors duration-200"
              onClick={() => toast.info('Sign up', { description: 'Registration page coming soon!' })}
            >
              Create account
            </button>
          </motion.p>
        </motion.div>

        {/* Terms & Privacy */}
        <motion.p className="mt-6 text-center text-xs text-muted-foreground px-4" variants={itemVariants}>
          By signing in, you agree to our{' '}
          <button className="underline underline-offset-2 hover:text-foreground transition-colors">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="underline underline-offset-2 hover:text-foreground transition-colors">
            Privacy Policy
          </button>
        </motion.p>
      </motion.div>
    </AuthLayout>
  );
};

export default LoginPage;
