import React from "react";
import "./style.scss";

interface Props {
  value?: string;
  onChange?(param: string): void;
}

const currencyData = [
  {
    symbol: "$",
    title: "USD",
    id: "USD",
  },
  {
    symbol: "C$",
    title: "CAD",
    id: "CAD",
  },
  {
    symbol: "€",
    title: "EUR",
    id: "EUR",
  },
];

export const CurrencyInput = ({ value, onChange }: Props) => {
  const handleClick = (params) => {};

  return (
    <div className="currency-input-control">
      <input type="text" />
      <div className="currency-input-control--currency">
        <div className="currency-input-control--currency-main"></div>
        <div className="currency-input-control--currency-container">
          {currencyData.map(({ title, id }) => (
            <div
              key={id}
              className="currency-input-control--currency-item"
              onClick={() => handleClick(id)}
            >
              {title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
