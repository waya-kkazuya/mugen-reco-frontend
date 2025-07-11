import { useState } from 'react';
import Category from '../../components/Category';
import Posts from '../../components/Posts';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  return (
    <div className="p-2 sm:p-4">
      <div className="mb-6 sm:mb-10">
        <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
      <Posts selectedCategory={selectedCategory} />
    </div>
  );
}
