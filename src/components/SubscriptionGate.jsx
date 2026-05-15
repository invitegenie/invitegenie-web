import { getAccountType, getPlanLimits } from "../services/accountCapabilities";
import PlanLimitModal from "./PlanLimitModal";

export default function SubscriptionGate({ user, limit, children }) {
  const accountType = getAccountType(user);
  const limits = getPlanLimits(user);
  const blocked = limit && !limit.allowed;

  return (
    <>
      {children({ accountType, limits, blocked })}
      <PlanLimitModal open={blocked} limit={limit} />
    </>
  );
}
