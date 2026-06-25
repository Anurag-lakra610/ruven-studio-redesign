"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LogOut, Package, Mail, Phone, MapPin, ExternalLink, Calendar } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface Order {
  number: string;
  date: string;
  total: number;
  status: string;
  items: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<{
    line1: string;
    line2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } | null>(null);

  useEffect(() => {
    let resolved = false;

    // Timeout after 3000ms
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        router.push("/login");
      }
    }, 3000);

    const checkSession = async () => {
      let email = "";
      let name = "Valued Customer";

      try {
        const supabase = createClient();
        
        // 1. Check real Supabase user session
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          email = authUser.email || "";
          name = authUser.user_metadata?.first_name 
            ? `${authUser.user_metadata.first_name} ${authUser.user_metadata.last_name || ""}`.trim()
            : authUser.email?.split("@")[0] || "Valued Customer";
        } else {
          // Fallback to cookie for mock session in local testing
          const getCookie = (name: string) => {
            const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)"));
            return match ? decodeURIComponent(match[2]) : "";
          };
          
          const isCustomer = getCookie("mock_customer_session") === "true";
          const isAdmin = getCookie("mock_admin_session") === "true";
          
          if (isCustomer || isAdmin) {
            email = getCookie("mock_user_email") || (isAdmin ? "admin@ruven.in" : "customer@ruven.in");
            name = getCookie("mock_user_name") || "Valued Customer";
          }
        }
      } catch (err) {
        console.error("Auth session check error:", err);
      }

      if (email) {
        resolved = true;
        clearTimeout(timeoutId);
        
        const sessionUser = { email, name };
        setUser(sessionUser);
        setLoading(false); // LAUNCH THE DASHBOARD IMMEDIATELY

        // Now run the DB queries in the background (non-blocking)
        try {
          const supabase = createClient();
          const isEmailIdentifier = email.includes("@");
          let dbCustomer = null;

          if (isEmailIdentifier) {
            const { data } = await supabase
              .from("customers")
              .select("id, phone, first_name, last_name")
              .eq("email", email)
              .maybeSingle();
            dbCustomer = data;
          } else {
            const cleanSessionPhone = email.replace(/\D/g, ""); // keep only digits
            if (cleanSessionPhone.length >= 10) {
              const last10 = cleanSessionPhone.slice(-10);
              const { data } = await supabase
                .from("customers")
                .select("id, phone, first_name, last_name")
                .ilike("phone", `%${last10}%`)
                .maybeSingle();
              dbCustomer = data;
            }
          }

          if (dbCustomer) {
            const fullName = [dbCustomer.first_name, dbCustomer.last_name].filter(Boolean).join(" ");
            if (fullName) {
              setUser({ email, name: fullName });
            }
            if (dbCustomer.phone) {
              setPhone(dbCustomer.phone);
            }

            // Fetch shipping address
            const { data: dbAddress } = await supabase
              .from("customer_addresses")
              .select("*")
              .eq("customer_id", dbCustomer.id)
              .eq("address_type", "Shipping")
              .maybeSingle();

            if (dbAddress) {
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
        } catch (profileErr) {
          console.error("Profile background query error:", profileErr);
        } finally {
          setLoadingProfile(false);
        }

        // Fetch orders in the background
        try {
          const supabase = createClient();
          let customerId = null;

          const isEmailIdentifier = email.includes("@");
          if (isEmailIdentifier) {
            const { data } = await supabase
              .from("customers")
              .select("id")
              .eq("email", email)
              .maybeSingle();
            customerId = data?.id;
          } else {
            const cleanSessionPhone = email.replace(/\D/g, "");
            if (cleanSessionPhone.length >= 10) {
              const last10 = cleanSessionPhone.slice(-10);
              const { data } = await supabase
                .from("customers")
                .select("id")
                .ilike("phone", `%${last10}%`)
                .maybeSingle();
              customerId = data?.id;
            }
          }

          if (customerId) {
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
              .eq("customer_id", customerId)
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
        } catch (ordersErr) {
          console.error("Orders background query error:", ordersErr);
        } finally {
          setLoadingOrders(false);
        }
      } else {
        resolved = true;
        clearTimeout(timeoutId);
        router.push("/login");
      }
    };

    checkSession();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [router]);

  const handleLogout = () => {
    // Clear cookies
    document.cookie = "mock_customer_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "mock_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "mock_user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "mock_user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    
    // Clear supabase auth session
    const supabase = createClient();
    supabase.auth.signOut().then(() => {
      router.push("/login");
    });
  };

  if (loading || !user) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center bg-[#F5F3EE] dark:bg-[#121212] gap-4 relative overflow-hidden">
        {/* Blueprint Layout Grid & Faith-Inspired Watermark */}
        <div className="auth-blueprint-grid" />
        <div className="auth-watermark-graphic" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-[#670000] dark:text-[#B33A3A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-[10px] tracking-[0.2em] text-[#888880] uppercase font-bold animate-pulse">Verifying Session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F5F3EE] dark:bg-[#121212] py-20 px-8 md:px-16 lg:px-24 min-h-[calc(100vh-160px)] relative overflow-hidden">
      {/* Blueprint Layout Grid & Faith-Inspired Watermark */}
      <div className="auth-blueprint-grid" />
      <div className="auth-watermark-graphic" />

      <div className="max-w-[1400px] w-full mx-auto space-y-16 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-10 border-b border-[#E5E3DD] dark:border-[#2C2C2A]">
          <div className="space-y-3">
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#888880] uppercase block">
              Customer Space
            </span>
            <h1 className="text-4xl font-light tracking-tight text-[#1A1A18] dark:text-[#ECECEC]">
              Welcome back, <span className="font-semibold">{user.name}</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-8 py-3.5 border border-[#1A1A18] dark:border-[#ECECEC] bg-[#1A1A18] dark:bg-[#ECECEC] text-[10px] font-bold uppercase tracking-widest text-white dark:text-[#1A1A18] hover:bg-transparent dark:hover:bg-transparent hover:text-[#1A1A18] dark:hover:text-[#ECECEC] flex items-center gap-2.5 transition-all duration-300 rounded-none cursor-pointer"
          >
            <LogOut className="w-4 h-4 stroke-[1.5]" />
            <span>Sign Out</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left profile info */}
          <div className="lg:col-span-4 bg-white dark:bg-[#1E1E1C] border border-[#E5E3DD] dark:border-[#2C2C2A] rounded-none p-8 shadow-sm relative space-y-8">
            <div className="h-[4px] bg-[#670000] dark:bg-[#B33A3A] -mx-8 -mt-8 mb-8" />
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#1A1A18] dark:text-[#ECECEC] pb-4 border-b border-[#F5F3EE] dark:border-[#2C2C2A]">
              Profile Directory
            </h3>

            {loadingProfile ? (
              <div className="space-y-6 mt-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-none" />
                  <div className="space-y-2 flex-1">
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-800 w-1/3" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 w-3/4" />
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-none" />
                  <div className="space-y-2 flex-1">
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-800 w-1/4" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 w-1/2" />
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-zinc-200 dark:bg-zinc-800 rounded-none" />
                  <div className="space-y-2 flex-1">
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-800 w-1/3" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 w-5/6" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#F5F3EE] dark:bg-[#2C2C2A] text-[#670000] dark:text-[#B33A3A] flex-shrink-0">
                    <Mail className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#888880] block">Email Address</span>
                    <span className="text-sm text-[#1A1A18] dark:text-[#ECECEC] font-medium break-all mt-1 block">{user.email}</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#F5F3EE] dark:bg-[#2C2C2A] text-[#670000] dark:text-[#B33A3A] flex-shrink-0">
                    <Phone className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#888880] block">Contact Number</span>
                    <span className="text-sm text-[#1A1A18] dark:text-[#ECECEC] font-medium mt-1 block">
                      {phone || <span className="italic text-[#888880] font-normal">Not Provided</span>}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-[#F5F3EE] dark:bg-[#2C2C2A] text-[#670000] dark:text-[#B33A3A] flex-shrink-0">
                    <MapPin className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#888880] block">Shipping Address</span>
                    {address ? (
                      <p className="text-sm text-[#1A1A18] dark:text-[#ECECEC] font-medium mt-1 leading-relaxed">
                        {address.line1}
                        {address.line2 && <><br />{address.line2}</>}
                        <br />{address.city}, {address.state} - {address.zipCode}
                        <br />{address.country}
                      </p>
                    ) : (
                      <p className="text-sm text-[#888880] italic mt-1 font-normal">
                        No shipping location configured.
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full py-3.5 border border-[#1A1A18] dark:border-[#ECECEC] bg-transparent text-[#1A1A18] dark:text-[#ECECEC] hover:bg-[#1A1A18] dark:hover:bg-[#ECECEC] hover:text-white dark:hover:text-[#1A1A18] transition-all duration-300 text-[10px] tracking-widest font-bold uppercase rounded-none cursor-pointer">
                    Manage Profile
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right order list */}
          <div className="lg:col-span-8 bg-white dark:bg-[#1E1E1C] border border-[#E5E3DD] dark:border-[#2C2C2A] rounded-none p-8 shadow-sm relative space-y-8">
            <div className="h-[4px] bg-[#670000] dark:bg-[#B33A3A] -mx-8 -mt-8 mb-8" />
            <div className="flex justify-between items-center pb-4 border-b border-[#F5F3EE] dark:border-[#2C2C2A]">
              <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#1A1A18] dark:text-[#ECECEC]">
                Order Ledger
              </h3>
              <span className="text-[10px] font-mono tracking-wider text-[#888880]">
                Total Cargo: {orders.length}
              </span>
            </div>

            <div>
              {loadingOrders ? (
                <div className="space-y-6 animate-pulse">
                  {[1, 2].map((i) => (
                    <div key={i} className="p-6 border border-[#E5E3DD] dark:border-[#2C2C2A] bg-[#FAFAFA] dark:bg-[#1A1A18]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="h-5 bg-zinc-200 dark:bg-zinc-800 w-24" />
                          <div className="h-5 bg-zinc-200 dark:bg-zinc-800 w-16" />
                        </div>
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-2/3" />
                        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 w-32" />
                      </div>
                      <div className="w-full md:w-32 space-y-2 pt-4 md:pt-0 border-t md:border-t-0 border-[#E5E3DD] dark:border-[#2C2C2A]">
                        <div className="h-2 bg-zinc-200 dark:bg-zinc-800 w-12 md:ml-auto" />
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-16 md:ml-auto" />
                        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 w-full rounded-none" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="py-24 text-center space-y-6">
                  <div className="p-5 bg-[#F5F3EE] dark:bg-[#1A1A18] text-[#670000] dark:text-[#B33A3A] inline-block rounded-none">
                    <Package className="w-10 h-10 stroke-[1.0]" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-[#1A1A18] dark:text-[#ECECEC] uppercase tracking-widest">No Registered Cargo</h4>
                    <p className="text-xs text-[#888880] max-w-sm mx-auto leading-relaxed">
                      Your transaction journal is empty. Explore our limited, faith-inspired premium collection to place your first order.
                    </p>
                  </div>
                  <div className="pt-4">
                    <Link
                      href="/shop"
                      className="inline-block px-8 py-3.5 bg-[#670000] hover:bg-[#8E1B1B] text-white text-[10px] tracking-widest font-bold uppercase transition-all duration-300 rounded-none"
                    >
                      Explore Collections
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {orders.map((ord) => (
                    <div
                      key={ord.number}
                      className="p-6 border border-[#E5E3DD] dark:border-[#2C2C2A] bg-[#FAFAFA] dark:bg-[#1A1A18]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all duration-300 hover:border-[#670000] dark:hover:border-[#B33A3A]"
                    >
                      <div className="space-y-4 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono font-bold text-xs text-[#670000] dark:text-[#B33A3A] tracking-wider bg-[#670000]/5 dark:bg-[#B33A3A]/10 px-3 py-1.5">
                            {ord.number}
                          </span>
                          {ord.status === "Processing" ? (
                            <span className="inline-flex items-center gap-1.5 text-[9px] px-2.5 py-1 rounded-none font-bold uppercase tracking-wider bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] animate-pulse" />
                              {ord.status}
                            </span>
                          ) : ord.status === "Delivered" ? (
                            <span className="inline-flex items-center gap-1.5 text-[9px] px-2.5 py-1 rounded-none font-bold uppercase tracking-wider bg-[#EBF7EE] text-[#1C522D] border border-[#A7F3D0]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1C522D]" />
                              {ord.status}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[9px] px-2.5 py-1 rounded-none font-bold uppercase tracking-wider bg-[#F5F3EE] text-[#6B6862] border border-[#E5E3DD]">
                              {ord.status}
                            </span>
                          )}
                        </div>
                        
                        <h4 className="text-sm font-semibold tracking-wide text-[#1A1A18] dark:text-[#ECECEC] uppercase">
                          {ord.items}
                        </h4>

                        <div className="flex items-center gap-2 text-[10px] text-[#888880]">
                          <Calendar className="w-3.5 h-3.5 text-[#888880]" />
                          <span>Placed on {ord.date}</span>
                        </div>
                      </div>

                      <div className="flex md:flex-col items-baseline md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-[#E5E3DD] dark:border-[#2C2C2A]">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#888880] block md:text-right">Amount Paid</span>
                          <span className="text-base font-bold text-[#1A1A18] dark:text-[#ECECEC]">₹{ord.total}</span>
                        </div>
                        <Link
                          href={`/tracking?order_number=${ord.number}`}
                          className="px-5 py-2.5 border border-[#1A1A18] dark:border-[#ECECEC] hover:bg-[#1A1A18] dark:hover:bg-[#ECECEC] hover:text-white dark:hover:text-[#1A1A18] transition-all duration-300 text-[10px] tracking-widest font-bold uppercase rounded-none flex items-center gap-1.5"
                        >
                          <span>Track Cargo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
