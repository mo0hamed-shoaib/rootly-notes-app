"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function TermsDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="h-auto p-0 text-xs underline underline-offset-4">
          Terms of Service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p className="font-medium">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div>
            <h3 className="font-semibold mb-2">1. Acceptance of Terms</h3>
            <p>By using Rootly, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Use License</h3>
            <p>Rootly is provided for personal learning and educational purposes. You may not use the service for commercial purposes without explicit permission.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. User Data</h3>
            <p>You retain ownership of all data you create. Rootly provides tools to export your data at any time.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">4. Service Availability</h3>
            <p>Rootly is provided "as is" without warranties. We strive for high availability but cannot guarantee uninterrupted service.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">5. Termination</h3>
            <p>You may stop using Rootly at any time. We reserve the right to suspend accounts that violate these terms.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">6. Changes to Terms</h3>
            <p>We may update these terms. Continued use after changes constitutes acceptance of the new terms.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
