"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, MessageSquare, DollarSign, Wifi, Package, Send, Plus, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuickActionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickActionsModal({ open, onOpenChange }: QuickActionsModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const { toast } = useToast()

  const handleAction = async (action: string) => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLoading(false)
    toast({
      title: "Action completed",
      description: `${action} has been processed successfully.`,
    })
    onOpenChange(false)
  }

  const customers = [
    { id: "1", name: "John Doe", package: "Premium", status: "active" },
    { id: "2", name: "Sarah Wilson", package: "Basic", status: "active" },
    { id: "3", name: "Mike Johnson", package: "Standard", status: "suspended" },
    { id: "4", name: "Emma Davis", package: "Premium", status: "active" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Quick Actions</DialogTitle>
          <DialogDescription>Perform common tasks quickly and efficiently</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="customer" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customer">Add Customer</TabsTrigger>
            <TabsTrigger value="sms">Send SMS</TabsTrigger>
            <TabsTrigger value="payment">Record Payment</TabsTrigger>
            <TabsTrigger value="network">Network Action</TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Add New Customer</span>
                </CardTitle>
                <CardDescription>Quickly register a new customer with basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Full Name</Label>
                    <Input id="customer-name" placeholder="Enter customer name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-phone">Phone Number</Label>
                    <Input id="customer-phone" placeholder="+254 700 000 000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email Address</Label>
                    <Input id="customer-email" type="email" placeholder="customer@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-package">Package</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select package" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic - KES 1,500</SelectItem>
                        <SelectItem value="standard">Standard - KES 2,500</SelectItem>
                        <SelectItem value="premium">Premium - KES 4,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-address">Address</Label>
                  <Textarea id="customer-address" placeholder="Enter customer address" />
                </div>
                <Button onClick={() => handleAction("Customer registration")} disabled={loading} className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {loading ? "Creating Customer..." : "Create Customer"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sms" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Send SMS</span>
                </CardTitle>
                <CardDescription>Send SMS to individual customers or broadcast to groups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="all-customers" name="recipients" value="all" />
                      <Label htmlFor="all-customers">All Active Customers (156)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="overdue-customers" name="recipients" value="overdue" />
                      <Label htmlFor="overdue-customers">Overdue Customers (8)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="custom-selection" name="recipients" value="custom" />
                      <Label htmlFor="custom-selection">Custom Selection</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sms-template">Message Template</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template or write custom" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment-reminder">Payment Reminder</SelectItem>
                      <SelectItem value="maintenance">Maintenance Notice</SelectItem>
                      <SelectItem value="welcome">Welcome Message</SelectItem>
                      <SelectItem value="custom">Custom Message</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sms-message">Message</Label>
                  <Textarea
                    id="sms-message"
                    placeholder="Type your message here..."
                    defaultValue="Dear customer, this is a reminder that your payment is due on [DATE]. Please make your payment to avoid service interruption. Thank you."
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>160 characters remaining</span>
                    <span>1 SMS</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">SMS Credits Available</p>
                    <p className="text-xs text-muted-foreground">Current balance: 1,250 credits</p>
                  </div>
                  <Badge variant="secondary">Cost: 156 credits</Badge>
                </div>

                <Button onClick={() => handleAction("SMS broadcast")} disabled={loading} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? "Sending SMS..." : "Send SMS"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Record Payment</span>
                </CardTitle>
                <CardDescription>Quickly record a customer payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-customer">Customer</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="payment-customer" placeholder="Search customer by name or phone" className="pl-9" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-amount">Amount (KES)</Label>
                    <Input id="payment-amount" type="number" placeholder="2500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mpesa">M-Pesa</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-reference">Reference Number</Label>
                  <Input id="payment-reference" placeholder="Transaction reference (optional)" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-notes">Notes</Label>
                  <Textarea id="payment-notes" placeholder="Additional notes (optional)" />
                </div>

                <Button onClick={() => handleAction("Payment recording")} disabled={loading} className="w-full">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {loading ? "Recording Payment..." : "Record Payment"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wifi className="h-5 w-5" />
                    <span>Connection Control</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleAction("Bulk connection activation")}
                    disabled={loading}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Activate All Suspended
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleAction("Overdue suspension")}
                    disabled={loading}
                  >
                    <Wifi className="h-4 w-4 mr-2" />
                    Suspend Overdue Accounts
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleAction("Network restart")}
                    disabled={loading}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Restart Network Services
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Package Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleAction("Package upgrade notifications")}
                    disabled={loading}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Upgrade Offers
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleAction("Package renewal reminders")}
                    disabled={loading}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Send Renewal Reminders
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={() => handleAction("Package analysis")}
                    disabled={loading}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Generate Package Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
