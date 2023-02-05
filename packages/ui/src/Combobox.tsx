import { Fragment, useMemo, useState } from "react";
import { Combobox as BaseCombobox, Transition } from "@headlessui/react";

type Option = {
  id: number;
  name: string;
};

type ComboboxProps = {
  options: Option[];
  onChange: (value: Option) => any;
  value?: Option;
};

export function Combobox({ options, onChange, value }: ComboboxProps) {
  const [selected, setSelected] = useState(value);
  const [query, setQuery] = useState("");

  const handleChange = (value: Option) => {
    setSelected(value);
    onChange(value);
  };

  const filteredOptions = useMemo(
    () =>
      query === ""
        ? options
        : options.filter((option) =>
            option?.name
              ?.toLowerCase()
              ?.replace(/\s+/g, "")
              ?.includes(query.toLowerCase().replace(/\s+/g, ""))
          ),
    [options, query]
  );

  return (
    <div>
      <BaseCombobox value={selected} onChange={handleChange}>
        <div className="relative mt-1 mb-4">
          <div className="relative w-full cursor-default rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <BaseCombobox.Input
              className="w-full rounded border border-slate-300 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(option: Option) => option.name}
              //@ts-ignore
              onChange={(event) => setQuery(event.target.value)}
            />
            <BaseCombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </BaseCombobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <BaseCombobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredOptions.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map((person) => (
                  <BaseCombobox.Option
                    key={person.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-indigo-500 text-white" : "text-gray-900"
                      }`
                    }
                    value={person}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {person.name}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-indigo-500"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-5 w-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </span>
                        ) : null}
                      </>
                    )}
                  </BaseCombobox.Option>
                ))
              )}
            </BaseCombobox.Options>
          </Transition>
        </div>
      </BaseCombobox>
    </div>
  );
}
