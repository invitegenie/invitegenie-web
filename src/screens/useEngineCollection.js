import { useEffect, useState } from "react";
import { getCollection, subscribe } from "../auth/coreEngine";

export default function useEngineCollection(key) {
  const [data, setData] = useState(() => getCollection(key));

  useEffect(() => {
    setData(getCollection(key));

    const unsubscribe = subscribe(key, setData);

    const handleStorage = () => {
      setData(getCollection(key));
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("invitegenie:data-change", handleStorage);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("invitegenie:data-change", handleStorage);
    };
  }, [key]);

  return data;
}