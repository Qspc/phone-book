// import React, { useState } from 'react';
// import * as React from 'react';
// import { useState } from 'react';
import { useState } from 'react';

interface usePaginationSchema {
  data: any;
  itemsPerPage: any;
}

export default function UsePagination({ data, itemsPerPage }: usePaginationSchema) {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  function currentData() {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }

  function next() {
    setCurrentPage((currentPage: any) => Math.min(currentPage + 1, maxPage));
  }

  function prev() {
    setCurrentPage((currentPage: any) => Math.max(currentPage - 1, 1));
  }

  function jump(page: any) {
    const pageNumber = Math.max(1, page);
    setCurrentPage(() => Math.min(pageNumber, maxPage));
  }

  return { next, prev, jump, currentData, currentPage, maxPage };
}
