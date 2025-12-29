"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Phone, Mail, Calendar, DollarSign, Wifi, MessageSquare, Edit, Save, X, Play, Pause } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  package: string
  status: string
  joinDate: string
  lastPayment: string
  nextBilling: string
  totalPaid: number
  daysRemaining: number
  pppoeUsername: string
  pppoePassword: string
  ipAddress: string
  connectionStatus: string
}

interface CustomerDetailsModalProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerDetailsModal({ customer, open, onOpenChange }: CustomerDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  if (!customer) return null

  const handleSave = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    setIsEditing(false)
    toast({
      title: "Customer updated",
      description: "Customer information has been saved successfully.",
    })
  }

  const handleConnectionToggle = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    toast({
      title: customer.connectionStatus === "active" ? "Connection suspended" : "Connection activated",
      description: `${customer.name}'s connection has been ${customer.connectionStatus === "active" ? "suspended" : "activated"}.`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48" />
                <AvatarFallback>
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl">{customer.name}</DialogTitle>
                <DialogDescription>Customer ID: #{customer.id}</DialogDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(customer.status)}>{customer.status.toUpperCase()}</Badge>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={customer.name} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={customer.email} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue={customer.phone} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" defaultValue={customer.address} disabled={!isEditing} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Account Status</span>
                    </div>
                    <Badge className={getStatusColor(customer.status)}>{customer.status.toUpperCase()}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Join Date</span>
                    </div>
                    <span className="text-sm font-medium">{customer.joinDate}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Total Paid</span>
                    </div>
                    <span className="text-sm font-medium">KES {customer.totalPaid.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Connection</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={customer.connectionStatus === "active" ? "default" : "secondary"}>
                        {customer.connectionStatus.toUpperCase()}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={handleConnectionToggle} disabled={loading}>
                        {customer.connectionStatus === "active" ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="space-y-2">
                      <Label htmlFor="status">Account Status</Label>
                      <Select defaultValue={customer.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="package">Current Package</Label>
                    <Select defaultValue={customer.package} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Basic">Basic - KES 1,500</SelectItem>
                        <SelectItem value="Standard">Standard - KES 2,500</SelectItem>
                        <SelectItem value="Premium">Premium - KES 4,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Payment</span>
                    <span className="text-sm font-medium">{customer.lastPayment}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next Billing</span>
                    <span className="text-sm font-medium">{customer.nextBilling}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Days Remaining</span>
                    <Badge variant={customer.daysRemaining > 7 ? "default" : "destructive"}>
                      {customer.daysRemaining} days
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Monthly Payment</p>
                        <p className="text-xs text-muted-foreground">Jan 15, 2024</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">+KES 2,500</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Monthly Payment</p>
                        <p className="text-xs text-muted-foreground">Dec 15, 2023</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">+KES 2,500</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Setup Fee</p>
                        <p className="text-xs text-muted-foreground">Nov 20, 2023</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">+KES 1,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">PPPOE Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pppoe-username">PPPOE Username</Label>
                    <Input id="pppoe-username" defaultValue={customer.pppoeUsername} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pppoe-password">PPPOE Password</Label>
                    <Input
                      id="pppoe-password"
                      type="password"
                      defaultValue={customer.pppoePassword}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ip-address">Assigned IP Address</Label>
                    <Input id="ip-address" defaultValue={customer.ipAddress} disabled={!isEditing} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connection Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Connection Status</span>
                    <Badge variant={customer.connectionStatus === "active" ? "default" : "secondary"}>
                      {customer.connectionStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session Duration</span>
                    <span className="text-sm font-medium">2h 34m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Usage (Today)</span>
                    <span className="text-sm font-medium">1.2 GB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Speed</span>
                    <span className="text-sm font-medium">24.5 Mbps</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="communication" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Communication History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <MessageSquare className="h-4 w-4 text-blue-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment Reminder Sent</p>
                      <p className="text-xs text-muted-foreground">SMS sent about upcoming payment due date</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Mail className="h-4 w-4 text-green-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Welcome Email Sent</p>
                      <p className="text-xs text-muted-foreground">Account setup and configuration details</p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Phone className="h-4 w-4 text-orange-500 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Support Call</p>
                      <p className="text-xs text-muted-foreground">Technical support for connection issues</p>
                      <p className="text-xs text-muted-foreground">2 weeks ago</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send SMS
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Customer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
