import * as React from "react";
import { CommonActions } from "@react-navigation/native";

export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (navigationRef.current?.isReady()) {
    navigationRef.current.navigate(name, params);
  }
}

export function resetToAuth() {
  if (!navigationRef.current?.isReady()) {
    console.log("Navigation not ready");
    return;
  }

  navigationRef.current.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: "AuthStack" }],
    })
  );
}

