import {
  DefaultAddRowButton,
  DefaultRemoveRowButton,
  DefaultRowRenderer,
  DefaultSubmitButton,
  DefaultArrayErrorMsg,
  DefaultArrayTitle,
  DefaultRowContainer,
} from "../Components/fields/DefaultControls";

export default function useControls({ uiSchema }: any) {
  let controls = {};
  uiSchema?.controls ? (controls = { ...uiSchema.controls }) : {};
  return {
    RowRenderer: DefaultRowRenderer,
    AddRowButton: DefaultAddRowButton,
    RemoveRowButton: DefaultRemoveRowButton,
    SubmitButton: DefaultSubmitButton,
    ArrayErrorMessage: DefaultArrayErrorMsg,
    ArrayTitle: DefaultArrayTitle,
    RowContainer: DefaultRowContainer,
    ...controls,
  };
}
