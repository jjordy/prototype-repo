import React from "react";

interface TextInputProps {
  label?: string;
  title?: string;
  register: any;
  name: string;
  type?: string;
}

export default function TextInput({
  label,
  register,
  name,
  type = "text",
  title,
}: TextInputProps) {
  return (
    <div>
      <label
        htmlFor={`id_${name}`}
        style={{
          display: "block",
          marginBottom: ".5rem",
          marginTop: ".2rem",
          fontWeight: "bold",
          color: "#222",
        }}
      >
        {title || label || name}
      </label>
      <input
        type={type}
        {...register(name)}
        id={`id_${name}`}
        style={{ width: "100%" }}
      />
    </div>
  );
}
