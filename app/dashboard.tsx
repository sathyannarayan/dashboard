'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar"
import { Progress } from "./components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts'
import { Bell, AlertOctagon, Search, ChevronDown, Home, LayoutDashboard, AlertTriangle, CheckSquare, MessageSquare, Settings, LogOut, AlertCircle, Clock, CheckCircle, XCircle, Menu, ChevronRight, Sun, Moon } from 'lucide-react'
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
import { Switch } from "./components/ui/switch"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "./components/ui/tooltip"
import { ResponsiveChoropleth } from '@nivo/geo'
import { Feature, FeatureCollection } from 'geojson'
import { scaleThreshold } from 'd3-scale'
import worldCountries from './components/ui/geofeatures.json'

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
    { name: "[AUS][WA]Pasta Plant heat exchanger", progress: Math.floor(Math.random() * 68) + 30, color: "#84b1f9" },
    { name: "[SA][PA]Evaporator unit spillage", progress: Math.floor(Math.random() * 68) + 30, color: "#84b1f9" },
    { name: "[CA][BC]Boiler feed system Rupture", progress: Math.floor(Math.random() * 68) + 30, color: "#84b1f9" },
    { name: "[KY][TX]Mining feeder Electrical", progress: Math.floor(Math.random() * 68) + 30, color: "#84b1f9" },
    { name: "[NY][NJ]Cooling tower fan failure", progress: Math.floor(Math.random() * 68) + 30, color: "#84b1f9" },
    { name: "[UK][LN]Chemical storage tank leak", progress: Math.floor(Math.random() * 68) + 30, color: "#84b1f9" },
    { name: "[JP][TK]Conveyor belt malfunction", progress: Math.floor(Math.random() * 68) + 30, color: "#84b1f9" },
  ];

  const risksData2024 = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    High: Math.floor(Math.random() * 200) + 100,
    VeryHigh: Math.floor(Math.random() * 200) + 100,
    mitigated: Math.floor(Math.random() * 100) + 100,
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

     // New data for Risk Management screen
     riskCategories: ["Strategic", "Operational", "Financial", "Compliance", "Reputational"],
     riskLikelihoods: ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"],
     riskConsequences: ["Insignificant", "Minor", "Moderate", "Major", "Catastrophic"],
     riskTreatmentOptions: ["Avoid", "Reduce", "Share", "Retain"],
     riskOwners: ["Operations Manager", "Finance Director", "HR Manager", "IT Manager", "Legal Counsel"],
     riskReviewFrequencies: ["Monthly", "Quarterly", "Semi-Annually", "Annually"],
     riskTypes: ["Financial", "Operational", "Strategic", "Compliance", "Reputational"],
     riskSeverities: ["Low", "Medium", "High", "Critical"],
     riskStatuses: ["Open", "In Progress", "Closed", "Under Review"],
     associatedRisks: ["Risk A", "Risk B", "Risk C", "Risk D", "Risk E"],
     plantLocations: ["Australia", "Peru", "Canada", "Chile", "Africa"],
     plantAreas: ["KW01-CrushingFacility02", "KW01-PelletizingArea", "KW01-GrindingMill", "KW01-ConcentrationArea"],
     assets: ["KW-Battery987", "KW-BoilerFeed98", "KW-BoilerDrum987", "KW-FuelGasLine"],
     riskRatings: ["Very High", "High", "Medium", "Low"],
  };

  const choroplethData = [
    { id: "CAN", value: Math.floor(Math.random() * 400) + 600 },
    { id: "AUS", value: Math.floor(Math.random() * 400) + 600 },
    { id: "BRA", value: Math.floor(Math.random() * 400) + 600 },
    { id: "PER", value: Math.floor(Math.random() * 400) + 600 },
    { id: "RUS", value: Math.floor(Math.random() * 400) + 600 },
  ];

  const colorScale = scaleThreshold<number, string>()
    .domain([1])
    .range(["#FFFFFF", "#3357FF"])

  const geoData: Feature[] = (worldCountries as FeatureCollection).features;

  const hazardStatus = [
    { title: "Due to expire 30 days", value: Math.floor(Math.random() * 100).toString(), change: `${Math.floor(Math.random() * 10)}%`, color: "red" as const, icon: AlertCircle },
    { title: "Elapsed", value: Math.floor(Math.random() * 1000).toString(), change: `${Math.floor(Math.random() * 10)}%`, color: "yellow" as const, icon: Clock },
    { title: "Complete", value: Math.floor(Math.random() * 100).toString(), change: `${Math.floor(Math.random() * 10)}%`, color: "green" as const, icon: CheckCircle },
    { title: "Incomplete", value: Math.floor(Math.random() * 50).toString(), change: `${Math.floor(Math.random() * 10)}%`, color: "purple" as const, icon: XCircle },
  ];

  const correctiveActionStatus = [
    { title: "Due to expire 30 days", value: Math.floor(Math.random() * 100).toString(), change: `${Math.floor(Math.random() * 10)}%`, color: "red" as const, icon: AlertCircle },
    { title: "Elapsed", value: Math.floor(Math.random() * 1000).toString(), change: `${Math.floor(Math.random() * 10)}%`, color: "yellow" as const, icon: Clock },
    { title: "Complete", value: Math.floor(Math.random() * 500).toString(), change: `${Math.floor(Math.random() * 10)}%`, color: "green" as const, icon: CheckCircle },
    { title: "Incomplete", value: Math.floor(Math.random() * 200).toString(), change: `${Math.floor(Math.random() * 10)}%`, color: "purple" as const, icon: XCircle },
  ];

  return {
    notifications,
    hazardInsightsData,
    actionsResolvedData,
    topHazardsData,
    risksData2024,
    sampleDropdownData,
    choroplethData,
    colorScale,
    geoData,
    hazardStatus,
    correctiveActionStatus,
  };
};

interface ChoroplethData {
  id: string
  value: number
}

interface StatusCardProps {
  title: string;
  value: string;
  change: string;
  color: 'red' | 'yellow' | 'green' | 'purple';
  icon: React.ElementType;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, change, color, icon: Icon }) => {
  const bgColorClass = {
    red: 'bg-red-50 dark:bg-red-900',
    yellow: 'bg-yellow-50 dark:bg-yellow-900',
    green: 'bg-green-50 dark:bg-green-900',
    purple: 'bg-purple-50 dark:bg-purple-900',
  }[color]

  const textColorClass = {
    red: 'text-red-500 dark:text-red-400',
    yellow: 'text-yellow-500 dark:text-yellow-400',
    green: 'text-green-500 dark:text-green-400',
    purple: 'text-purple-500 dark:text-purple-400',
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
    className={`w-full justify-start text-white ${active ? 'bg-indigo-700 dark:bg-gray-700' : ''} ${
      collapsed ? 'px-2' : 'px-4'
    }`}
    onClick={onClick}
  >
    <Icon className={`h-5 w-5 ${collapsed ? 'mr-0' : 'mr-2'}`} />
    {!collapsed && <span>{children}</span>}
  </Button>
)

const Breadcrumbs: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
    {items.map((item, index) => (
      <React.Fragment key={index}>
        {index > 0 && <ChevronRight className="h-4 w-4" />}
        <span>{item}</span>
      </React.Fragment>
    ))}
  </div>
)

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Card className="h-full dark:bg-gray-800">
    <CardHeader>
      <CardTitle className="text-lg font-semibold break-words dark:text-white">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      {children}
    </CardContent>
  </Card>
)
/*
const RiskManagementScreen: React.FC<{ sampleDropdownData: any }> = ({ sampleDropdownData }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold dark:text-white">Risk Management</h2>
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="dark:text-white">Create Risk</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="riskNumber" className="dark:text-white">Risk Number</Label>
            <Input id="riskNumber" placeholder="Enter risk number" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="riskName" className="dark:text-white">Risk Name</Label>
            <Input id="riskName" placeholder="Enter risk name" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="riskDescription" className="dark:text-white">Risk Description</Label>
            <Textarea id="riskDescription" placeholder="Enter risk description" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="site" className="dark:text-white">Site</Label>
            <Select>
              <SelectTrigger id="site" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.sites.map((site: string) => (
                  <SelectItem key={site} value={site}>{site}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="operationCenter" className="dark:text-white">Operation Center</Label>
            <Select>
              <SelectTrigger id="operationCenter" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select operation center" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.operationCenters.map((center: string) => (
                  <SelectItem key={center} value={center}>{center}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="facilities" className="dark:text-white">Facilities</Label>
            <Select>
              <SelectTrigger id="facilities" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select facilities" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.facilities.map((facility: string) => (
                  <SelectItem key={facility} value={facility}>{facility}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="riskCategory" className="dark:text-white">Risk Category</Label>
            <Select>
              <SelectTrigger id="riskCategory" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select risk category" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.riskCategories.map((category: string) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="riskLikelihood" className="dark:text-white">Risk Likelihood</Label>
            <Select>
              <SelectTrigger id="riskLikelihood" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select risk likelihood" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.riskLikelihoods.map((likelihood: string) => (
                  <SelectItem key={likelihood} value={likelihood}>{likelihood}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="riskConsequence" className="dark:text-white">Risk Consequence</Label>
            <Select>
              <SelectTrigger id="riskConsequence" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select risk consequence" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.riskConsequences.map((consequence: string) => (
                  <SelectItem key={consequence} value={consequence}>{consequence}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="riskTreatment" className="dark:text-white">Risk Treatment Option</Label>
            <Select>
              <SelectTrigger id="riskTreatment" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select risk treatment option" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.riskTreatmentOptions.map((option: string) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="riskOwner" className="dark:text-white">Risk Owner</Label>
            <Select>
              <SelectTrigger id="riskOwner" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select risk owner" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.riskOwners.map((owner: string) => (
                  <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="riskReviewFrequency" className="dark:text-white">Risk Review Frequency</Label>
            <Select>
              <SelectTrigger id="riskReviewFrequency" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select review frequency" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.riskReviewFrequencies.map((frequency: string) => (
                  <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="riskStatus" className="dark:text-white">Risk Status</Label>
            <Select>
              <SelectTrigger id="riskStatus" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select risk status" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.riskStatuses.map((status: string) => 
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" className="dark:bg-gray-700 dark:text-white">Cancel</Button>
            <Button>Submit</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)*/


const RiskManagementScreen: React.FC<{ sampleDropdownData: any }> = ({ sampleDropdownData }) => {
  const [plannedCompletionDate, setPlannedCompletionDate] = useState<string>("")
  const [plannedResolutionDate, setPlannedResolutionDate] = useState<string>("")

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold dark:text-white">Risk Management</h2>
      
      {/* Risk Register Details */}
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Risk Register Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="riskRegisterId" className="dark:text-white">Risk Register ID Number</Label>
            <div className="relative flex-grow">
              <Input id="riskRegisterId" value="32-RR-1191" readOnly className="pr-8 dark:bg-gray-700 dark:text-white" />             
            </div>
          </div>
          
          <div>
            <Label className="dark:text-white">Risk Rating</Label>
            <RadioGroup defaultValue="medium" className="flex space-x-4">
              {sampleDropdownData.riskRatings.map((rating:string) => (
                <div key={rating} className="flex items-center space-x-2">
                  <RadioGroupItem value={rating.toLowerCase()} id={`rating-${rating.toLowerCase()}`} />
                  <Label htmlFor={`rating-${rating.toLowerCase()}`}>{rating}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plantLocation" className="dark:text-white">Plant location</Label>
              <Select>
                <SelectTrigger id="plantLocation" className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select options" />
                </SelectTrigger>
                <SelectContent>
                  {sampleDropdownData.plantLocations.map((location: string) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="operationCenter" className="dark:text-white">Operation Center</Label>
              <Select>
                <SelectTrigger id="operationCenter" className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select options" />
                </SelectTrigger>
                <SelectContent>
                  {sampleDropdownData.operationCenters.map((center: string) => (
                    <SelectItem key={center} value={center}>{center}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plantArea" className="dark:text-white">Plant Area</Label>
              <Select>
                <SelectTrigger id="plantArea" className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select Plant Area" />
                </SelectTrigger>
                <SelectContent>
                  {sampleDropdownData.plantAreas.map((area: string) => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assets" className="dark:text-white">Assets</Label>
              <Select>
                <SelectTrigger id="assets" className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select assets" />
                </SelectTrigger>
                <SelectContent>
                  {sampleDropdownData.assets.map((asset: string) => (
                    <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="plannedCompletion" className="dark:text-white">Planned Completion</Label>
            <div className="flex">
              <Input
                type="date"
                id="plannedCompletion"
                value={plannedCompletionDate}
                onChange={(e) => setPlannedCompletionDate(e.target.value)}
                className="dark:bg-gray-700 dark:text-white"
              />
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => setPlannedCompletionDate("")}
              >
                Clear
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="plantAreaDescription" className="dark:text-white">Plant Area description</Label>
            <Textarea id="plantAreaDescription" placeholder="Add plant area description" className="dark:bg-gray-700 dark:text-white" />
          </div>
          
          <div>
            <Label htmlFor="riskDescription" className="dark:text-white">Risk Description</Label>
            <Textarea id="riskDescription" placeholder="Add risk description" className="dark:bg-gray-700 dark:text-white" />
          </div>
        </CardContent>
      </Card>

      {/* Un-mitigated Risk Evaluation */}
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Un-mitigated Risk Evaluation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="riskTypes" className="dark:text-white">Risk Types</Label>
              <Select>
                <SelectTrigger id="riskTypes" className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select Risk types" />
                </SelectTrigger>
                <SelectContent>
                  {sampleDropdownData.riskTypes.map((type: string) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="riskSeverity" className="dark:text-white">Risk Severity</Label>
              <Select>
                <SelectTrigger id="riskSeverity" className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select Risk severity" />
                </SelectTrigger>
                <SelectContent>
                  {sampleDropdownData.riskSeverities.map((severity: string) => (
                    <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="monitoringInspection" className="dark:text-white">Monitoring and Inspection evaluation</Label>
            <Textarea id="monitoringInspection" placeholder="Add monitoring and inspection comments" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="regulatoryRequirements" className="dark:text-white">Regulatory Requirements (If Any)</Label>
            <Textarea id="regulatoryRequirements" placeholder="Add regulatory requirements comments" className="dark:bg-gray-700 dark:text-white" />
          </div>
        </CardContent>
      </Card>

      {/* Mitigated Risk Assessments */}
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Mitigated Risk Assessments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="correctiveActionStatus" className="dark:text-white">Status of corrective actions of risk</Label>
              <Select>
                <SelectTrigger id="correctiveActionStatus" className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select Risk status" />
                </SelectTrigger>
                <SelectContent>
                  {sampleDropdownData.riskStatuses.map((status: string) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="mitigatedRiskSeverity" className="dark:text-white">Risk Severity</Label>
              <Select>
                <SelectTrigger id="mitigatedRiskSeverity" className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select Risk types" />
                </SelectTrigger>
                <SelectContent>
                  {sampleDropdownData.riskTypes.map((type: string) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="correctiveActionId" className="dark:text-white">Corrective Action ID</Label>
            <Input id="correctiveActionId" placeholder="Search project ID" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="residualRiskAssessment" className="dark:text-white">Residual Risk Assessment</Label>
            <Textarea id="residualRiskAssessment" placeholder="Add assessment comments" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="complianceStandards" className="dark:text-white">Compliance with Standards and Regulations</Label>
            <Textarea id="complianceStandards" placeholder="Add assessment comments" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label className="dark:text-white">Upload Risk Assessment Report</Label>
            <div className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">Click to Upload or drag and drop</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">(Max. File size: 25 MB)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Risk Plan */}
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Target Risk Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assignedTo" className="dark:text-white">Assigned To</Label>
              <Select>
                <SelectTrigger id="assignedTo" className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select Risk status" />
                </SelectTrigger>
                <SelectContent>
                  {sampleDropdownData.riskStatuses.map((status: string) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="associatedParentRisk" className="dark:text-white">Associated Parent Risk</Label>
              <Select>
                <SelectTrigger id="associatedParentRisk" className="dark:bg-gray-700 dark:text-white">
                  <SelectValue placeholder="Select associated risk" />
                </SelectTrigger>
                <SelectContent>
                  {sampleDropdownData.associatedRisks.map((risk: string) => (
                    <SelectItem key={risk} value={risk}>{risk}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="specificActions" className="dark:text-white">Specific Actions to be taken</Label>
            <Textarea id="specificActions" placeholder="Add assessment comments" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="auditObservations" className="dark:text-white">Audit Observations:</Label>
            <Textarea id="auditObservations" placeholder="Add assessment comments" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="plannedResolution" className="dark:text-white">Planned Time to Resolution</Label>
            <Input id="plannedResolutionDate" type="date" className="dark:bg-gray-700 dark:text-white" />           
          </div>
        </CardContent>
      </Card> 
      <div className="flex justify-end space-x-4">
            <Button variant="outline" className="dark:bg-gray-700 dark:text-white">Cancel</Button>
            <Button>Submit</Button>
     </div>
    </div>
  )
}

const HazardManagementScreen: React.FC<{ sampleDropdownData: any }> = ({ sampleDropdownData }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold dark:text-white">Hazard Management</h2>
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="dark:text-white">Create Hazard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="copyHazard" className="dark:text-white">Copy Hazard from</Label>
            <Input id="copyHazard" placeholder="Search Hazard number" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="hazardId" className="dark:text-white">Hazard Management ID Number</Label>
            <Input id="hazardId" placeholder="32-HM-1191" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label className="dark:text-white">Priority</Label>
            <RadioGroup defaultValue="medium">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="veryHigh" id="veryHigh" />
                <Label htmlFor="veryHigh" className="dark:text-white">Very High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="dark:text-white">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="dark:text-white">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="dark:text-white">Low</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="site" className="dark:text-white">Site</Label>
            <Select>
              <SelectTrigger id="site" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent>
                
                {sampleDropdownData.sites.map((site: string) => (
                  <SelectItem key={site} value={site}>{site}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="operationCenter" className="dark:text-white">Operation Center</Label>
            <Select>
              <SelectTrigger id="operationCenter" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select operation center" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.operationCenters.map((center: string) => (
                  <SelectItem key={center} value={center}>{center}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="facilities" className="dark:text-white">Facilities</Label>
            <Select>
              <SelectTrigger id="facilities" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select facilities" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.facilities.map((facility: string) => (
                  <SelectItem key={facility} value={facility}>{facility}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="unitType" className="dark:text-white">Unit type</Label>
            <Select>
              <SelectTrigger id="unitType" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select unit type" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.unitTypes.map((type: string) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="approvalDate" className="dark:text-white">Approval Date</Label>
            <Input id="approvalDate" type="date" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="plannedCompletionDate" className="dark:text-white">Planned completion date</Label>
            <Input id="plannedCompletionDate" type="date" className="dark:bg-gray-700  dark:text-white" />
          </div>
          <div>
            <Label htmlFor="hazardClass" className="dark:text-white">Hazard Class</Label>
            <Select>
              <SelectTrigger id="hazardClass" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select hazard class" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.hazardClasses.map((hazardClass: string) => (
                  <SelectItem key={hazardClass} value={hazardClass}>{hazardClass}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="assignTo" className="dark:text-white">Assign to</Label>
            <Select>
              <SelectTrigger id="assignTo" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.engineers.map((engineer: string) => (
                  <SelectItem key={engineer} value={engineer}>{engineer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="riskClass" className="dark:text-white">Risk Class</Label>
            <Select>
              <SelectTrigger id="riskClass" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select risk class" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.riskClasses.map((riskClass: string) => (
                  <SelectItem key={riskClass} value={riskClass}>{riskClass}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="hazardWorkflowStatus" className="dark:text-white">Hazard Workflow status</Label>
            <Select>
              <SelectTrigger id="hazardWorkflowStatus" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select workflow status" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.workflowStatuses.map((status: string) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="comments" className="dark:text-white">Comments</Label>
            <Textarea id="comments" placeholder="Add additional comments" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="assetList" className="dark:text-white">Asset List</Label>
            <Input id="assetList" placeholder="Add Asset Id" className="dark:bg-gray-700 dark:text-white" />
            <div className="mt-2 dark:text-white">
              <div>Boiler-01-Kiwana-117</div>
              <div>Milling-08-Kiwana-217</div>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" className="dark:bg-gray-700 dark:text-white">Cancel</Button>
            <Button>Submit</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

const CorrectiveActionScreen: React.FC<{ sampleDropdownData: any }> = ({ sampleDropdownData }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold dark:text-white">Corrective Actions</h2>
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="dark:text-white">Create Corrective Action</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="dark:text-white">Title</Label>
            <Input id="title" placeholder="Enter corrective action title" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="correctiveActionId" className="dark:text-white">Corrective Action ID Number</Label>
            <Input id="correctiveActionId" placeholder="32-CA-1191" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label  className="dark:text-white">Priority</Label>
            <RadioGroup defaultValue="medium">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="veryHigh" id="caVeryHigh" />
                <Label htmlFor="caVeryHigh" className="dark:text-white">Very High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="caHigh" />
                <Label htmlFor="caHigh" className="dark:text-white">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="caMedium" />
                <Label htmlFor="caMedium" className="dark:text-white">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="caLow" />
                <Label htmlFor="caLow" className="dark:text-white">Low</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="caSite" className="dark:text-white">Site</Label>
            <Select>
              <SelectTrigger id="caSite" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.sites.map((site: string) => (
                  <SelectItem key={site} value={site}>{site}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="caOperationCenter" className="dark:text-white">Operation Center</Label>
            <Select>
              <SelectTrigger id="caOperationCenter" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select operation center" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.operationCenters.map((center: string) => (
                  <SelectItem key={center} value={center}>{center}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="caFacilities" className="dark:text-white">Facilities</Label>
            <Select>
              <SelectTrigger id="caFacilities" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select facilities" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.facilities.map((facility: string) => (
                  <SelectItem key={facility} value={facility}>{facility}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sources" className="dark:text-white">Sources</Label>
            <Select>
              <SelectTrigger id="sources" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select sources" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.sources.map((source: string) => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="plannedCompletion" className="dark:text-white">Planned Completion</Label>
            <Input id="plannedCompletion" type="date" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="actualCompletion" className="dark:text-white">Actual Completion</Label>
            <Input id="actualCompletion" type="date" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="engineeringStandard" className="dark:text-white">Engineering Standard</Label>
            <Select>
              <SelectTrigger id="engineeringStandard" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select engineering standard" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.engineeringStandards.map((standard: string) => (
                  <SelectItem key={standard} value={standard}>{standard}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="caAssignTo" className="dark:text-white">Assign to</Label>
            <Select>
              <SelectTrigger id="caAssignTo" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.engineers.map((engineer: string) => (
                  <SelectItem key={engineer} value={engineer}>{engineer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="regionalAssetIntegrityEngineer" className="dark:text-white">Regional Asset Integrity Engineer</Label>
            <Select>
              <SelectTrigger id="regionalAssetIntegrityEngineer" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select engineer" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.engineers.map((engineer: string) => (
                  <SelectItem key={engineer} value={engineer}>{engineer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="maintenanceReliabilityEngineer" className="dark:text-white">Maintenance and Reliability Engineer</Label>
            <Select>
              <SelectTrigger id="maintenanceReliabilityEngineer" className="dark:bg-gray-700 dark:text-white">
                <SelectValue placeholder="Select engineer" />
              </SelectTrigger>
              <SelectContent>
                {sampleDropdownData.engineers.map((engineer: string) => (
                  <SelectItem key={engineer} value={engineer}>{engineer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="caComments" className="dark:text-white">Comments</Label>
            <Textarea id="caComments" placeholder="Add additional comments" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="purchaseOrder" className="dark:text-white">Purchase Order</Label>
            <Input id="purchaseOrder" placeholder="Search purchase order" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="workOrder" className="dark:text-white">Work Order</Label>
            <Input id="workOrder" placeholder="Search work order" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="capitalProjectId" className="dark:text-white">Capital Project ID</Label>
            <Input id="capitalProjectId" placeholder="Search project ID" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <Label htmlFor="hazardManagementId" className="dark:text-white">Hazard Management ID number</Label>
            <Input id="hazardManagementId" placeholder="Search hazard management ID" className="dark:bg-gray-700 dark:text-white" />
          </div>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" className="dark:bg-gray-700 dark:text-white">Cancel</Button>
            <Button>Submit</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

const SettingsScreen: React.FC<{
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;
}> = ({ refreshInterval, setRefreshInterval }) => {
  const [tempInterval, setTempInterval] = useState(refreshInterval.toString())

  const handleSave = () => {
    const newInterval = parseInt(tempInterval, 10)
    if (!isNaN(newInterval) && newInterval > 0) {
      setRefreshInterval(newInterval)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold dark:text-white">Settings</h2>
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Dashboard Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="refreshInterval" className="dark:text-white">Refresh Interval (seconds)</Label>
              <Input
                id="refreshInterval"
                type="number"
                value={tempInterval}
                onChange={(e) => setTempInterval(e.target.value)}
                className="dark:bg-gray-700 dark:text-white mt-1"
              />
            </div>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [language, setLanguage] = useState("Eng (US)")
  const [activeScreen, setActiveScreen] = useState("dashboard")
  const [isMobile, setIsMobile] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(5)
  const [testData, setTestData] = useState<ReturnType<typeof generateTestData> | null>(null)

  const regenerateTestData = useCallback(() => {
    setTestData(generateTestData())
  }, [])

  useEffect(() => {
    // Generate initial test data on the client side
    regenerateTestData()
  }, [regenerateTestData])

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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  useEffect(() => {
    const intervalId = setInterval(() => {
      regenerateTestData()
    }, refreshInterval * 1000)

    return () => clearInterval(intervalId)
  }, [refreshInterval, regenerateTestData])

  const getBreadcrumbs = () => {
    switch (activeScreen) {
      case "hazard":
        return ["Home", "Hazard Management"]
      case "corrective":
        return ["Home", "Corrective Actions"]
      case "settings":
        return ["Home", "Settings"]
      case "risk":
          return ["Home", "Risk Management"]
      default:
        return ["Home", "Dashboard"]
    }
  }

  // Add a loading state while waiting for client-side data generation
  if (!testData) {
    return <div>Loading...</div>
  }

  return (
    <TooltipProvider>
      <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
        {/* Sidebar */}
        <aside className={`flex flex-col bg-indigo-600 dark:bg-gray-800 p-4 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <div className="flex items-center mb-8 justify-between">
            <div className={`rounded-lg bg-white dark:bg-gray-700 p-2 ${sidebarCollapsed ? 'mr-0' : 'mr-2'}`}>
              <span className="text-indigo-600 dark:text-white font-bold">CY</span>
            </div>
            {!sidebarCollapsed && <span className="text-2xl font-bold text-white">CYIENT</span>}
            <Button variant="ghost" size="sm" className="text-white" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
          <nav className="space-y-2 flex-grow">
            <SidebarItem icon={LayoutDashboard} onClick={() => setActiveScreen("dashboard")} active={activeScreen === "dashboard"} collapsed={sidebarCollapsed}>Dashboard</SidebarItem>
            <SidebarItem icon={Home} onClick={() => setActiveScreen("home")} active={activeScreen === "home"} collapsed={sidebarCollapsed}>Home</SidebarItem>
            <SidebarItem icon={AlertOctagon} onClick={() => setActiveScreen("risk")} active={activeScreen === "risk"} collapsed={sidebarCollapsed}>Risk Management</SidebarItem>
            <SidebarItem icon={AlertTriangle} onClick={() => setActiveScreen("hazard")} active={activeScreen === "hazard"} collapsed={sidebarCollapsed}>Hazard Management</SidebarItem>
            <SidebarItem icon={CheckSquare} onClick={() => setActiveScreen("corrective")} active={activeScreen === "corrective"} collapsed={sidebarCollapsed}>Corrective Actions</SidebarItem>
            <SidebarItem icon={MessageSquare} onClick={() => setActiveScreen("messages")} active={activeScreen === "messages"} collapsed={sidebarCollapsed}>Messages</SidebarItem>
            <SidebarItem icon={Settings} onClick={() => setActiveScreen("settings")} active={activeScreen === "settings"} collapsed={sidebarCollapsed}>Settings</SidebarItem>
          </nav>
          <SidebarItem icon={LogOut} onClick={() => console.log("Sign Out")} active={false} collapsed={sidebarCollapsed}>Sign Out</SidebarItem>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl font-semibold dark:text-white">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Input type="search" placeholder="Search here..." className="w-64 mr-4 dark:bg-gray-700 dark:text-white" />
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
                  {testData.notifications.map((notification: string, index: number) => (
                    <DropdownMenuItem key={index}>{notification}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Light mode</p>
                  </TooltipContent>
                </Tooltip>
                <Switch
                  id="theme-toggle"
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Dark mode</p>
                  </TooltipContent>
                </Tooltip>
                <span className="sr-only">Toggle theme</span>
              </div>
              <Avatar>
                <AvatarImage src="https://cdn.prod.website-files.com/6365d860c7b7a7191055eb8a/65a752b920056b81613ea881_Olly%20Schroeder-p-500.jpg" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Dashboard content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900 p-6">
            <Breadcrumbs items={getBreadcrumbs()} />
            {activeScreen === "dashboard" && (
              <>
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Hazard Status</h2>
                {/* Today's Status */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">            
                  {testData.hazardStatus.map((status, index) => (
                    <StatusCard key={index} {...status} />
                  ))}
                </div>
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Corrective Action Status</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">            
                  {testData.correctiveActionStatus.map((status, index) => (
                    <StatusCard key={index} {...status} />
                  ))}
                </div>
                {/* Charts */}
                <div className="grid gap-4 md:grid-cols-2 mb-8">
                  <ChartCard title="Hazard Management Insights 2024">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={testData.hazardInsightsData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#4a5568" : "#e5e5e5"} />
                          <XAxis dataKey="name" stroke={isDarkMode ? "#a0aec0" : "#333"} />
                          <YAxis stroke={isDarkMode ? "#a0aec0" : "#333"} />
                          <RechartsTooltip contentStyle={isDarkMode ? { backgroundColor: '#2d3748', border: 'none' } : {}} />
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
                          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#4a5568" : "#e5e5e5"} />
                          <XAxis dataKey="name" stroke={isDarkMode ? "#a0aec0" : "#333"} />
                          <YAxis stroke={isDarkMode ? "#a0aec0" : "#333"} />
                          <RechartsTooltip contentStyle={isDarkMode ? { backgroundColor: '#2d3748', border: 'none' } : {}} />
                          <Legend />
                          <Bar dataKey="Hazard" fill="#14b8a6" />
                          <Bar dataKey="Corrective Actions" fill="#fbbf24" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>
                </div>

                {/* Top 7 Major Hazards Overdue */}
                <Card className="mb-8 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Top 7 Major Hazards Overdue</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="dark:text-gray-400">Name</TableHead>
                          <TableHead className="dark:text-gray-400">Progress</TableHead>
                          <TableHead className="dark:text-gray-400">Complete %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {testData.topHazardsData.map((hazard, i) => (
                          <TableRow key={i}>
                            <TableCell className="dark:text-white">{hazard.name}</TableCell>
                            <TableCell>
                              <div className="w-[60%] bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${hazard.progress}%` }}
                                ></div>
                              </div>
                            </TableCell>
                            <TableCell className="dark:text-white">{hazard.progress}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Corrective Action Trend by Region and Risks */}
                <div className="grid gap-4 md:grid-cols-2">
                  <ChartCard title="Corrective Action Trend by Region">
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ResponsiveChoropleth
                          data={testData.choroplethData}
                          features={testData.geoData}
                          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                          colors={testData.colorScale}
                          domain={[0, 1000]}
                          unknownColor="#ffffff"
                          label="properties.name"
                          valueFormat=".0f"
                          projectionScale={100}
                          projectionTranslation={[0.5, 0.7]}
                          projectionRotation={[0, 0, 0]}
                          enableGraticule={false}
                          borderWidth={1.0}
                          borderColor="#000000"
                          tooltip={({ feature }: { feature: Feature }) => {
                            const countryData = testData.choroplethData.find(d => d.id === feature.id)
                            if (countryData) {
                              return (
                                <div
                                  style={{
                                    background: isDarkMode ? '#2d3748' : 'white',
                                    color: isDarkMode ? 'white' : 'black',
                                    padding: '9px 12px',
                                    border: '1px solid #ccc',
                                  }}
                                >
                                  <strong>{feature.properties?.name}</strong>
                                  <br />
                                  No of CAs: {countryData.value}
                                </div>
                              )
                            }
                            return null
                          }}
                          theme={{
                            background: isDarkMode ? "#1a202c" : "#ffffff",
                            text: {
                              fontSize: 11,
                              fill: isDarkMode ? "#a0aec0" : "#333333",
                            },
                          }}
                        />
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>

                  <ChartCard title="Risks 2024">
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={testData.risksData2024}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#4a5568" : "#e5e5e5"} />
                          <XAxis dataKey="month" stroke={isDarkMode ? "#a0aec0" : "#333"} />
                          <YAxis stroke={isDarkMode ? "#a0aec0" : "#333"} />
                          <RechartsTooltip contentStyle={isDarkMode ? { backgroundColor: '#2d3748', border: 'none' } : {}} />
                          <Legend />
                          <Bar dataKey="High" fill="#ef4444" />
                          <Bar dataKey="VeryHigh" fill="#f97316" />
                          <Line type="monotone" dataKey="mitigated" stroke="#10b981" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartCard>
                </div>
              </>
            )}
            {activeScreen === "risk" && <RiskManagementScreen sampleDropdownData={testData.sampleDropdownData} />}            
            {activeScreen === "hazard" && <HazardManagementScreen sampleDropdownData={testData.sampleDropdownData} />}
            {activeScreen === "corrective" && <CorrectiveActionScreen sampleDropdownData={testData.sampleDropdownData} />}
            {activeScreen === "settings" && (
              <SettingsScreen
                refreshInterval={refreshInterval}
                setRefreshInterval={setRefreshInterval}
              />
            )}
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}