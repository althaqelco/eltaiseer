"use client";

import { Fragment } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageHref, pageWindow } from "@/lib/pagination";

interface ListingPaginationProps {
  currentPage: number;
  totalPages: number;
  // الرابط الأساسي للقائمة وينتهي بـ / — مثال: "/properties/apartments/"
  basePath: string;
  // عند تفعيل فلتر في المتصفح يصبح الترقيم محلياً (أزرار)؛ بدونه روابط ?page=N حقيقية يتبعها الزاحف
  onPageChange?: (page: number) => void;
  activeClassName?: string;
  className?: string;
}

export function ListingPagination({
  currentPage,
  totalPages,
  basePath,
  onPageChange,
  activeClassName = "bg-orange-500",
  className = "mt-8",
}: ListingPaginationProps) {
  if (totalPages <= 1) return null;

  const prev = currentPage - 1;
  const next = currentPage + 1;

  const control = (page: number, label: React.ReactNode, opts: { active?: boolean; rel?: string; ariaLabel?: string } = {}) => {
    const disabled = page < 1 || page > totalPages;
    const variant = opts.active ? "default" : "outline";
    const className = opts.active ? activeClassName : "";
    if (disabled || opts.active) {
      return (
        <Button
          variant={variant}
          size="icon"
          className={className}
          disabled={disabled}
          aria-label={opts.ariaLabel}
          aria-current={opts.active ? "page" : undefined}
        >
          {label}
        </Button>
      );
    }
    if (onPageChange) {
      return (
        <Button variant={variant} size="icon" className={className} aria-label={opts.ariaLabel} onClick={() => onPageChange(page)}>
          {label}
        </Button>
      );
    }
    return (
      <Button asChild variant={variant} size="icon" className={className}>
        <Link href={pageHref(basePath, page)} rel={opts.rel} aria-label={opts.ariaLabel}>
          {label}
        </Link>
      </Button>
    );
  };

  return (
    <nav className={`flex items-center justify-center gap-2 ${className}`} aria-label="ترقيم الصفحات">
      {control(prev, <ChevronRight className="h-4 w-4" />, { rel: "prev", ariaLabel: "الصفحة السابقة" })}
      {pageWindow(currentPage, totalPages).map((page, idx) =>
        page === "gap" ? (
          <span key={`gap-${idx}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <Fragment key={page}>{control(page, page, { active: page === currentPage })}</Fragment>
        )
      )}
      {control(next, <ChevronLeft className="h-4 w-4" />, { rel: "next", ariaLabel: "الصفحة التالية" })}
    </nav>
  );
}
