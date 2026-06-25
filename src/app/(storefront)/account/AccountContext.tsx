"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export interface Order {
  number: string;
  date: string;
  total: number;
  status: string;
  items: string;
}

interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface AccountContextType {
  user: { email: string; name: string } | null;
  phone: string;
  address: Address | null;
  orders: Order[];
  loadingProfile: boolean;
  loadingOrders: boolean;
  loyaltyPoints: number;
  lifetimeValue: number;
  memberSince: string;
  customerId: string | null;
  addressId: string | null;
  refreshData: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<Address | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(750);
  const [lifetimeValue, setLifetimeValue] = useState<number>(0);
  const [memberSince, setMemberSince] = useState<string>("June 2026");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [addressId, setAddressId] = useState<string | null>(null);

  const getSupabaseClient = () => {
    try {
      return createClient();
    } catch (err) {
      console.warn("Supabase client failed to initialize:", err);
      return null;
    }
  };

  const loadSessionAndData = useCallback(async () => {
    let email = "";
    let name = "Valued Customer";

    const getCookie = (name: string) => {
      if (typeof document === "undefined") return "";
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)"));
      return match ? decodeURIComponent(match[2]) : "";
    };

    const isCustomer = getCookie("mock_customer_session") === "true";
    const isAdmin = getCookie("mock_admin_session") === "true";

    if (isCustomer || isAdmin) {
      email = getCookie("mock_user_email") || (isAdmin ? "admin@ruven.in" : "customer@ruven.in");
      name = getCookie("mock_user_name") || "Valued Customer";

      const mockPhone = getCookie("mock_user_phone");
      if (mockPhone) {
        setPhone(mockPhone);
      }

      const mockAddr1 = getCookie("mock_address_line1");
      if (mockAddr1) {
        setAddress({
          line1: mockAddr1,
          line2: getCookie("mock_address_line2") || "",
          city: getCookie("mock_address_city") || "",
          state: getCookie("mock_address_state") || "",
          zipCode: getCookie("mock_address_zip") || "",
          country: getCookie("mock_address_country") || "India"
        });
      }
    }

    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          email = authUser.email || "";
          name = authUser.user_metadata?.first_name 
            ? `${authUser.user_metadata.first_name} ${authUser.user_metadata.last_name || ""}`.trim()
            : authUser.email?.split("@")[0] || "Valued Customer";
        }
      }
    } catch (err) {
      console.error("Auth session check error:", err);
    }

    if (!email) {
      // Redirect to login preserving path for return redirect
      if (typeof window !== "undefined") {
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      }
      return;
    }

    setUser({ email, name });

    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const isEmailIdentifier = email.includes("@");
        let dbCustomer = null;

        if (isEmailIdentifier) {
          const { data } = await supabase
            .from("customers")
            .select("id, phone, first_name, last_name, loyalty_points, lifetime_value, created_at")
            .eq("email", email)
            .maybeSingle();
          dbCustomer = data;
        } else {
          const cleanSessionPhone = email.replace(/\D/g, "");
          if (cleanSessionPhone.length >= 10) {
            const last10 = cleanSessionPhone.slice(-10);
            const { data } = await supabase
              .from("customers")
              .select("id, phone, first_name, last_name, loyalty_points, lifetime_value, created_at")
              .ilike("phone", `%${last10}%`)
              .maybeSingle();
            dbCustomer = data;
          }
        }

        if (dbCustomer) {
          setCustomerId(dbCustomer.id);
          const fullName = [dbCustomer.first_name, dbCustomer.last_name].filter(Boolean).join(" ");
          if (fullName) {
            setUser({ email, name: fullName });
          }
          if (dbCustomer.phone) {
            setPhone(dbCustomer.phone);
          }
          if (dbCustomer.loyalty_points !== undefined && dbCustomer.loyalty_points !== null) {
            setLoyaltyPoints(dbCustomer.loyalty_points);
          }
          if (dbCustomer.lifetime_value !== undefined && dbCustomer.lifetime_value !== null) {
            setLifetimeValue(parseFloat(dbCustomer.lifetime_value));
          }
          if (dbCustomer.created_at) {
            const dateObj = new Date(dbCustomer.created_at);
            setMemberSince(dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" }));
          }

          // Address Book query
          const { data: dbAddress } = await supabase
            .from("customer_addresses")
            .select("*")
            .eq("customer_id", dbCustomer.id)
            .eq("address_type", "Shipping")
            .maybeSingle();

          if (dbAddress) {
            setAddressId(dbAddress.id);
            setAddress({
              line1: dbAddress.address_line1,
              line2: dbAddress.address_line2 || "",
              city: dbAddress.city,
              state: dbAddress.state,
              zipCode: dbAddress.zip_code,
              country: dbAddress.country
            });
          }
        }
      }
    } catch (profileErr) {
      console.error("Profile database query error:", profileErr);
    } finally {
      setLoadingProfile(false);
    }

    // Orders query
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        let customerIdVal = null;
        const isEmailIdentifier = email.includes("@");

        if (isEmailIdentifier) {
          const { data } = await supabase
            .from("customers")
            .select("id")
            .eq("email", email)
            .maybeSingle();
          customerIdVal = data?.id;
        } else {
          const cleanSessionPhone = email.replace(/\D/g, "");
          if (cleanSessionPhone.length >= 10) {
            const last10 = cleanSessionPhone.slice(-10);
            const { data } = await supabase
              .from("customers")
              .select("id")
              .ilike("phone", `%${last10}%`)
              .maybeSingle();
            customerIdVal = data?.id;
          }
        }

        if (customerIdVal) {
          const { data: ordersData } = await supabase
            .from("orders")
            .select(`
              id,
              order_number,
              total_amount,
              status,
              created_at,
              order_items (
                quantity,
                product_variants (
                  size,
                  products (
                    name
                  )
                )
              )
            `)
            .eq("customer_id", customerIdVal)
            .order("created_at", { ascending: false });

          if (ordersData) {
            const formattedOrders: Order[] = ordersData.map((ord: any) => {
              const itemsStr = ord.order_items && ord.order_items.length > 0
                ? ord.order_items.map((item: any) => {
                    const prodName = item.product_variants?.products?.name || "Product";
                    const size = item.product_variants?.size ? ` (${item.product_variants.size})` : "";
                    return `${prodName}${size}`;
                  }).join(", ")
                  : "Items";

              const formattedDate = new Date(ord.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              });

              return {
                number: ord.order_number,
                date: formattedDate,
                total: Number(ord.total_amount),
                status: ord.status,
                items: itemsStr
              };
            });
            setOrders(formattedOrders);
          }
        }
      }
    } catch (ordersErr) {
      console.error("Orders database query error:", ordersErr);
    } finally {
      setLoadingOrders(false);
    }
  }, [router]);

  useEffect(() => {
    loadSessionAndData();
  }, [loadSessionAndData]);

  return (
    <AccountContext.Provider
      value={{
        user,
        phone,
        address,
        orders,
        loadingProfile,
        loadingOrders,
        loyaltyPoints,
        lifetimeValue,
        memberSince,
        customerId,
        addressId,
        refreshData: loadSessionAndData
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
};
