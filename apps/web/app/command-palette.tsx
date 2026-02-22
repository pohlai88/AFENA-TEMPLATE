'use client';

import { usePathname, useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from 'afenda-ui/components/command';
import { Home, Plus, Trash2, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { NAV_ITEMS } from '@/app/(app)/org/[slug]/_components/nav-config';

interface SearchResult {
  id: string;
  type: 'contacts';
  title: string;
  subtitle: string | null;
}

async function fetchSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 1) return [];
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`);
  if (!res.ok) return [];
  const data = (await res.json()) as { results: SearchResult[] };
  return data.results;
}

export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const orgSlug = pathname?.match(/^\/org\/([^/]+)/)?.[1];
  const orgPrefix = orgSlug ? `/org/${orgSlug}` : '';

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const { data: searchResults = [], isFetching } = useQuery({
    queryKey: ['search', query],
    queryFn: () => fetchSearch(query),
    enabled: query.length >= 1,
    staleTime: 10 * 1000,
    placeholderData: (prev) => prev,
  });

  const navigate = useCallback(
    (path: string) => {
      setOpen(false);
      setQuery('');
      router.push(path);
    },
    [router],
  );

  const navActions = orgSlug
    ? NAV_ITEMS.filter((i) => i.commandPaletteAction).map((item) => ({
        ...item,
        href: item.href(orgSlug),
      }))
    : [];

  return (
    <CommandDialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setQuery('');
      }}
      title="Command Palette"
      description="Search contacts, navigate, or run actions"
    >
      <CommandInput
        placeholder="Search contacts, pages, actions..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {isFetching ? 'Searching...' : 'No results found.'}
        </CommandEmpty>

        {searchResults.length > 0 && orgPrefix && (
          <CommandGroup heading="Contacts">
            {searchResults.map((result) => (
              <CommandItem
                key={result.id}
                value={`contact-${result.id}-${result.title}`}
                onSelect={() => navigate(`${orgPrefix}/contacts/${result.id}`)}
              >
                <Users className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{result.title}</span>
                  {result.subtitle && (
                    <span className="text-xs text-muted-foreground">{result.subtitle}</span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {orgPrefix && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem value="new-contact" onSelect={() => navigate(`${orgPrefix}/contacts/new`)}>
                <Plus className="mr-2 h-4 w-4" />
                New Contact
              </CommandItem>
            </CommandGroup>
          </>
        )}

        <CommandSeparator />
        <CommandGroup heading="Navigation">
          {navActions.length > 0 ? (
            navActions.map((item) => (
              <CommandItem
                key={item.label}
                value={item.commandPaletteAction ?? item.label}
                onSelect={() => navigate(item.href)}
              >
                <item.icon className="mr-2 h-4 w-4" aria-hidden />
                <span>{item.commandPaletteAction ?? item.label}</span>
              </CommandItem>
            ))
          ) : (
            <>
              <CommandItem value="go-dashboard" onSelect={() => navigate('/dashboard')}>
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </CommandItem>
              {orgPrefix && (
                <>
                  <CommandItem value="go-contacts" onSelect={() => navigate(`${orgPrefix}/contacts`)}>
                    <Users className="mr-2 h-4 w-4" />
                    Contacts
                  </CommandItem>
                  <CommandItem value="go-trash" onSelect={() => navigate(`${orgPrefix}/contacts/trash`)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Trash
                  </CommandItem>
                </>
              )}
            </>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
