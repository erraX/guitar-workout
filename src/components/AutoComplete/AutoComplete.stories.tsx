import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import AutoComplete from "./AutoComplete";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/AutoComplete",
  component: AutoCompleteWrapper,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AutoCompleteWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

const delay = (timeout = 0) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

function AutoCompleteWrapper() {
  const [value, setValue] = useState("3");
  const [options, setOptions] = useState([
    { label: "option_1", value: "1" },
    { label: "option_2", value: "2" },
    { label: "option_3", value: "3" },
  ]);

  return (
    <div>
      <div className="w-full">
        <p>DEBUG:</p>
        <p>value: {value}</p>
      </div>
      <div>
        <AutoComplete
          value={value}
          options={options}
          filter={(inputValue, options) => {
            if (!inputValue) return options;
            return options.filter((option) =>
              option.label.includes(inputValue)
            );
          }}
          renderOption={(option) => (
            <span>
              {option.label} - {option.value}
            </span>
          )}
          renderCreator={(inputValue) => <span>Create: {inputValue}</span>}
          onChange={(option) => {
            setValue(option.value);
          }}
          creator={async (inputValue) => {
            await delay(2000);
            const newOption = {
              label: `${inputValue} - label`,
              value: inputValue,
            };
            setOptions((state) => [...state, newOption]);
            return newOption;
          }}
        />
      </div>
      <div>
        <AutoComplete
          value={value}
          options={options}
          filter={(inputValue, options) => {
            if (!inputValue) return options;
            return options.filter((option) =>
              option.label.includes(inputValue)
            );
          }}
          renderOption={(option) => (
            <span>
              {option.label} - {option.value}
            </span>
          )}
          renderCreator={(inputValue) => <span>Create: {inputValue}</span>}
          onChange={(option) => {
            setValue(option.value);
          }}
          creator={async (inputValue) => {
            await delay(2000);
            const newOption = {
              label: `${inputValue} - label`,
              value: inputValue,
            };
            setOptions((state) => [...state, newOption]);
            return newOption;
          }}
        />
      </div>
    </div>
  );
}
