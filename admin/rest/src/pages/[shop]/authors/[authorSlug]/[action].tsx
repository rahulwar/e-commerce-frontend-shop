import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { Config } from '@/config';
import { useAuthorQuery } from '@/data/author';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AuthorCreateOrUpdateForm from '@/components/author/author-form';
import ShopLayout from '@/components/layouts/shop';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
export default function UpdateAuthorPage() {
  const { query, locale } = useRouter();
  const { t } = useTranslation();
  const { author, loading, error } = useAuthorQuery({
    slug: query.authorSlug as string,
    language:
      query.action && query.action!.toString() === 'edit'
        ? locale!
        : Config.defaultLanguage,
  });
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-update-author')}
        </h1>
      </div>
      <AuthorCreateOrUpdateForm initialValues={author} />
    </>
  );
}

UpdateAuthorPage.Layout = ShopLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
