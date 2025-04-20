import React from "react";
import { LoginForm } from "@/components/login";
import { RegisterForm } from "@/components/register";
import Loading from "@/components/loading";
import { supabase } from "@/lib/supabase";
import Dashboard from "@/components/dashboard";

const page = () => {
  return <Dashboard />;
};

export default page;
