import React from "react";

const PageContext = React.createContext();
const ContextProvider = PageContext.Provider;
const ContetxtConsumer = PageContext.Consumer;

export { ContextProvider, ContetxtConsumer };
export default PageContext;