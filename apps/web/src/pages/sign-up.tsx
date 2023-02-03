import { useCallback } from "react";
import { Card } from "@jjordy/ui";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { api } from "../lib";

export default function SignUpPage() {
  const { handleSubmit, register } = useForm();
  const signin = useCallback((values: any) => {
    api
      .post("/sign-up", values)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
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
          <form onSubmit={handleSubmit(signin)}>
            <input
              type="email"
              {...register("email")}
              className="border w-full mb-2 text-black"
            />
            <br />
            <input
              type="password"
              {...register("password")}
              className="border w-full mb-2 text-black"
            />
            <button>Submit</button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
