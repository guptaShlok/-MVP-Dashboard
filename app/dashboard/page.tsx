"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Plus } from "lucide-react";
import Link from "next/link";

interface Request {
  id: string;
  jobId: string;
  name: string;
  status: "running" | "finished" | "failed";
  duration: string;
  updated: string;
  hasFiles: boolean;
}

export default function DashboardPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [timeRange, setTimeRange] = useState("7");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch requests from mock API
    const fetchRequests = async () => {
      try {
        const response = await fetch(`/api/requests?days=${timeRange}`);
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        }
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [timeRange]);

  const stats = {
    activeJobs: requests.filter((r) => r.status === "running").length,
    avgRuntime: "09:41",
    successRate: "92%",
    computeHours: "128.6 of 180",
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-blue-500/10 text-blue-400";
      case "finished":
        return "bg-green-500/10 text-green-400";
      case "failed":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  const handleDownload = async (requestId: string) => {
    try {
      const response = await fetch(`/api/requests/${requestId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `request-${requestId}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your optimization requests
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 24 hours</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Link href="/dashboard/create-request">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New job
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-green-400 mt-2">+2 vs yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. runtime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRuntime}</div>
            <p className="text-xs text-red-400 mt-2">-12% this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}</div>
            <p className="text-xs text-green-400 mt-2">+3% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Compute hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.computeHours.split(" ")[0]}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.computeHours}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No requests found</p>
              <Link href="/dashboard/create-request">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first request
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Job ID
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Duration
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Updated
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-border hover:bg-card/50"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                        #{request.jobId}
                      </td>
                      <td className="py-3 px-4 font-medium">{request.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {request.duration}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {request.updated}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {request.hasFiles && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(request.id)}
                            className="gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
