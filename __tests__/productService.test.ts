import {API_BASE_URL} from '../src/constants/api';
import {getProductsPage} from '../src/modules/dashboard/productService';

const response = {
  data: {
    page: 1,
    limit: 10,
    totalPages: 1,
    previousPage: false,
    nextPage: false,
    totalItems: 2,
    currentPageItems: 2,
    data: [
      {
        category: 'mens-watches',
        id: 61,
        images: ['https://example.com/watch.jpg'],
        price: 120,
        thumbnail: 'https://example.com/thumbnail.jpg',
        title: 'Leather Straps Wristwatch',
      },
      {
        category: 'smartphones',
        id: 1,
        images: [],
        price: 549,
        thumbnail: 'https://example.com/phone.jpg',
        title: 'Phone',
      },
    ],
  },
  message: 'Random products fetched successfully',
  success: true,
};

afterEach(() => {
  jest.restoreAllMocks();
});

test('requests products from the public endpoint using the supported fields', async () => {
  const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    text: async () => JSON.stringify(response),
  } as Response);

  const result = await getProductsPage();

  expect(fetchMock).toHaveBeenCalledWith(
    `${API_BASE_URL}/public/randomproducts?page=1&limit=10&inc=category%2Cprice%2Cthumbnail%2Cimages%2Ctitle%2Cid`,
    expect.objectContaining({method: 'GET'}),
  );
  expect(result).toEqual({
    products: response.data.data,
    total: 2,
    page: 1,
    limit: 10,
  });
});

test('searches returned products by title or category', async () => {
  jest.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    text: async () => JSON.stringify(response),
  } as Response);

  const categoryResult = await getProductsPage(1, 'mens-watches');
  const titleResult = await getProductsPage(1, 'Phone');

  expect(categoryResult.products).toEqual([response.data.data[0]]);
  expect(titleResult.products).toEqual([response.data.data[1]]);
  expect(categoryResult.total).toBe(2);
});
