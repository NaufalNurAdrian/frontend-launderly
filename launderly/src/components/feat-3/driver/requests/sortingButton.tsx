// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { ArrowUp, ArrowDown, MapPin } from 'lucide-react';

// const SortingButtons = ({ onSort }) => {
//   const [timeSort, setTimeSort] = useState('asc');
//   const [locationSort, setLocationSort] = useState(null);

//   const handleTimeSort = () => {
//     const newOrder = timeSort === 'asc' ? 'desc' : 'asc';
//     setTimeSort(newOrder);
//     onSort({ sort: 'time', order: newOrder });
//   };

//   const handleLocationSort = (type) => {
//     setLocationSort(type);
//     onSort({ sort: 'distance', order: type });
//   };

//   return (
//     <div className="flex space-x-2">
//       <Button 
//         onClick={handleTimeSort}
//         variant="outline"
//       >
//         {timeSort === 'asc' ? <ArrowUp /> : <ArrowDown />}
//         Waktu
//       </Button>
      
//       <Button 
//         onClick={() => handleLocationSort('nearest')}
//         variant={locationSort === 'nearest' ? 'default' : 'outline'}
//       >
//         <MapPin className="mr-2" />
//         Terdekat
//       </Button>
      
//       <Button 
//         onClick={() => handleLocationSort('farthest')}
//         variant={locationSort === 'farthest' ? 'default' : 'outline'}
//       >
//         <MapPin className="mr-2" />
//         Terjauh
//       </Button>
//     </div>
//   );
// };

// export default SortingButtons;