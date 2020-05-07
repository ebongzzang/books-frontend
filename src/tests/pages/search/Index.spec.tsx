import * as React from 'react';
import Index from 'src/pages/search';
import { act, render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import makeStore from 'src/store/config';
import axios from 'axios';
import fixture from './searchResult.fixture.json';
import { Provider } from 'react-redux';
import { RouterContext } from 'next/dist/next-server/lib/router-context';

const store = makeStore({}, { asPath: 'test', isServer: true });

describe('Search Page Test', () => {
  afterEach(cleanup);

  describe('getInitialProps test', () => {
    it('should be have server side props', async () => {
      (axios as any).__setHandler((method: string, url: string) => {
        return {
          data: fixture,
        };
      });
      const props = await Index.getInitialProps({
        pathname: 'search',
        isServer: true,
        asPath: '',
        store,
        query: { q: '유유' },
      });
      expect(props.book.total).toEqual(fixture.book.total);
    });

    it('should be have client side props', async () => {
      (axios as any).__setHandler((method: string, url: string) => {
        return {
          data: fixture,
        };
      });
      const props = await Index.getInitialProps({
        pathname: 'search',
        isServer: false,
        asPath: '',
        store,
        query: { q: '유유' },
      });
      // FIXME client side fetch 아직 없음
      expect(props.book.total).toEqual(147);
    });
  });

  describe('render test', () => {
    it('should be render authors`s popular book', async () => {
      const { getByText } = render(
        <Provider store={store}>
          <RouterContext.Provider value={{ asPath: '', query: { pathname: '/cart'} }}>
            <Index
              q={'유유'}
              book={fixture.book}
              author={fixture.author}
              categories={fixture.book.aggregations}
            />
          </RouterContext.Provider>
        </Provider>,
      );
      expect(getByText(/미남들과 함께 가는 성교육 1화/)).toHaveTextContent(
        '<[미즈] 미남들과 함께 가는 성교육 1화> 외 11권',
      );
    });
  });

  it('should be clickable show more authors button', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <RouterContext.Provider value={{ asPath: '', query: { pathname: '/cart'} }}>
          <Index
            q={'유유'}
            book={fixture.book}
            author={fixture.author}
            categories={fixture.book.aggregations}
          />
        </RouterContext.Provider>
      </Provider>,
    );
    const container = getByText(/명 더 보기/);
    expect(container).toHaveTextContent('명 더 보기');
    act(() => {
      fireEvent.click(container, {});
    });

    expect(container).toHaveTextContent('접기');
  });

  // Todo 저자가 없을 경우, 도서가 없을 경우
  it.todo('should be render empty state');

  // Todo 페이지네이션 확인
  it.todo('shoud be render last or goto first button');

  it('should be render category tab', () => {
    const { getByText } = render(
      <Provider store={store}>
        <RouterContext.Provider value={{ asPath: '', query: { pathname: '/cart'} }}>
          <Index
            q={'유유'}
            book={fixture.book}
            author={fixture.author}
            categories={fixture.book.aggregations}
          />
        </RouterContext.Provider>
      </Provider>,
    );
    const container = getByText(/성공\/삶의자세/);

    expect(container).toHaveTextContent('성공/삶의자세');
  })
});
