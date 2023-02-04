import React, { useEffect } from "react";
import { render, act } from "@testing-library/react";
import RenderComponent from ".";
import ComponentDictionary from "../fields";

let mockMountComponentProps = jest.fn();

const props: any = {
  formState: {
    errors: {},
  },
  field: {
    type: "test",
    name: "my-test-input",
  },
  components: {
    test: (props: any) => {
      useEffect(() => {
        mockMountComponentProps(props);
      }, []);
      return <input type="text" name="test-input" />;
    },
  },
};
describe("RenderComponent", () => {
  beforeEach(() => jest.clearAllMocks());
  it("Should render the correct component", async () => {
    const wrapper = render(<RenderComponent {...props} />);
    await act(() => {
      wrapper.getByRole("textbox");
    });
  });

  it("Should throw a console warning if the component is not found", () => {
    jest.spyOn(global.console, "warn").mockImplementation(() => {});
    const wrapper = render(
      <RenderComponent
        {...props}
        field={{ component: "bogus", name: "my-test-input" }}
      />
    );
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it("It should pass a modified set of props to the found component", async () => {
    render(<RenderComponent {...props} />);
    await act(() => {
      expect(mockMountComponentProps).toHaveBeenCalledTimes(1);
      expect(mockMountComponentProps).toHaveBeenCalledWith({
        formState: props.formState,
        name: props.field.name,
        error: null,
        components: {
          ...ComponentDictionary,
          ...props.components,
        },
      });
    });
  });

  it("It should pass pass an error object to the component if one is found in the formState errors", async () => {
    render(
      <RenderComponent
        {...props}
        formState={{ errors: { "my-test-input": { message: "Test" } } }}
      />
    );
    await act(() => {
      expect(mockMountComponentProps).toHaveBeenCalledTimes(1);
      expect(mockMountComponentProps).toHaveBeenCalledWith({
        formState: {
          errors: {
            "my-test-input": {
              message: "Test",
            },
          },
        },
        name: props.field.name,
        error: { message: "Test" },
        components: {
          ...ComponentDictionary,
          ...props.components,
        },
      });
    });
  });
});
