"use client";
import UserInfo from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

import React from "react";

const ClientPage = () => {
  const user = useCurrentUser();
  return (
    <div>
      <UserInfo user={user} label="Client Component" />
    </div>
  );
};

export default ClientPage;
