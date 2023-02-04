import Layout from "@/components/Layout";
import { parseCookies } from "@/lib/auth";
import { NextPageContext } from "next";
import client from "@jjordy/data";

export default function IndexPage() {
  return <Layout>Home Page</Layout>;
}

export async function getServerSideProps(ctx: NextPageContext) {
  const { headers = {} } = ctx?.req || {};
  const cookies = parseCookies(headers);
  console.log(cookies);
  return {
    props: {},
  };
}
