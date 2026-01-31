"use client";

import React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, Trash2, Eye } from "lucide-react";

interface Resource {
  id: string;
  name: string;
  type: "machines" | "workforce" | "setup_matrix";
  size: string;
  uploadedAt: string;
  updatedAt: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Fetch resources from mock API
    const fetchResources = async () => {
      try {
        const response = await fetch("/api/resources");
        if (response.ok) {
          const data = await response.json();
          setResources(data);
        }
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const response = await fetch("/api/resources/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const newResource = await response.json();
        setResources([...resources, newResource]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (resourceId: string) => {
    try {
      await fetch(`/api/resources/${resourceId}`, { method: "DELETE" });
      setResources(resources.filter((r) => r.id !== resourceId));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      machines: "Machine Inventory",
      workforce: "Workforce & Time",
      setup_matrix: "Setup Cost Matrix",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "machines":
        return "bg-blue-500/10 text-blue-400";
      case "workforce":
        return "bg-purple-500/10 text-purple-400";
      case "setup_matrix":
        return "bg-amber-500/10 text-amber-400";
      default:
        return "bg-gray-500/10 text-gray-400";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Resources</h1>
        <p className="text-muted-foreground mt-1">
          Upload and manage production setup data
        </p>
      </div>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            type: "machines",
            title: "Machine Inventory",
            desc: "Upload machine data",
          },
          {
            type: "workforce",
            title: "Workforce & Time",
            desc: "Upload shifts and breaks",
          },
          {
            type: "setup_matrix",
            title: "Setup Matrices",
            desc: "Upload cost matrices",
          },
        ].map((item) => (
          <Card
            key={item.type}
            className="hover:border-primary/50 transition-colors"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription className="text-xs">{item.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={(e) => handleFileUpload(e, item.type)}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                  disabled={uploading}
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4" />
                    {uploading ? "Uploading..." : "Upload File"}
                  </span>
                </Button>
              </label>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resources List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Resources</CardTitle>
          <CardDescription>Manage your production setup data</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No resources uploaded yet
              </p>
              <p className="text-xs text-muted-foreground">
                Upload CSV or Excel files for machines, workforce, and setup
                matrices
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-card/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(resource.type)}`}
                      >
                        {getTypeLabel(resource.type)}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">
                          {resource.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {resource.size} • Updated {resource.updatedAt}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(resource.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
