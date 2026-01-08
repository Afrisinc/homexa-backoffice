import * as React from 'react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { motion } from 'framer-motion';

export interface AuthLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn('min-h-screen w-full', className)}>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0" style={{ background: 'var(--gradient-bg)' }} />

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 pattern-dots opacity-60" />

        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] -translate-y-1/3 translate-x-1/4">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] translate-y-1/3 -translate-x-1/4">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-accent/10 to-transparent blur-3xl" />
        </div>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-[15%] left-[10%] w-20 h-20 rounded-2xl bg-primary/5 backdrop-blur-sm border border-primary/10"
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[8%] w-16 h-16 rounded-xl bg-accent/5 backdrop-blur-sm border border-accent/10"
          animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-[60%] left-[5%] w-12 h-12 rounded-lg bg-secondary/60 backdrop-blur-sm border border-secondary-foreground/10"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        />
      </div>

      {/* Main content */}
      <div className="relative flex min-h-screen flex-col">
        {/* Header */}
        <header className="w-full px-6 py-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Logo size="md" />
          </motion.div>
        </header>

        {/* Page content */}
        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">{children}</main>

        {/* Footer */}
        {/* Footer */}
        <footer className="w-full px-6 py-5 text-center">
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            © {new Date().getFullYear()}{' '}
            <a
              href="https://github.com/Abdul250-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground hover:underline transition-colors"
            >
              Abdul
            </a>
            . All rights reserved.
          </motion.p>
        </footer>
      </div>
    </div>
  );
};
