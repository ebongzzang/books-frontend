import * as BookApi from 'src/types/book';

import sentry from 'src/utils/sentry';

export function computeBookTitle(book: BookApi.Book): string {
  if (!book) {
    return '';
  }
  if (book.is_deleted) {
    return '';
  }
  try {
    if (book.series) {
      if (book.title.prefix) {
        return `${book.title.prefix} ${book.series.property.title}`;
      }
      return book.series.property.title || book.title.main;
    }
    if (book.title) {
      if (book.title.prefix) {
        return `${book.title.prefix} ${book.title.main}`;
      }
    }
    return book.title.main;
  } catch (error) {
    sentry.captureException(error);
    return book.title.main;
  }
}
