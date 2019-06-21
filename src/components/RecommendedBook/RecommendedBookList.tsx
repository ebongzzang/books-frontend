import * as React from 'react';
import { Book } from '@ridi/web-ui/dist/index.node';
import {
  BookItem,
  BookList,
  BookMeta,
  BookScheme,
  hotReleaseBookListCSS,
  recommendedBookListCSS,
  ThumbnailWrapper,
} from 'src/components/RecommendedBook/RecommendedBook';

interface RecommendedBookListProps {
  items: BookScheme[];
  type: 'hot_release' | 'single_book_recommendation';
}

const RecommendedBookList: React.FC<RecommendedBookListProps> = props => {
  return (
    <BookList css={props.type === 'hot_release' ? hotReleaseBookListCSS : recommendedBookListCSS}>
      {props.items.map((book, index) => {
        return (
          <BookItem key={index}>
            <ThumbnailWrapper>
              <Book.Thumbnail
                adultBadge={true}
                thumbnailWidth={120}
                thumbnailUrl={`https://misc.ridibooks.com/cover/${book.id}/xxlarge`}
              />
            </ThumbnailWrapper>
            <BookMeta book={book} />
          </BookItem>
        );
      })}
    </BookList>
  );
};

export default RecommendedBookList;