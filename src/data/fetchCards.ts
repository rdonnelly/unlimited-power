import qs from 'qs';

import {
  buildCardFilters,
  type CardFilters,
  hasNoSelections,
  matchesAspects,
} from '@data/CardFilters';
import type { CardsResponse } from '@data/CardsResponse';
import { HttpError } from '@data/queryHelpers';

export const PAGE_SIZE = 50;

export async function fetchCards(
  filters: CardFilters,
  page: number,
  signal?: AbortSignal,
): Promise<CardsResponse> {
  if (hasNoSelections(filters)) {
    return {
      data: [],
      meta: {
        pagination: { page: 1, pageSize: PAGE_SIZE, pageCount: 1, total: 0 },
      },
    };
  }

  while (true) {
    signal?.throwIfAborted();
    const query = qs.stringify({
      sort: ['type.sortValue:asc', 'expansion.id:asc', 'cardNumber:asc'],
      pagination: { page, pageSize: PAGE_SIZE },
      filters: buildCardFilters(filters),
    });
    const response = await fetch(
      `https://admin.starwarsunlimited.com/api/card-list?locale=en&${query}`,
      { signal },
    );
    if (!response.ok) throw new HttpError(response.status);
    const body = (await response.json()) as CardsResponse;
    signal?.throwIfAborted();
    const pagination = body.meta.pagination;
    if (
      pagination.page !== page ||
      !Number.isInteger(pagination.pageCount) ||
      pagination.pageCount < 0
    ) {
      throw new Error('Invalid card pagination');
    }
    const data = body.data.filter((card) =>
      matchesAspects(card, filters.aspects),
    );
    if (data.length || page >= pagination.pageCount) {
      return { ...body, data };
    }
    // An empty filtered page is not the end of the server's result set.
    page += 1;
  }
}
