"use client";
import React, { useEffect } from "react";

const VhFix = ({
  children,
  bgColor,
}: {
  children: React.ReactNode;
  bgColor: string;
}) => {
  useEffect(() => {
    const setVhUnit = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`,
      );
    };

    setVhUnit();
    window.addEventListener("resize", setVhUnit);

    return () => {
      window.removeEventListener("resize", setVhUnit);
    };
  }, []);

  return (
    <div
      className={`flex-grow ${bgColor}`}
      style={{ height: "calc(var(--vh) * 100 - 56px)" }}
    >
      {children}
    </div>
  );
};

export default VhFix;
