import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPreviewInvitation } from '@/lib/api';
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer';

interface PreviewPageProps {
  params: {
    token: string;
  };
}

export const metadata: Metadata = {
  title: 'معاينة دعوة خاصة | فرحنا',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PreviewInvitationPage({ params }: PreviewPageProps) {
  const { token } = params;
  const res = await fetchPreviewInvitation(token);

  if (!res || !res.success || !res.data) {
    notFound();
  }

  const invitation = res.data;

  return (
    <InvitationRenderer
      invitation={invitation}
      events={invitation.events || []}
      theme={invitation.theme}
      sections={invitation.sections || []}
      isPreview={true}
    />
  );
}
