import Layout from "@/components/Layout";
import useAuth from "@/hooks/useAuth";
import Dashboard from "@/features/dashboard";

export default function IndexPage() {
  const { user } = useAuth();
  const unauthenticatedContent = <>Welcome to ticket desk</>;
  return <Layout>{user ? <Dashboard /> : unauthenticatedContent}</Layout>;
}
