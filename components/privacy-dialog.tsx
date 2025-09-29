"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function PrivacyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="h-auto p-0 text-xs underline underline-offset-4">
          Privacy Policy
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p className="font-medium">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div>
            <h3 className="font-semibold mb-2">1. Information We Collect</h3>
            <p>We collect only the information necessary to provide our service: your OAuth profile data (name, email, avatar) and your learning content (notes, courses, daily entries).</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. How We Use Your Information</h3>
            <p>Your data is used solely to provide the Rootly learning platform. We do not sell, rent, or share your personal information with third parties.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Data Storage</h3>
            <p>Your data is stored securely using Supabase with Row Level Security (RLS) ensuring only you can access your information.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">4. Data Export & Deletion</h3>
            <p>You can export your data at any time through the app. To delete your account and all data, contact us directly.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">5. Cookies</h3>
            <p>We use essential cookies for authentication and session management. No tracking or analytics cookies are used.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">6. Third-Party Services</h3>
            <p>We use Supabase for data storage and Google/GitHub for authentication. These services have their own privacy policies.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">7. Contact</h3>
            <p>For privacy questions or data deletion requests, please contact us through the app or our support channels.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
