import { Button, Box } from '@chakra-ui/react';
import { FormEvent, useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    ({ pageParam = null }) =>
      api
        .get('/api/images', {
          params: { after: pageParam },
        })
        .then(response => response.data),
    {
      getNextPageParam: lastPage => lastPage.after ?? null,
    }
  );

  function loadMoreImages(event: FormEvent): void {
    event.preventDefault();
    fetchNextPage();
  }

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    if (data) {
      return data.pages.flatMap(page => page.data);
    }
    return null;
  }, [data]);

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return <Error />;
  }

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        {hasNextPage && (
          <Button
            type="button"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={loadMoreImages}
            mt="10"
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
