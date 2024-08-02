import React from "react";

export const Alert: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div
    className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
    role="alert"
  >
    {children}
  </div>
);

export const AlertTitle: React.FC<React.PropsWithChildren> = ({ children }) => (
  <h3 className="font-bold">{children}</h3>
);

export const AlertDescription: React.FC<React.PropsWithChildren> = ({
  children,
}) => <p>{children}</p>;
