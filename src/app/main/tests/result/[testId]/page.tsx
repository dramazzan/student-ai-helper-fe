import React from "react";
const TestProgressHistory = React.lazy(
  () => import("@/components/TestProgressHistory")
);

const TestResultHistory = () => {
  return (
    <div>
      <TestProgressHistory />
    </div>
  );
};

export default TestResultHistory;
