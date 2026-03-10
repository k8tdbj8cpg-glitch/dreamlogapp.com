import type { UserType } from "@/app/(auth)/auth";

type Entitlements = {
  maxMessagesPerDay: number;
  canUseEncryption: boolean;
};

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users without an account
   */
  guest: {
    maxMessagesPerDay: 20,
    canUseEncryption: false,
  },

  /*
   * For users with an account
   */
  regular: {
    maxMessagesPerDay: 50,
    canUseEncryption: false,
  },

  /*
   * For users with an account and a paid membership (U.S. only)
   */
  premium: {
    maxMessagesPerDay: 200,
    canUseEncryption: true,
  },
};
