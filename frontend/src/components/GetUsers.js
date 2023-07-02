export async function getUsers(params) {
    const { search, sort, page, limit } = params;
  
    let url = `http://localhost:8081/api/allUsers?`;
  
    if (search) {
      url += `search=${encodeURIComponent(search)}&`;
    }
  
    if (sort) {
      url += `sort=${encodeURIComponent(sort)}&`;
    }
  
    if (page) {
      url += `page=${encodeURIComponent(page)}&`;
    }
  
    if (limit) {
      url += `limit=${encodeURIComponent(limit)}&`;
    }
  
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  