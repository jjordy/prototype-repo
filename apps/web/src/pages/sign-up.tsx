import { Card } from "@jjordy/ui";
import Layout from "../components/Layout";

export default function IndexPage() {
  return (
    <Layout>
      <div className="flex justify-center items-center">
        <Card className="max-w-2xl">
          <h1 className="text-4xl tracking-wide">Sign up</h1>
          <hr className="my-4" />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel quo eum
            tempore aut nostrum eligendi repellat tenetur quis, autem,
            voluptatum fugiat rerum facere quibusdam, in cum deleniti nobis.
            Quae, ipsam!
          </p>
        </Card>
      </div>
    </Layout>
  );
}
