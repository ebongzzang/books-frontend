import { css } from '@emotion/core';
import {
  between, BreakPoint, greaterThanOrEqualTo, orBelow,
} from 'src/utils/mediaQuery';
import { BookItem } from 'src/types/sections';
import { ThumbnailWrapper } from 'src/components/BookThumbnail/ThumbnailWrapper';
import BookMeta from 'src/components/BookMeta';
import React, { useCallback, useEffect, useState } from 'react';
import { useBookSelector } from 'src/hooks/useBookDetailSelector';
import BookBadgeRenderer from 'src/components/Badge/BookBadgeRenderer';
import FreeBookRenderer from 'src/components/Badge/FreeBookRenderer';
import ThumbnailRenderer from 'src/components/BookThumbnail/ThumbnailRenderer';
import { sendClickEvent, useEventTracker } from 'src/hooks/useEventTracker';
import { Tracker } from '@ridi/event-tracker';
import { getMaxDiscountPercentage } from 'src/utils/common';
import { AdultBadge } from 'src/components/Badge/AdultBadge';
import styled from '@emotion/styled';
import { BadgeContainer } from 'src/components/Badge/BadgeContainer';
import { computeBookTitle } from 'src/utils/bookTitleGenerator';
import { getThumbnailIdFromBookDetail } from 'src/utils/books';

interface MultipleLineBooks {
  items: BookItem[];
  title: string;
  genre: string;
  slug: string;
}

interface MultipleLineBookItemProps {
  genre: string;
  item: BookItem;
  slug: string;
  order: number;
  tracker: Tracker;
}

const bookWidthStyles = css`
  @media (max-width: 999px) {
    width: 120px;
  }
  @media (max-width: 432px) {
    width: 100%;
  }
`;

const Item = styled.li`
  ${orBelow(
    426,
    `
      margin-right: 3px;
      :not(:nth-of-type(3n)) {
        margin-right: 20px;
      }
      width: 22%;
    `,
  )};
  ${orBelow(
    432,
    `
      margin-right: 3px;
      :not(:nth-of-type(3n)) {
        margin-right: 20px;
      }
      width: 27%;
    `,
  )};
  ${between(
    433,
    579,
    `
      :not(:nth-of-type(3n)) {
        margin-right: 4%;
      }
      width: 120px;
    `,
  )};
  ${between(
    580,
    833,
    `
      :not(:nth-of-type(3n)) {
        margin-right: 16%;
      }
      width: 120px;
    `,
  )};
  ${between(
    850,
    BreakPoint.LG,
    `
      :not(:nth-of-type(6n)) {
        margin-right: 2.1%;
      }
      width: 120px;
    `,
  )};
  ${greaterThanOrEqualTo(
    1001,
    `
      :not(:nth-of-type(6n)) {
        //margin-right: 20px;
        flex-grow: 0;
      }
      margin: 0 1px 20px 1px;
      width: 140px;
    `,
  )};
  margin-bottom: 24px;
`;

const thumbnailOverrideStyle = css`
  ${orBelow(
    BreakPoint.SM,
    `
      width: 100%;
      min-width: 70px;
      height: calc(90px * 1.618 - 10px);
    `,
  )};
  ${between(
    BreakPoint.SM + 1,
    BreakPoint.M,
    `
      width: 100%;
      min-width: 100px;
      height: calc(100px * 1.618 - 10px);
    `,
  )};
`;

const ItemAnchor = styled.a`
  display: inline-block;
`;

const bookMetaWrapperStyle = css`
  ${between(
    BreakPoint.M + 1,
    BreakPoint.LG,
    'width: 120px;',
  )}
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    'width: 140px;',
  )}
`;

const MultipleLineBookItem: React.FC<MultipleLineBookItemProps> = React.memo((props) => {
  const {
    item, genre, slug, order, tracker,
  } = props;
  const book = useBookSelector(item.b_id);

  const trackerEvent = useCallback(() => {
    sendClickEvent(tracker, item, slug, order);
  }, [tracker, item, slug, order]);

  if (book == null || book.is_deleted) {
    return null;
  }

  const title = computeBookTitle(book);
  return (
    <Item>
      <ThumbnailWrapper lgWidth={120} css={thumbnailOverrideStyle}>
        <ItemAnchor onClick={trackerEvent} href={`/books/${item.b_id}`}>
          <ThumbnailRenderer
            order={order}
            className={slug}
            slug={slug}
            css={bookWidthStyles}
            sizes="(max-width: 999px) 120px, 140px"
            thumbnailId={getThumbnailIdFromBookDetail(book) || item.b_id}
            isAdultOnly={book?.property.is_adult_only || false}
            imgSize="large"
            title={title}
          >
            <BadgeContainer>
              <BookBadgeRenderer
                isWaitFree={book?.series?.property.is_wait_free}
                discountPercentage={getMaxDiscountPercentage(book)}
              />
            </BadgeContainer>
            <FreeBookRenderer
              freeBookCount={
                book?.series?.price_info?.rent?.free_book_count
                || book?.series?.price_info?.buy?.free_book_count
                || 0
              }
              unit={book?.series?.property.unit || '권'}
            />
            {book?.property?.is_adult_only && <AdultBadge />}
          </ThumbnailRenderer>
        </ItemAnchor>
      </ThumbnailWrapper>
      {book && (
        <BookMeta
          bId={item.b_id}
          showTag={['bl', 'bl-serial'].includes(genre)}
          css={bookMetaWrapperStyle}
          isAIRecommendation={false}
        />
      )}
    </Item>
  );
});

const Section = styled.section`
 max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 24px;
  padding-top: 24px;
  ${orBelow(
    433,
    `
      justify-content: space-between;
      padding: 16px 10px;
      padding-right: 29px !important;
    `,
  )}
  ${orBelow(
    BreakPoint.LG,
    `
      padding-left: 20px;
      padding-right: 26px;
      padding-top: 16px;
      padding-bottom: 16px;
    `,
  )}
  ${greaterThanOrEqualTo(
    BreakPoint.LG + 1,
    'padding-left: 24px;',
  )}
`;

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  flex: none;
  justify-content: space-between;
  margin-bottom: -24px;
`;

const ItemList: React.FC<{ slug: string; genre: string; books: BookItem[] }> = (props) => {
  const { slug, genre, books } = props;
  const [, setMounted] = useState(false);
  const [tracker] = useEventTracker();
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <List>
      {books
        .slice(0, 18)
        .map((item, index) => (
          <MultipleLineBookItem
            order={index}
            slug={slug}
            key={index}
            genre={genre}
            item={item}
            tracker={tracker}
          />
        ))}
    </List>
  );
};

const Title = styled.h2`
  font-size: 19px;
  font-weight: normal;
  line-height: 26px;
  margin-bottom: 10px;
  color: #000000;
  word-break: keep-all;
  ${orBelow(
    BreakPoint.MD,
    'margin-left: -2px;',
  )}
`;

export const MultipleLineBooks: React.FC<MultipleLineBooks> = (props) => {
  const {
    title, items, genre, slug,
  } = props;
  return (
    <Section>
      <Title aria-label={title}>{title}</Title>
      <ItemList genre={genre} slug={slug} books={items} />
    </Section>
  );
};
