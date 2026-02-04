import { useState, useCallback, useEffect } from 'react'

export function usePaginatedData(fetchFunction, limit = 20) {
  const [data, setData] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const loadData = useCallback(async (reset = false) => {
    const currentOffset = reset ? 0 : offset
    const isInitialLoad = currentOffset === 0

    if (isInitialLoad) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const params = {
        limit,
        offset: currentOffset,
      }

      // Add search query if exists
      if (searchQuery) {
        params.search = searchQuery
      }

      const response = await fetchFunction(params)
      const newData = response?.data?.data?.response || response?.data?.response || []
      const count = response?.data?.data?.count || response?.data?.count || 0

      if (reset) {
        setData(newData)
        setOffset(limit)
      } else {
        setData(prev => [...prev, ...newData])
        setOffset(prev => prev + limit)
      }

      // Check if there's more data
      setHasMore(currentOffset + newData.length < count)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [fetchFunction, limit, offset, searchQuery])

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      loadData(false)
    }
  }, [loadData, isLoadingMore, hasMore])

  const search = useCallback((query) => {
    setSearchQuery(query)
    setOffset(0)
    setHasMore(true)
  }, [])

  const reset = useCallback(() => {
    setData([])
    setOffset(0)
    setHasMore(true)
    setSearchQuery('')
  }, [])

  // Reload data when search query changes
  useEffect(() => {
    if (searchQuery !== '') {
      loadData(true)
    }
  }, [searchQuery])

  return {
    data,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    search,
    reset,
    loadData,
    searchQuery
  }
}
