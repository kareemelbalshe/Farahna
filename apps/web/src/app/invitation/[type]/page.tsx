import React from 'react';
import type { Metadata } from 'next';
import PublicInvitationPage, {
  generateMetadata as generateNestedMetadata,
} from './[slug]/page';

interface SingleParamPageProps {
  params: {
    type: string; // Here "type" holds the slug e.g. "ahmed-sara"
  };
  searchParams?: {
    hideEvent?: string;
    theme?: string;
    themeOverride?: string;
  };
}

export async function generateMetadata({
  params,
  searchParams,
}: SingleParamPageProps): Promise<Metadata> {
  return generateNestedMetadata({
    params: { type: 'any', slug: params.type },
    searchParams,
  });
}

export default async function SingleParamInvitationPage({
  params,
  searchParams,
}: SingleParamPageProps) {
  return PublicInvitationPage({
    params: { type: 'any', slug: params.type },
    searchParams,
  });
}
