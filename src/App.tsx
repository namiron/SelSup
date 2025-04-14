import React, { useState, useEffect, useRef, useCallback } from "react";

interface Param {
  id: number;
  name: string;
  type: "string";
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Color {
  name: string;
  hex: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

interface Props {
  params: Param[];
  model: Model;
  innerRef: React.MutableRefObject<(() => Model | null) | null>;
}

const ParamEditor: React.FC<Props> = React.memo(({ params, model, innerRef }) => {
  const [paramValues, setParamValues] = useState<ParamValue[]>(() =>
    params.map((param) => {
      const existing = model.paramValues.find((pv) => pv.paramId === param.id);
      return {
        paramId: param.id,
        value: existing ? existing.value : "",
      };
    })
  );

  const handleChange = useCallback((paramId: number, value: string) => {
    setParamValues((prev) => prev.map((pv) => (pv.paramId === paramId ? { ...pv, value } : pv)));
  }, []);

  useEffect(() => {
    const updatedModel: Model = {
      paramValues,
      colors: model.colors,
    };

    innerRef.current = () => updatedModel;

    console.log("Модель обновлена:", updatedModel);
  }, [paramValues, model.colors, innerRef]);

  return (
    <div>
      {params.map((param) => (
        <div key={param.id}>
          <label>{param.name}</label>
          <input
            type="text"
            value={paramValues.find((pv) => pv.paramId === param.id)?.value || ""}
            onChange={(e) => handleChange(param.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
});

const App: React.FC = () => {
  const getModelRef = useRef<() => Model | null>(null);

  const params: Param[] = [
    { id: 1, name: "Назначение", type: "string" },
    { id: 2, name: "Длина", type: "string" },
  ];

  const model: Model = {
    paramValues: [
      { paramId: 1, value: "повседневное" },
      { paramId: 2, value: "макси" },
    ],
    colors: [],
  };

  useEffect(() => {
    const unsubscribe = setTimeout(() => {
      const currentModel = getModelRef.current?.();
      console.log("Полученая модель:", currentModel);
    }, 1000);

    return () => clearTimeout(unsubscribe);
  }, []);

  return (
    <div>
      <ParamEditor params={params} model={model} innerRef={getModelRef} />
    </div>
  );
};

export default App;
