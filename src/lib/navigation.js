// const pages = [
//   { id: 'dashboard', label: 'Dashboard' },
//   { id: 'customers', label: 'Customer Products' },
//   { id: 'manage', label: 'Manage Products' },
//   { id: 'sales', label: 'Product Sales' }
// ];

// export function navigateFromPageSearch(event, navigate) {
//   if (event.key !== 'Enter') return;

//   const query = event.currentTarget.value.trim().toLowerCase();
//   if (!query) return;
//   const exactPage = pages.find((item) => item.id === query || item.label.toLowerCase() === query);
//   const matchingPages = pages.filter((item) => item.label.toLowerCase().includes(query));
//   const page = exactPage || (matchingPages.length === 1 ? matchingPages[0] : null);

//   if (page) {
//     navigate(page.id);
//   }
// }
