"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Router,
  Signal,
  Activity,
  Users,
  Calendar,
  MapPin,
  Settings,
  RotateCw,
  Power,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NetworkNode {
  id: string
  name: string
  status: string
  uptime: number
  connections: number
  location: string
  lastMaintenance: string
}

interface NetworkNodeModalProps {
  node: NetworkNode | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NetworkNodeModal({ node, open, onOpenChange }: NetworkNodeModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  if (!node) return null

  const handleRestart = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLoading(false)
    toast({
      title: "Node restarted",
      description: `${node.name} has been restarted successfully.`,
    })
  }

  const handleMaintenance = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLoading(false)
    toast({
      title: "Maintenance mode",
      description: `${node.name} has been put into maintenance mode.`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "offline":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Signal className="h-4 w-4 text-green-600" />
      case "maintenance":
        return <Settings className="h-4 w-4 text-yellow-600" />
      case "offline":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Router className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">{getStatusIcon(node.status)}</div>
              <div>
                <DialogTitle className="text-xl">{node.name}</DialogTitle>
                <DialogDescription>Node ID: {node.id}</DialogDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(node.status)}>{node.status.toUpperCase()}</Badge>
              <Button variant="outline" size="sm" onClick={handleRestart} disabled={loading}>
                <RotateCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Restarting..." : "Restart"}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Node Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Router className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Node ID</span>
                    </div>
                    <span className="text-sm font-medium">{node.id}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Location</span>
                    </div>
                    <span className="text-sm font-medium">{node.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Uptime</span>
                    </div>
                    <span className="text-sm font-medium">{node.uptime}%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Active Connections</span>
                    </div>
                    <span className="text-sm font-medium">{node.connections}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Last Maintenance</span>
                    </div>
                    <span className="text-sm font-medium">{node.lastMaintenance}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Signal className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Signal Strength</p>
                      <p className="text-lg font-bold text-blue-900">-45 dBm</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <Activity className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Bandwidth Usage</p>
                      <p className="text-lg font-bold text-green-900">234 Mbps</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CPU Usage</span>
                      <span>23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Memory Usage</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Throughput</span>
                      <span className="text-sm font-medium">456 Mbps</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Latency</span>
                      <span className="text-sm font-medium">12ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Packet Loss</span>
                      <span className="text-sm font-medium">0.02%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Error Rate</span>
                      <span className="text-sm font-medium">0.001%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resource Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CPU Usage</span>
                        <span>23%</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Memory Usage</span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Storage Usage</span>
                        <span>34%</span>
                      </div>
                      <Progress value={34} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Network Usage</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="connections" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Connections</CardTitle>
                <CardDescription>Currently connected customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Customer #{1000 + i}</p>
                        <p className="text-xs text-muted-foreground">192.168.1.{100 + i}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{Math.floor(Math.random() * 50) + 10} Mbps</p>
                        <p className="text-xs text-muted-foreground">Connected 2h {Math.floor(Math.random() * 60)}m</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Maintenance Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={handleRestart}
                    disabled={loading}
                  >
                    <RotateCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Restart Node
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                    onClick={handleMaintenance}
                    disabled={loading}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Enter Maintenance Mode
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Power className="h-4 w-4 mr-2" />
                    Power Cycle
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Maintenance History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Settings className="h-4 w-4 text-blue-500 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Routine Maintenance</p>
                        <p className="text-xs text-muted-foreground">Firmware update and system check</p>
                        <p className="text-xs text-muted-foreground">{node.lastMaintenance}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 border rounded-lg">
                      <RotateCw className="h-4 w-4 text-green-500 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">System Restart</p>
                        <p className="text-xs text-muted-foreground">Scheduled restart for updates</p>
                        <p className="text-xs text-muted-foreground">2024-01-10</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
