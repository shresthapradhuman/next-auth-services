import UserInfo from "@/components/user-info";
import { currentUser } from "@/lib/auth";
import React from "react";

const ServerPage = async () => {
  const user = await currentUser();
  return (
    <div>
      <UserInfo user={user} label="Server Component" />
    </div>
  );
};

export default ServerPage;
