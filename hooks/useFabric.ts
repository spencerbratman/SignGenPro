import { useEffect, useState } from "react";

export const useFabric = () => {
  const [fabric, setFabric] = useState<any>(null);

  useEffect(() => {
    import("fabric").then((module) => {
      setFabric(module.fabric);
    });
  }, []);

  return fabric;
};
