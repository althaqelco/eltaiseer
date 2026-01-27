"use client";

import Script from "next/script";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Meta Pixel ID
const PIXEL_ID = "1435327391327091";

// Declare fbq for TypeScript
declare global {
    interface Window {
        fbq: (...args: unknown[]) => void;
        _fbq: (...args: unknown[]) => void;
    }
}

// Track page views
export function MetaPixel() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Track page view on route change
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "PageView");
        }
    }, [pathname, searchParams]);

    return (
        <>
            {/* Meta Pixel Code */}
            <Script
                id="meta-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            fbq('track', 'PageView');
          `,
                }}
            />
            {/* NoScript fallback for users with JavaScript disabled */}
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
        </>
    );
}

// Helper functions for tracking custom events
export const trackEvent = {
    // Track WhatsApp contact
    whatsappContact: (propertyId?: string, propertyName?: string) => {
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "Contact", {
                content_name: "WhatsApp Contact",
                content_category: "Communication",
                property_id: propertyId || "general",
                property_name: propertyName || "عقار",
                method: "WhatsApp",
            });
        }
    },

    // Track phone call
    phoneCall: (propertyId?: string, propertyName?: string) => {
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "Contact", {
                content_name: "Phone Call",
                content_category: "Communication",
                property_id: propertyId || "general",
                property_name: propertyName || "عقار",
                method: "Phone",
            });
        }
    },

    // Track property view
    propertyView: (propertyId: string, propertyName: string, price?: number, city?: string) => {
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "ViewContent", {
                content_type: "property",
                content_ids: [propertyId],
                content_name: propertyName,
                value: price || 0,
                currency: "EGP",
                city: city || "",
            });
        }
    },

    // Track lead form submission
    leadSubmission: (formType: string, propertyId?: string) => {
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "Lead", {
                content_name: formType,
                property_id: propertyId || "general",
            });
        }
    },

    // Track search
    search: (searchQuery: string, city?: string, propertyType?: string) => {
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "Search", {
                search_string: searchQuery,
                content_category: "property",
                city: city || "",
                property_type: propertyType || "",
            });
        }
    },

    // Track wishlist/favorites
    addToWishlist: (propertyId: string, propertyName: string, price?: number) => {
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "AddToWishlist", {
                content_type: "property",
                content_ids: [propertyId],
                content_name: propertyName,
                value: price || 0,
                currency: "EGP",
            });
        }
    },

    // Track share
    share: (propertyId: string, method: string) => {
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("trackCustom", "Share", {
                content_type: "property",
                content_id: propertyId,
                method: method,
            });
        }
    },

    // Track property inquiry
    inquiry: (propertyId: string, propertyName: string, inquiryType: string) => {
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "InitiateCheckout", {
                content_type: "property",
                content_ids: [propertyId],
                content_name: propertyName,
                inquiry_type: inquiryType,
            });
        }
    },

    // Custom event for any tracking
    custom: (eventName: string, params: Record<string, unknown> = {}) => {
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("trackCustom", eventName, params);
        }
    },
};
