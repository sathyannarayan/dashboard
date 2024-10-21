"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar"
import { Progress } from "./components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts'
import { Bell, Search, ChevronDown, Home, LayoutDashboard, AlertTriangle, CheckSquare, MessageSquare, Settings, LogOut, AlertCircle, Clock, CheckCircle, XCircle, Menu, ChevronRight } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu"
import { Label } from "./components/ui/label"
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Textarea } from "./components/ui/textarea"

// Test data generation
const generateTestData = () => {
  const notifications = [
    "[AUS][WA]Plant heat exchanger",
    "[SA][PA]Evaporator unit spillage",
    "[CA][BC]Boiler feed system Rupture",
  ];

  const hazardInsightsData = Array.from({ length: 12 }, (_, i) => ({
    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    Low: Math.floor(Math.random() * 200) + 100,
    Medium: Math.floor(Math.random() * 200) + 150,
    High: Math.floor(Math.random() * 200) + 100,
  }));

  const actionsResolvedData = Array.from({ length: 7 }, (_, i) => ({
    name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i],
    Hazard: Math.floor(Math.random() * 1500) + 1000,
    'Corrective Actions': Math.floor(Math.random() * 1500) + 1000,
  }));

  const topHazardsData = [
    { name: "[AUS][WA]Pasta Plant heat exchanger", progress: 45, color: "#3b82f6" },
    { name: "[SA][PA]Evaporator unit spillage", progress: 57, color: "#3b82f6" },
    { name: "[CA][BC]Boiler feed system Rupture", progress: 68, color: "#3b82f6" },
    { name: "[KY][TX]Mining feeder Electrical", progress: 79, color: "#3b82f6" },
    { name: "[NY][NJ]Cooling tower fan failure", progress: 82, color: "#3b82f6" },
    { name: "[UK][LN]Chemical storage tank leak", progress: 62, color: "#3b82f6" },
    { name: "[JP][TK]Conveyor belt malfunction", progress: 55, color: "#3b82f6" },
  ];

  const risksData2024 = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    High: Math.floor(Math.random() * 200) + 100,
    VeryHigh: Math.floor(Math.random() * 200) + 100,
    mitigated: Math.floor(Math.random() * 300) + 100,
  }));

  const sampleDropdownData = {
    sites: ["Australia", "Peru", "Canada", "Chile", "Africa"],
    operationCenters: ["Kinawa-OP1", "Kinawa-OP2", "Smith-OP1", "Smith-OP3"],
    facilities: ["Process-KWDIGEST", "Process-Boiler", "Process-TankIngest"],
    unitTypes: ["BatteryType", "Boiler Feed Water System", "Boiler Steam Drum", "Fuel Gas Line"],
    hazardClasses: ["Explosion", "Fire", "Leakage","Impact","Natural Disaster","Rupture/Collapse"],
    riskClasses: ["Safety,Environment,Financial", "Safety", "Environment", "Financial Impact"],
    workflowStatuses: ["Open", "In Progress", "Under Review", "Closed"],
    engineeringStandards: ["Standard 1", "Standard 2", "Standard 3"],
    sources: ["Source A", "Source B", "Source C"],
    engineers: ["John Smith", "Jane Smith", "Bob Johnson", "Alice Brown"],
  };

  return {
    notifications,
    hazardInsightsData,
    actionsResolvedData,
    topHazardsData,
    risksData2024,
    sampleDropdownData,
  };
};

const testData = generateTestData();

interface StatusCardProps {
  title: string;
  value: string;
  change: string;
  color: 'red' | 'yellow' | 'green' | 'purple';
  icon: React.ElementType;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, change, color, icon: Icon }) => {
  const bgColorClass = {
    red: 'bg-red-50',
    yellow: 'bg-yellow-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
  }[color]

  const textColorClass = {
    red: 'text-red-500',
    yellow: 'text-yellow-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
  }[color]

  return (
    <Card className={bgColorClass}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${textColorClass}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${textColorClass}`}>{change} from yesterday</p>
      </CardContent>
    </Card>
  )
}

const SidebarItem: React.FC<{
  icon: React.ElementType;
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  collapsed: boolean;
}> = ({ icon: Icon, children, onClick, active, collapsed }) => (
  <Button
    variant="ghost"
    className={`w-full justify-start text-white ${active ? 'bg-indigo-700' : ''} ${
      collapsed ? 'px-2' : 'px-4'
    }`}
    onClick={onClick}
  >
    <Icon className={`h-5 w-5 ${collapsed ? 'mr-0' : 'mr-2'}`} />
    {!collapsed && <span>{children}</span>}
  </Button>
)

const Breadcrumbs: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
    {items.map((item, index) => (
      <React.Fragment key={index}>
        {index > 0 && <ChevronRight className="h-4 w-4" />}
        <span>{item}</span>
      </React.Fragment>
    ))}
  </div>
)

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="text-lg font-semibold break-words">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      {children}
    </CardContent>
  </Card>
)

const HazardManagementScreen: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Hazard Management</h2>
    <Card>
      <CardHeader>
        <CardTitle>Create Hazard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="copyHazard">Copy Hazard from</Label>
            <Input id="copyHazard" placeholder="Search Hazard number" />
          </div>
          <div>
            <Label htmlFor="hazardId">Hazard Management ID Number</Label>
            <Input id="hazardId" placeholder="32-HM-1191" />
          </div>
          <div>
            <Label>Priority</Label>
            <RadioGroup defaultValue="medium">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="veryHigh" id="veryHigh" />
                <Label htmlFor="veryHigh">Very High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">Low</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="site">Site</Label>
            <Select>
              <SelectTrigger id="site">
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.sites.map((site) => (
                  <SelectItem key={site} value={site}>{site}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="operationCenter">Operation Center</Label>
            <Select>
              <SelectTrigger id="operationCenter">
                <SelectValue placeholder="Select operation center" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.operationCenters.map((center) => (
                  <SelectItem key={center} value={center}>{center}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="facilities">Facilities</Label>
            <Select>
              <SelectTrigger id="facilities">
                <SelectValue placeholder="Select facilities" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.facilities.map((facility) => (
                  <SelectItem key={facility} value={facility}>{facility}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="unitType">Unit type</Label>
            <Select>
              <SelectTrigger id="unitType">
                <SelectValue placeholder="Select unit type" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.unitTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="approvalDate">Approval Date</Label>
            <Input id="approvalDate" type="date" />
          </div>
          <div>
            <Label htmlFor="plannedCompletionDate">Planned completion date</Label>
            <Input id="plannedCompletionDate" type="date" />
          </div>
          <div>
            <Label htmlFor="hazardClass">Hazard Class</Label>
            <Select>
              <SelectTrigger id="hazardClass">
                <SelectValue placeholder="Select hazard class" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.hazardClasses.map((hazardClass) => (
                  <SelectItem key={hazardClass} value={hazardClass}>{hazardClass}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="assignTo">Assign to</Label>
            <Select>
              <SelectTrigger id="assignTo">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.engineers.map((engineer) => (
                  <SelectItem key={engineer} value={engineer}>{engineer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="riskClass">Risk Class</Label>
            <Select>
              <SelectTrigger id="riskClass">
                <SelectValue placeholder="Select risk class" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.riskClasses.map((riskClass) => (
                  <SelectItem key={riskClass} value={riskClass}>{riskClass}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="hazardWorkflowStatus">Hazard Workflow status</Label>
            <Select>
              <SelectTrigger id="hazardWorkflowStatus">
                <SelectValue placeholder="Select workflow status" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.workflowStatuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="comments">Comments</Label>
            <Textarea id="comments" placeholder="Add additional comments" />
          </div>
          <div>
            <Label htmlFor="assetList">Asset List</Label>
            <Input id="assetList" placeholder="Add Asset Id" />
            <div className="mt-2">
              <div>Boiler-01-Kiwana-117</div>
              
              <div>Milling-08-Kiwana-217</div>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="outline">Cancel</Button>
            <Button>Submit</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

const CorrectiveActionScreen: React.FC = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Corrective Actions</h2>
    <Card>
      <CardHeader>
        <CardTitle>Create Corrective Action</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter corrective action title" />
          </div>
          <div>
            <Label htmlFor="correctiveActionId">Corrective Action ID Number</Label>
            <Input id="correctiveActionId" placeholder="32-CA-1191" />
          </div>
          <div>
            <Label>Priority</Label>
            <RadioGroup defaultValue="medium">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="veryHigh" id="caVeryHigh" />
                <Label htmlFor="caVeryHigh">Very High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="caHigh" />
                <Label htmlFor="caHigh">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="caMedium" />
                <Label htmlFor="caMedium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="caLow" />
                <Label htmlFor="caLow">Low</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="caSite">Site</Label>
            <Select>
              <SelectTrigger id="caSite">
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.sites.map((site) => (
                  <SelectItem key={site} value={site}>{site}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="caOperationCenter">Operation Center</Label>
            <Select>
              <SelectTrigger id="caOperationCenter">
                <SelectValue placeholder="Select operation center" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.operationCenters.map((center) => (
                  <SelectItem key={center} value={center}>{center}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="caFacilities">Facilities</Label>
            <Select>
              <SelectTrigger id="caFacilities">
                <SelectValue placeholder="Select facilities" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.facilities.map((facility) => (
                  <SelectItem key={facility} value={facility}>{facility}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sources">Sources</Label>
            <Select>
              <SelectTrigger id="sources">
                <SelectValue placeholder="Select sources" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.sources.map((source) => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="plannedCompletion">Planned Completion</Label>
            <Input id="plannedCompletion" type="date" />
          </div>
          <div>
            <Label htmlFor="actualCompletion">Actual Completion</Label>
            <Input id="actualCompletion" type="date" />
          </div>
          <div>
            <Label htmlFor="engineeringStandard">Engineering Standard</Label>
            <Select>
              <SelectTrigger id="engineeringStandard">
                <SelectValue placeholder="Select engineering standard" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.engineeringStandards.map((standard) => (
                  <SelectItem key={standard} value={standard}>{standard}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="caAssignTo">Assign to</Label>
            <Select>
              <SelectTrigger id="caAssignTo">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.engineers.map((engineer) => (
                  <SelectItem key={engineer} value={engineer}>{engineer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="regionalAssetIntegrityEngineer">Regional Asset Integrity Engineer</Label>
            <Select>
              <SelectTrigger id="regionalAssetIntegrityEngineer">
                <SelectValue placeholder="Select engineer" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.engineers.map((engineer) => (
                  <SelectItem key={engineer} value={engineer}>{engineer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="maintenanceReliabilityEngineer">Maintenance and Reliability Engineer</Label>
            <Select>
              <SelectTrigger id="maintenanceReliabilityEngineer">
                <SelectValue placeholder="Select engineer" />
              </SelectTrigger>
              <SelectContent>
                {testData.sampleDropdownData.engineers.map((engineer) => (
                  <SelectItem key={engineer} value={engineer}>{engineer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="caComments">Comments</Label>
            <Textarea id="caComments" placeholder="Add additional comments" />
          </div>
          <div>
            <Label htmlFor="purchaseOrder">Purchase Order</Label>
            <Input id="purchaseOrder" placeholder="Search purchase order" />
          </div>
          <div>
            <Label htmlFor="workOrder">Work Order</Label>
            <Input id="workOrder" placeholder="Search work order" />
          </div>
          <div>
            <Label htmlFor="capitalProjectId">Capital Project ID</Label>
            <Input id="capitalProjectId" placeholder="Search project ID" />
          </div>
          <div>
            <Label htmlFor="hazardManagementId">Hazard Management ID number</Label>
            <Input id="hazardManagementId" placeholder="Search hazard management ID" />
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="outline">Cancel</Button>
            <Button>Submit</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [language, setLanguage] = useState("Eng (US)")
  const [activeScreen, setActiveScreen] = useState("dashboard")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }
    
    window.addEventListener('resize', checkMobile)
    checkMobile()
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const getBreadcrumbs = () => {
    switch (activeScreen) {
      case "hazard":
        return ["Home", "Hazard Management"]
      case "corrective":
        return ["Home", "Corrective Actions"]
      default:
        return ["Home", "Dashboard"]
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
        sidebarCollapsed ? '-translate-x-full md:translate-x-0 md:w-16' : 'translate-x-0 w-64'
      } bg-indigo-600 overflow-y-auto`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <div className={`rounded-lg bg-white p-2 ${sidebarCollapsed ? 'mx-auto' : 'mr-2'}`}>
              <span className="text-indigo-600 font-bold">CY</span>
            </div>
            {!sidebarCollapsed && <span className="text-2xl font-bold text-white">CYIENT</span>}
            <Button variant="ghost" size="sm" className="text-white md:hidden" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
          <nav className="space-y-2 flex-grow p-4">
            <SidebarItem icon={LayoutDashboard} onClick={() => setActiveScreen("dashboard")} active={activeScreen === "dashboard"} collapsed={sidebarCollapsed}>Dashboard</SidebarItem>
            <SidebarItem icon={Home} onClick={() => setActiveScreen("home")} active={activeScreen === "home"} collapsed={sidebarCollapsed}>Home</SidebarItem>
            <SidebarItem icon={AlertTriangle} onClick={() => setActiveScreen("hazard")} active={activeScreen === "hazard"} collapsed={sidebarCollapsed}>Hazard Management</SidebarItem>
            <SidebarItem icon={CheckSquare} onClick={() => setActiveScreen("corrective")} active={activeScreen === "corrective"} collapsed={sidebarCollapsed}>Corrective Actions</SidebarItem>
            <SidebarItem icon={MessageSquare} onClick={() => setActiveScreen("messages")} active={activeScreen === "messages"} collapsed={sidebarCollapsed}>Messages</SidebarItem>
            <SidebarItem icon={Settings} onClick={() => setActiveScreen("settings")} active={activeScreen === "settings"} collapsed={sidebarCollapsed}>Settings</SidebarItem>
          </nav>
          <SidebarItem icon={LogOut} onClick={() => {}} active={false} collapsed={sidebarCollapsed}>Sign Out</SidebarItem>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        {/* Header */}
        <header className="bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="md:hidden mr-2" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              <Menu className="h-4 w-4" />
            </Button>
            <span className="text-xl font-semibold">Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <Input type="search" placeholder="Search here..." className="w-64 mr-4" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  {language} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setLanguage("Eng (US)")}>Eng (US)</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setLanguage("Spanish (ES)")}>Spanish (ES)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {testData.notifications.map((notification, index) => (
                  <DropdownMenuItem key={index}>{notification}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-4 md:p-6">
          <Breadcrumbs items={getBreadcrumbs()} />
          {activeScreen === "dashboard" && (
            <>
              <h2 className="text-2xl font-bold mb-6">Hazard Status</h2>
              {/* Today's Status */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">            
                <StatusCard title="Due to expire 30 days" value="39" change="+5%" color="red" icon={AlertCircle} />
                <StatusCard title="Elapsed" value="456" change="+9%" color="yellow" icon={Clock} />
                <StatusCard title="Complete" value="29" change="+3%" color="green" icon={CheckCircle} />
                <StatusCard title="Incomplete" value="8" change="0.5%" color="purple" icon={XCircle} />
              </div>
              <h2 className="text-2xl font-bold mb-6">Corrective Action Status</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">            
                <StatusCard title="Due to expire 30 days" value="39" change="+5%" color="red" icon={AlertCircle} />
                <StatusCard title="Elapsed" value="728" change="+5%" color="yellow" icon={Clock} />
                <StatusCard title="Complete" value="345" change="+12%" color="green" icon={CheckCircle} />
                <StatusCard title="Incomplete" value="110" change="0.5%" color="purple" icon={XCircle} />
              </div>
              {/* Charts */}
              <div className="grid gap-4 md:grid-cols-2 mb-8">
                <ChartCard title="Hazard Management Insights 2024">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={testData.hazardInsightsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis dataKey="name" stroke="#333" />
                        <YAxis stroke="#333" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Low" stroke="#10b981" />
                        <Line type="monotone" dataKey="Medium" stroke="#8b5cf6" />
                        <Line type="monotone" dataKey="High" stroke="#ef4444" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                <ChartCard title="Hazard & Corrective Actions Resolved">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={testData.actionsResolvedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis dataKey="name" stroke="#333" />
                        <YAxis stroke="#333" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Hazard" fill="#14b8a6" />
                        <Bar dataKey="Corrective Actions" fill="#fbbf24" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </div>

              {/* Top 7 Major Hazards Overdue */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Top 7 Major Hazards Overdue</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[300px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Complete %</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {testData.topHazardsData.map((hazard, i) => (
                        <TableRow key={i}>
                          <TableCell>{hazard.name}</TableCell>
                          <TableCell>
                            <Progress value={hazard.progress} className="w-[60%]" />
                          </TableCell>
                          <TableCell>{hazard.progress}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Corrective Action Trend by Region and Risks */}
              <div className="grid gap-4 md:grid-cols-2">
                <ChartCard title="Corrective Action Trend by Region">
                  <div className="h-[300px]">
                    {/* Placeholder for map component */}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      Map Component Placeholder
                    </div>
                  </div>
                </ChartCard>

                <ChartCard title="Risks">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={testData.risksData2024}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="High" stackId="a" fill="#ef4444" />
                        <Bar dataKey="VeryHigh" stackId="a" fill="#ec4899" />
                        <Line type="monotone" dataKey="mitigated" stroke="#f59e0b" strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center mt-4 space-x-8">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-[#ef4444] mr-2"></div>
                      <span>High: 1,135</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-[#ec4899] mr-2"></div>
                      <span>Very High: 970</span>
                    </div>
                  </div>
                </ChartCard>
              </div>
            </>
          )}
          {activeScreen === "hazard" && <HazardManagementScreen />}
          {activeScreen === "corrective" && <CorrectiveActionScreen />}
        </main>
      </div>
    </div>
  )
}