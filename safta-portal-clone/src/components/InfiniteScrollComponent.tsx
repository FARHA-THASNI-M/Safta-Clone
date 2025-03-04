import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData, selectData, selectStatus, selectHasMore } from '../slice/dataSlice';
import { RootState, AppDispatch } from '../lib/redux/store';
import {  Box, Typography, CircularProgress } from '@mui/material';

const InfiniteScrollComponent: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const items = useSelector((state: RootState) => selectData(state));
  const status = useSelector((state: RootState) => selectStatus(state));
  const hasMore = useSelector((state: RootState) => selectHasMore(state));
  const loader = useRef<HTMLDivElement | null>(null);

  const loadMoreData = () => {
    if (status === 'loading' || !hasMore) return;
    dispatch(fetchData(1));  
  };

  const handleScroll = () => {
    if (loader.current) {
      const loaderPosition = loader.current.getBoundingClientRect();
      if (loaderPosition.top <= window.innerHeight) {
        loadMoreData();
      }
    }
  };

  useEffect(() => {
    loadMoreData();
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
     <Box
  sx={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 2,
  }}
>
  {items.map((item) => (
    <Box
      key={item.id}
      sx={{
        width: '100%', 
        '@media (min-width:600px)': { width: '33.33%' }, 
        '@media (min-width:900px)': { width: '33.33%' }, 
        p: 2,
        border: '1px solid #ddd',
        borderRadius: 2,
        textAlign: 'center',
        backgroundColor: '#f0f0f0',
      }}
    >
      <Typography variant="h6">{item.title}</Typography>
      <Typography variant="body2">{item.description}</Typography>
    </Box>
  ))}
</Box>


      {status === 'loading' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {hasMore && (
        <Box ref={loader} sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography variant="body2">Loading more...</Typography>
        </Box>
      )}

      {!hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Typography variant="body2">No more data</Typography>
        </Box>
      )}
    </div>
  );
};

export default InfiniteScrollComponent;
