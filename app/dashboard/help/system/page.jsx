"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomToast from "@/components/customtoast";

export default function SystemInfoPage() {
  // Hardcoded values
  const version = "2.4.0";
  const license = "Stream Mikrotik";
  const company = "OceanPhase";

  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "success",
    isVisible: false
  });

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
      isVisible: true
    });

    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 2000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const copyInfo = () => {
    const info = `Version: v${version}\nProduct: ${license}\nCompany: ${company}`;
    navigator.clipboard.writeText(info).then(() => {
      setCopied(true);
      showToast("System info copied", "success");
      
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    }).catch(() => {
      showToast("Failed to copy", "error");
    });
  };

  return (
    <>
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <DashboardLayout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-md mx-auto space-y-8">
            
            {/* Title */}
            <div className="text-center">
              <h1 className="text-2xl font-medium text-foreground mb-1">
                System Information
              </h1>
              <div className="h-px w-16 bg-border mx-auto"></div>
            </div>

            {/* Information */}
            <div className="space-y-6 text-center">
              
              {/* Version */}
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Version
                </div>
                <div className="text-2xl font-bold text-primary">
                  v{version}
                </div>
              </div>

              {/* License */}
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Product
                </div>
                <div className="text-lg font-semibold text-foreground">
                  {license}
                </div>
              </div>

              {/* Company */}
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Licensed by
                </div>
                <div className="text-base text-foreground">
                  {company}
                </div>
              </div>

            </div>

            {/* Copy Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={copyInfo}
                variant="outline"
                size="sm"
              >
                {copied ? "Copied!" : "Copy Information"}
              </Button>
            </div>

          </div>
        </div>
      </DashboardLayout>
    </>
  );
}