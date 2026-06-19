"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { useDebounce } from "use-debounce";
import { EllipsisIcon } from "lucide-react";

const Search = () => {
  const [query, setQuery] = useState<string>("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [results, setResults] = useState<FileDocument[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300);
  const [isLoading, setIsLoading] = useState(false);

  const matchedFiles = results.filter((file) =>
    file.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  const fetchFiles = async (debQuery: string) => {
    setIsLoading(true);
    try {
      const files = await getFiles({ types: [], searchText: debQuery });
      setOpen(true);
      setResults(files.documents);
    } catch (error) {
      console.error("Failed to load files", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery.trim().length === 0) {
      setResults([]);
      setOpen(false);
      return router.push(path);
    }
    fetchFiles(debouncedQuery);
  }, [debouncedQuery, router, path]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  const handleClickItem = (file: FileDocument) => {
    setOpen(false);
    setResults([]);

    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type}?query=${query}`,
    );
  };

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value)}
          onClick={() => {
            setOpen(true);
          }}
        />
        {open && (
          <ul className="search-result">
            {isLoading ? (
              <p className="subtitle-2 text-black flex justify-center items-center">
                <span>Loading</span>
                <EllipsisIcon className="animate-pulse" size={28} />
              </p>
            ) : !debouncedQuery ? (
              <p className="empty-result">search files</p>
            ) : matchedFiles.length === 0 ? (
              <li className="empty-result">No Files Found</li>
            ) : (
              matchedFiles.length > 0 &&
              debouncedQuery &&
              matchedFiles.map((file) => (
                <li
                  key={file.$id}
                  className="flex items-center justify-between"
                  onClick={() => {
                    handleClickItem(file);
                  }}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                      className="size-9 min-w-9"
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>
                  <FormattedDateTime
                    date={file.$createdAt}
                    className="caption line-clamp-1"
                  />
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
