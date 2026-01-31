"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface FormData {
  sched_req_name: string;
  request_id: string;
  request_time: string;
  requested_by: string;
  solver_type: string;
  objective: string;
  request_time_iso: string;
  allow_preemption: boolean;
  n_machines: string;
  machine_names: string;
  shift_start: string;
  worker_break_minutes: string;
  allow_weekend: boolean;
  allow_workers_ot: boolean;
  use_global_matrix: boolean;
  fallback_marker: string;
  cost_to_minutes_factor: string;
  override_matrix: string;
  max_runtime_minutes: string;
  target_gap_percent: string;
  enable_warmstart: boolean;
  parallel_threads: string;
}

interface Matrix {
  rows: number[];
}

const parseMatrix = (matrixString: string): Matrix | null => {
  if (!matrixString.trim()) return null;

  try {
    const lines = matrixString.trim().split("\n");
    const rows: number[] = [];

    for (const line of lines) {
      const values = line.split(/[\s,]+/).filter((v) => v);
      if (values.length > 0) {
        for (const val of values) {
          const num = parseFloat(val);
          if (!isNaN(num)) {
            rows.push(num);
          }
        }
      }
    }

    return rows.length > 0 ? { rows } : null;
  } catch {
    return null;
  }
};

export default function CreateRequestPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    sched_req_name: "",
    request_id: `REQ_${Date.now()}`,
    request_time: new Date().toISOString().split("T")[0],
    requested_by: "demo@example.com",
    solver_type: "heuristic",
    objective: "Cmax",
    request_time_iso: new Date().toISOString(),
    allow_preemption: false,
    n_machines: "3",
    machine_names: "CLX450_001,CLX450_002",
    shift_start: "06:00",
    worker_break_minutes: "60",
    allow_weekend: false,
    allow_workers_ot: false,
    use_global_matrix: true,
    fallback_marker: "999",
    cost_to_minutes_factor: "5",
    override_matrix: "0 10 20\n10 0 15\n20 15 0",
    max_runtime_minutes: "60",
    target_gap_percent: "5",
    enable_warmstart: true,
    parallel_threads: "16",
  });

  const payloadPreview = JSON.stringify(
    {
      sched_req_id: formData.request_id,
      SCHED_DATA: {
        sched_req_name: formData.sched_req_name || "New Request",
        sched_req_status: "Pending",
      },
      MODEL: {
        number_of_jobs: 5,
        selected_model: "P3",
        solver_type: formData.solver_type,
        objective: formData.objective,
      },
      MODEL_DATA: {
        job_names: ["WD0013", "WD0014", "WD0015", "WD0016", "WD0017"],
        machine_count: parseInt(formData.n_machines),
        machine_names: formData.machine_names,
      },
    },
    null,
    2,
  );

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to create request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(payloadPreview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-5xl overflow-y-scroll mx-auto h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Create Schedule Request
          </h1>
          <p className="text-muted-foreground mt-1">
            Set up a new optimization request
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className=" space-y-6"
      >
        {/* 1. Basic Request Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Basic Request Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Request Name *</label>
                <Input
                  placeholder="e.g., Weekly Production Schedule"
                  value={formData.sched_req_name}
                  onChange={(e) =>
                    handleInputChange("sched_req_name", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Request ID</label>
                <Input disabled value={formData.request_id} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Requested By</label>
                <Input
                  value={formData.requested_by}
                  onChange={(e) =>
                    handleInputChange("requested_by", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Solver Type</label>
                <Select
                  value={formData.solver_type}
                  onValueChange={(val) => handleInputChange("solver_type", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="heuristic">Heuristic</SelectItem>
                    <SelectItem value="exact">Exact</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Objective</label>
              <Select
                value={formData.objective}
                onValueChange={(val) => handleInputChange("objective", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cmax">Cmax (Makespan)</SelectItem>
                  <SelectItem value="Cost">Cost</SelectItem>
                  <SelectItem value="Tardiness">Tardiness</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.allow_preemption}
                  onCheckedChange={(checked) =>
                    handleInputChange("allow_preemption", checked)
                  }
                />
                <span className="text-sm font-medium">Allow Preemption</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* 2. Machine Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Machine Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Number of Machines
                </label>
                <Input
                  type="number"
                  value={formData.n_machines}
                  onChange={(e) =>
                    handleInputChange("n_machines", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Shift Start</label>
                <Input
                  type="time"
                  value={formData.shift_start}
                  onChange={(e) =>
                    handleInputChange("shift_start", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Machine Names (comma-separated)
              </label>
              <Input
                value={formData.machine_names}
                onChange={(e) =>
                  handleInputChange("machine_names", e.target.value)
                }
                placeholder="CLX450_001,CLX450_002,..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Worker Break Minutes
              </label>
              <Input
                type="number"
                value={formData.worker_break_minutes}
                onChange={(e) =>
                  handleInputChange("worker_break_minutes", e.target.value)
                }
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.allow_weekend}
                  onCheckedChange={(checked) =>
                    handleInputChange("allow_weekend", checked)
                  }
                />
                <span className="text-sm font-medium">Allow Weekend</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.allow_workers_ot}
                  onCheckedChange={(checked) =>
                    handleInputChange("allow_workers_ot", checked)
                  }
                />
                <span className="text-sm font-medium">Allow Overtime</span>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* 3. Setup Matrix Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              3. Setup Matrix Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Cost to Minutes Factor
                </label>
                <Input
                  type="number"
                  value={formData.cost_to_minutes_factor}
                  onChange={(e) =>
                    handleInputChange("cost_to_minutes_factor", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fallback Marker</label>
                <Input
                  value={formData.fallback_marker}
                  onChange={(e) =>
                    handleInputChange("fallback_marker", e.target.value)
                  }
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formData.use_global_matrix}
                    onCheckedChange={(checked) =>
                      handleInputChange("use_global_matrix", checked)
                    }
                  />
                  <span className="text-sm font-medium">Use Global Matrix</span>
                </label>
              </div>
            </div>

            {/* Matrix Input and Preview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Override Matrix (rows comma/space sep)
                </label>
                <textarea
                  value={formData.override_matrix}
                  onChange={(e) =>
                    handleInputChange("override_matrix", e.target.value)
                  }
                  placeholder="0 10 20&#10;10 0 15&#10;20 15 0"
                  className="w-full h-32 p-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Matrix Preview */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Matrix Preview</label>
                <div className="p-4 bg-secondary border border-border rounded-lg h-32 overflow-auto">
                  {formData.override_matrix &&
                  parseMatrix(formData.override_matrix) ? (
                    <div className="space-y-2">
                      {formData.override_matrix.split("\n").map((row, idx) => {
                        const values = row.split(/[\s,]+/).filter((v) => v);
                        return (
                          <div key={idx} className="flex gap-2">
                            {values.map((val, vidx) => (
                              <div
                                key={vidx}
                                className="w-10 h-10 flex items-center justify-center bg-primary/10 border border-primary/30 rounded text-xs font-mono text-foreground"
                              >
                                {val}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                      Matrix preview will appear here
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Advanced Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">4. Advanced Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Max Runtime (minutes)
                </label>
                <Input
                  type="number"
                  value={formData.max_runtime_minutes}
                  onChange={(e) =>
                    handleInputChange("max_runtime_minutes", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Gap (%)</label>
                <Input
                  type="number"
                  value={formData.target_gap_percent}
                  onChange={(e) =>
                    handleInputChange("target_gap_percent", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Parallel Threads</label>
                <Input
                  type="number"
                  value={formData.parallel_threads}
                  onChange={(e) =>
                    handleInputChange("parallel_threads", e.target.value)
                  }
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={formData.enable_warmstart}
                onCheckedChange={(checked) =>
                  handleInputChange("enable_warmstart", checked)
                }
              />
              <span className="text-sm font-medium">Enable Warmstart</span>
            </label>
          </CardContent>
        </Card>

        {/* 5. Request JSON Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">5. Request JSON Preview</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="gap-2 bg-transparent"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary p-4 rounded-lg overflow-auto max-h-64 font-mono text-xs">
              <pre className="text-muted-foreground">{payloadPreview}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <Link href="/dashboard" className="flex-1">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
            >
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            className="flex-1"
            disabled={isLoading || !formData.sched_req_name}
          >
            {isLoading ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  );
}
