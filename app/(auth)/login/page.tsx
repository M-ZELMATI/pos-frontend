'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { login } from '@/services/authService';
import { Toaster } from '@/components/ui/sonner';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
import { toast } from 'sonner';
import { useCustomTranslation } from '@/i18n/useCustomTranslation';
import { setCookie } from '@/hooks/useCookies';

export default function LoginPage() {
  const router = useRouter();
  const t = useCustomTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const data = await login(values.email, values.password);
      // Set cookie without JSON serialization for JWT token
      document.cookie = `token=${data.data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      console.log('Token set successfully:', data.data.access_token);
      toast('Welcome back!');
      // Force a page reload to ensure middleware runs
      window.location.href = '/';
    } catch (error) {
      console.error('Login error:', error);
      toast('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h1>

          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl font-semibold text-center">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and password below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">{t('Email address')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder={t('Enter your email')}
                            className="pl-10 h-11 bg-background border-input focus:border-ring transition-colors"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium">{t('Password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            type="password"
                            placeholder={t('Enter your password')}
                            className="pl-10 h-11 bg-background border-input focus:border-ring transition-colors"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    {t('Forgot your password?')}
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('Signing in')}...
                    </>
                  ) : (
                    <>
                      {t('Sign in')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              {t('Terms of Service')}
            </Link>{' '}
            {t('and')}{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              {t('Privacy Policy')}
            </Link>
          </p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
