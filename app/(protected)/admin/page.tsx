"use client";
import RoleGate from "@/components/auth/role.gate";
import FormSuccess from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { admin } from "@/lib/admin";
import React from "react";
import { toast } from "sonner";

const AdminPage = () => {
  const onServerActionClick = () => {
    admin().then((data) => {
      if (data.error) {
        toast.error(data.error);
      }

      if (data.success) {
        toast.success(data.success);
      }
    });
  };
  const onApiRouteClick = () => {
    fetch("/api/admin").then((res) => {
      if (res.ok) {
        toast.success("Allowed Api Route");
      } else {
        toast.error("Forbidden Api Route");
      }
    });
  };
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className=" text-center font-semibold text-2xl">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRoles="ADMIN">
          <FormSuccess message="You are an admin" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPage;
