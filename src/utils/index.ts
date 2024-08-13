import { PaginationDto } from './pagination.dto';

export function getPagination(
  pagination: PaginationDto,
  count: number,
  total_records: number,
) {
  const { page = 1, limit = 10 } = pagination;
  const total_pages = Math.ceil(total_records / limit);
  const has_previous = Boolean(page - 1);
  const has_next = total_pages > page;

  let start = page;
  if (page > 1) start = limit * (page - 1) + 1;
  let end = start + limit - 1;
  if (start > total_records) start = total_records;
  if (end > total_records) end = total_records;

  return {
    page,
    limit,
    count,
    total_pages,
    total_records,
    has_previous,
    has_next,
    description: `${start} to ${end} of ${total_records}`,
  };
}

export function success(data: Record<string, unknown> | null, message: string) {
  return { status: 'success', message, data };
}
