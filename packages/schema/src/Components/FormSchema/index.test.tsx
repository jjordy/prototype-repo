import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  cleanup,
  act
} from "@testing-library/react";
import { FormSchema } from ".";
import { JSONFormSchema } from "../../types";
import { UseFormReturn } from "react-hook-form";

const schema: JSONFormSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  properties: {
    firstName: {
      type: "string",
      title: "First Name"
    },
    lastName: {
      type: "string",
      title: "Last Name"
    }
  }
};
const props = {
  schema,
  name: "my-test-form",
  onSubmit: jest.fn(),
  defaultValues: {
    firstName: "",
    lastName: ""
  }
};
describe("Basic Form Schema", () => {
  it("should render the form", async () => {
    const wrapper = render(<FormSchema {...props} />);
    await act(() => {
      wrapper.getByRole("form");
    });
  });

  it("should pass a className to the underlying form element", async () => {
    expect.assertions(1);
    const wrapper = render(<FormSchema {...props} className="test" />);
    await act(() => {
      const form = wrapper.getByRole("form");
      expect(form.className).toEqual("test");
    });
  });

  it("should render the correct fields", async () => {
    expect.assertions(4);
    const wrapper = render(<FormSchema {...props} />);
    const test = await wrapper.findAllByRole("textbox");
    expect(test.length).toEqual(2);
    const firstInput = test[0] as HTMLInputElement;
    const secondInput = test[1] as HTMLInputElement;
    expect(firstInput.name).toEqual("firstName");
    expect(secondInput.name).toEqual("lastName");
    expect(firstInput.id).toEqual("id_firstName");
  });

  it("Should render its children as a function and provide the useForm response", async () => {
    const mockChildFn = jest.fn();
    const wrapper = render(<FormSchema {...props} children={mockChildFn} />);
    await act(() => {
      expect(mockChildFn).toHaveBeenCalledTimes(1);
    });
  });
});
