"use server";

import { CachedPeriods, CachedPolicies } from "@/utils/Cache/CachedConditions";

export async function FetchPeriodsPolicies() {
  const [periods, policies] = await Promise.all([
    CachedPeriods(),
    CachedPolicies(),
  ]);

  return { periods, policies };
}
