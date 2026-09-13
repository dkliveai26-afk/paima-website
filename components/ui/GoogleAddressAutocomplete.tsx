"use client";

import React, { useState, useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { MapPin, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Suggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface GoogleAddressAutocompleteProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function GoogleAddressAutocomplete({
  id = "contact-loc",
  value,
  onChange,
  placeholder = "e.g. 575 Madison Ave, New York / Avenue Princesse Grace, Monaco",
  className = "",
  required = false,
}: GoogleAddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Keep internal input value synchronized with props
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Initialize Google Maps Places Autocomplete service
  useEffect(() => {
    if (!apiKey) return;

    let isMounted = true;

    try {
      setOptions({
        key: apiKey,
        v: "weekly",
      });

      importLibrary("places")
        .then((placesLib) => {
          if (!isMounted) return;
          autocompleteServiceRef.current = new placesLib.AutocompleteService();
        })
        .catch((err) => {
          console.warn("Google Places Autocomplete failed to load:", err);
        });
    } catch (err) {
      console.warn("Google Places Autocomplete initialization error:", err);
    }

    return () => {
      isMounted = false;
    };
  }, [apiKey]);

  // Fetch real Google suggestions with debounce
  useEffect(() => {
    if (!inputValue || inputValue.trim().length < 2 || !autocompleteServiceRef.current) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      autocompleteServiceRef.current?.getPlacePredictions(
        {
          input: inputValue,
          types: ["geocode", "establishment"],
        },
        (predictions, status) => {
          setLoading(false);
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions &&
            predictions.length > 0
          ) {
            const mapped: Suggestion[] = predictions.map((p) => ({
              placeId: p.place_id,
              description: p.description,
              mainText: p.structured_formatting?.main_text || p.description,
              secondaryText: p.structured_formatting?.secondary_text || "",
            }));
            setSuggestions(mapped);
            setIsOpen(true);
            setSelectedIndex(-1);
          } else {
            setSuggestions([]);
            setIsOpen(false);
          }
        }
      );
    }, 220);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: Suggestion) => {
    setInputValue(item.description);
    onChange(item.description);
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id={id}
          required={required}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className={cn(
            "w-full bg-[#E1D4C2] border border-[#A78D78] px-4 py-3 pr-10 text-xs text-black placeholder:text-black/60 focus:outline-none focus:border-black transition-all duration-300 rounded-lg font-bold",
            className
          )}
          placeholder={placeholder}
        />

        {/* Loading Spinner or Clear */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-black/60 pointer-events-none">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-black" />
          ) : inputValue ? (
            <MapPin className="w-3.5 h-3.5 text-black/60" />
          ) : null}
        </div>
      </div>

      {/* Suggestion Dropdown Flow */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#E1D4C2] border border-[#A78D78] rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto animate-in fade-in-50 duration-150">
          <div className="p-1.5 space-y-0.5">
            {suggestions.map((item, index) => {
              const isHighlighted = selectedIndex === index;
              return (
                <button
                  key={item.placeId}
                  type="button"
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-2.5 transition-colors cursor-pointer group",
                    isHighlighted ? "bg-[#A78D78]/50 text-black" : "hover:bg-[#A78D78]/30 text-black"
                  )}
                >
                  <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5 opacity-75 group-hover:opacity-100" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-black truncate leading-tight">
                      {item.mainText}
                    </p>
                    {item.secondaryText && (
                      <p className="text-[11px] text-black/75 truncate mt-0.5 leading-tight">
                        {item.secondaryText}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Powered by Google Footer */}
          <div className="px-3 py-1.5 border-t border-[#A78D78]/40 bg-[#BEB5A9]/40 flex items-center justify-between text-[9px] font-mono text-black/60">
            <span>Select address to autofill</span>
            <span className="font-semibold">Google Places</span>
          </div>
        </div>
      )}
    </div>
  );
}
