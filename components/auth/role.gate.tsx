import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import React from "react";
import FormError from "@/components/form-error";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole;
}

const RoleGate = ({ children, allowedRoles }: RoleGateProps) => {
  const role = useCurrentRole();
  if (role !== allowedRoles)
    return <FormError message="You are not allowed to do that" />;
  return <>{children}</>;
};

export default RoleGate;
